"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/* ============================================================
   HELPERS
============================================================ */

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createUniqueSlug(
  supabase: Awaited<
    ReturnType<typeof createSupabaseServerClient>
  >,
  title: string,
  excludeId?: string
): Promise<string> {
  const baseSlug =
    createSlug(title) ||
    `event-${Date.now()}`;

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    let query = supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const {
      data,
      error,
    } = await query.maybeSingle();

    if (error) {
      throw new Error(
        `Unable to check event slug: ${error.message}`
      );
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/* ============================================================
   PERMISSION
============================================================ */

async function requireEventPermission() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: allowed,
    error: permissionError,
  } = await supabase.rpc(
    "has_permission",
    {
      perm: "manage_events",
    }
  );

  if (permissionError) {
    console.error(
      "Event permission check failed:",
      permissionError
    );

    throw new Error(
      "Unable to verify event permissions."
    );
  }

  if (!allowed) {
    throw new Error(
      "You do not have permission to manage events."
    );
  }

  return supabase;
}

/* ============================================================
   CREATE EVENT
============================================================ */

export async function createEvent(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireEventPermission();

  const number =
    String(
      formData.get("number") ?? ""
    ).trim();

  const title =
    String(
      formData.get("title") ?? ""
    ).trim();

  const type =
    String(
      formData.get("type") ?? ""
    ).trim();

  const description =
    String(
      formData.get("description") ?? ""
    ).trim();

  const coverImageUrl =
    String(
      formData.get(
        "cover_image_url"
      ) ?? ""
    ).trim();

  const coverStoragePath =
    String(
      formData.get(
        "cover_storage_path"
      ) ?? ""
    ).trim();

  const rulesUrl =
    String(
      formData.get("rules_url") ?? ""
    ).trim();

  const registerUrl =
    String(
      formData.get("register_url") ?? ""
    ).trim();

  const eventDate =
    String(
      formData.get("event_date") ?? ""
    ).trim();

  const eventEndDate =
    String(
      formData.get(
        "event_end_date"
      ) ?? ""
    ).trim();

  const chapter =
    String(
      formData.get("chapter") ?? ""
    ).trim();

  const featured =
    formData.get("featured") === "on";

  const isPublished =
    formData.get(
      "is_published"
    ) === "on";

  /* ==========================================================
     VALIDATION
  ========================================================== */

  if (!title) {
    throw new Error(
      "Event title is required."
    );
  }

  /* ==========================================================
     SLUG
  ========================================================== */

  const slug =
    await createUniqueSlug(
      supabase,
      title
    );

  /* ==========================================================
     INSERT
  ========================================================== */

  const {
    error,
  } =
    await supabase
      .from("events")
      .insert({
        slug,

        number:
          number || null,

        title,

        type:
          type || null,

        description:
          description || null,

        cover_image_url:
          coverImageUrl || null,

        cover_storage_path:
          coverStoragePath || null,

        rules_url:
          rulesUrl || null,

        register_url:
          registerUrl || null,

        event_date:
          eventDate || null,

        event_end_date:
          eventEndDate || null,

        chapter:
          chapter || null,

        featured,

        is_published:
          isPublished,
      });

  if (error) {
    console.error(
      "Create event failed:",
      error
    );

    throw new Error(
      error.message
    );
  }

  /* ==========================================================
     REFRESH
  ========================================================== */

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin");
  revalidatePath("/admin/events");

  redirect("/admin/events");
}

/* ============================================================
   UPDATE EVENT
============================================================ */

export async function updateEvent(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireEventPermission();

  const id =
    String(
      formData.get("id") ?? ""
    ).trim();

  const number =
    String(
      formData.get("number") ?? ""
    ).trim();

  const title =
    String(
      formData.get("title") ?? ""
    ).trim();

  const type =
    String(
      formData.get("type") ?? ""
    ).trim();

  const description =
    String(
      formData.get(
        "description"
      ) ?? ""
    ).trim();

  const coverImageUrl =
    String(
      formData.get(
        "cover_image_url"
      ) ?? ""
    ).trim();

  const coverStoragePath =
    String(
      formData.get(
        "cover_storage_path"
      ) ?? ""
    ).trim();

  const oldCoverStoragePath =
    String(
      formData.get(
        "old_cover_storage_path"
      ) ?? ""
    ).trim();

  const rulesUrl =
    String(
      formData.get("rules_url") ?? ""
    ).trim();

  const registerUrl =
    String(
      formData.get("register_url") ?? ""
    ).trim();

  const eventDate =
    String(
      formData.get(
        "event_date"
      ) ?? ""
    ).trim();

  const eventEndDate =
    String(
      formData.get(
        "event_end_date"
      ) ?? ""
    ).trim();

  const chapter =
    String(
      formData.get("chapter") ?? ""
    ).trim();

  const featured =
    formData.get("featured") === "on";

  const isPublished =
    formData.get(
      "is_published"
    ) === "on";

  /* ==========================================================
     VALIDATION
  ========================================================== */

  if (!id) {
    throw new Error(
      "Event ID is missing."
    );
  }

  if (!title) {
    throw new Error(
      "Event title is required."
    );
  }

  /* ==========================================================
     FIND EVENT
  ========================================================== */

  const {
    data: existingEvent,
    error: findError,
  } =
    await supabase
      .from("events")
      .select(
        "id, slug, cover_storage_path"
      )
      .eq("id", id)
      .maybeSingle();

  if (findError) {
    console.error(
      "Event lookup failed:",
      findError
    );

    throw new Error(
      findError.message
    );
  }

  if (!existingEvent) {
    throw new Error(
      "Event not found."
    );
  }

  /* ==========================================================
     SLUG
  ========================================================== */

  const slug =
    await createUniqueSlug(
      supabase,
      title,
      id
    );

  /* ==========================================================
     STORAGE PATH
  ========================================================== */

  const finalStoragePath =
    coverStoragePath ||
    existingEvent.cover_storage_path ||
    null;

  /* ==========================================================
     UPDATE
  ========================================================== */

  const {
    data: updatedEvent,
    error: updateError,
  } =
    await supabase
      .from("events")
      .update({
        slug,

        number:
          number || null,

        title,

        type:
          type || null,

        description:
          description || null,

        cover_image_url:
          coverImageUrl || null,

        cover_storage_path:
          finalStoragePath,

        rules_url:
          rulesUrl || null,

        register_url:
          registerUrl || null,

        event_date:
          eventDate || null,

        event_end_date:
          eventEndDate || null,

        chapter:
          chapter || null,

        featured,

        is_published:
          isPublished,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .single();

  if (updateError) {
    console.error(
      "Update event failed:",
      updateError
    );

    throw new Error(
      updateError.message
    );
  }

  if (!updatedEvent) {
    throw new Error(
      "Event was not updated."
    );
  }

  /* ==========================================================
     DELETE OLD IMAGE
  ========================================================== */

  if (
    oldCoverStoragePath &&
    oldCoverStoragePath !==
      finalStoragePath
  ) {
    const {
      error:
        storageError,
    } =
      await supabase.storage
        .from(
          "roboticsclub-media"
        )
        .remove([
          oldCoverStoragePath,
        ]);

    if (storageError) {
      console.error(
        "Old event image cleanup failed:",
        storageError
      );
    }
  }

  /* ==========================================================
     REFRESH
  ========================================================== */

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin");
  revalidatePath("/admin/events");

  redirect("/admin/events");
}

/* ============================================================
   DELETE EVENT
============================================================ */

export async function deleteEvent(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireEventPermission();

  const id =
    String(
      formData.get("id") ?? ""
    ).trim();

  if (!id) {
    throw new Error(
      "Event ID is missing."
    );
  }

  /* ==========================================================
     FIND EVENT
  ========================================================== */

  const {
    data: existingEvent,
    error: findError,
  } =
    await supabase
      .from("events")
      .select(
        "id, cover_storage_path"
      )
      .eq("id", id)
      .maybeSingle();

  if (findError) {
    console.error(
      "Event lookup failed:",
      findError
    );

    throw new Error(
      findError.message
    );
  }

  if (!existingEvent) {
    throw new Error(
      "Event not found."
    );
  }

  /* ==========================================================
     DELETE DATABASE RECORD
  ========================================================== */

  const {
    error: deleteError,
  } =
    await supabase
      .from("events")
      .delete()
      .eq("id", id);

  if (deleteError) {
    console.error(
      "Delete event failed:",
      deleteError
    );

    throw new Error(
      deleteError.message
    );
  }

  /* ==========================================================
     DELETE STORAGE IMAGE
  ========================================================== */

  if (
    existingEvent.cover_storage_path
  ) {
    const {
      error:
        storageError,
    } =
      await supabase.storage
        .from(
          "roboticsclub-media"
        )
        .remove([
          existingEvent.cover_storage_path,
        ]);

    if (storageError) {
      console.error(
        "Event image deletion failed:",
        storageError
      );
    }
  }

  /* ==========================================================
     REFRESH
  ========================================================== */

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin");
  revalidatePath("/admin/events");

  redirect("/admin/events");
}