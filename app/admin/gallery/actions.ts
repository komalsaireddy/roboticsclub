"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  createAuditLog,
} from "@/lib/audit/log";

/* ============================================================
   PERMISSION
============================================================ */

async function requireGalleryPermission() {
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
    error,
  } = await supabase.rpc(
    "has_permission",
    {
      perm: "manage_gallery",
    }
  );

  if (error) {
    console.error(
      "Gallery permission error:",
      error
    );

    throw new Error(
      "Unable to verify gallery permissions."
    );
  }

  if (!allowed) {
    throw new Error(
      "You do not have permission to manage the gallery."
    );
  }

  return {
    supabase,
    user,
  };
}

/* ============================================================
   CREATE
============================================================ */

export async function createGalleryImage(
  formData: FormData
): Promise<void> {
  const {
    supabase,
    user,
  } = await requireGalleryPermission();

  const imageUrl = String(
    formData.get("image_url") ?? ""
  ).trim();

  const storagePath = String(
    formData.get("storage_path") ?? ""
  ).trim();

  const caption = String(
    formData.get("caption") ?? ""
  ).trim();

  const altText = String(
    formData.get("alt_text") ?? ""
  ).trim();

  const eventId = String(
    formData.get("event_id") ?? ""
  ).trim();

  const sortOrder = Number.parseInt(
    String(
      formData.get("sort_order") ?? "0"
    ),
    10
  );

  const isPublished =
    formData.get("is_published") ===
    "on";

  if (!imageUrl) {
    throw new Error(
      "Image upload is required."
    );
  }

  if (!storagePath) {
    throw new Error(
      "Storage path is missing."
    );
  }

  if (Number.isNaN(sortOrder)) {
    throw new Error(
      "Invalid sort order."
    );
  }

  const { data: created, error } =
    await supabase
      .from("gallery_images")
      .insert({
        image_url: imageUrl,
        storage_path: storagePath,
        caption:
          caption || null,
        alt_text:
          altText || null,
        event_id:
          eventId || null,
        sort_order:
          sortOrder,
        is_published:
          isPublished,
        created_by:
          user.id,
      })
      .select(
        "id, image_url, storage_path, caption, alt_text, event_id, sort_order, is_published"
      )
      .single();

  if (error) {
    console.error(
      "Create gallery image failed:",
      error
    );

    throw new Error(
      error.message
    );
  }

  await createAuditLog({
    supabase,
    userId: user.id,
    action:
      "gallery_image_created",
    entityType:
      "gallery_image",
    entityId:
      created.id,
    description:
      `Uploaded gallery image${caption ? `: ${caption}` : ""}`,
    metadata: {
      image_url:
        created.image_url,
      storage_path:
        created.storage_path,
      caption:
        created.caption,
      alt_text:
        created.alt_text,
      event_id:
        created.event_id,
      sort_order:
        created.sort_order,
      is_published:
        created.is_published,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");

  redirect("/admin/gallery");
}

/* ============================================================
   UPDATE
============================================================ */

export async function updateGalleryImage(
  formData: FormData
): Promise<void> {
  const {
    supabase,
    user,
  } =
    await requireGalleryPermission();

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  const imageUrl = String(
    formData.get("image_url") ?? ""
  ).trim();

  const storagePath = String(
    formData.get("storage_path") ?? ""
  ).trim();

  const oldStoragePath = String(
    formData.get(
      "old_storage_path"
    ) ?? ""
  ).trim();

  const caption = String(
    formData.get("caption") ?? ""
  ).trim();

  const altText = String(
    formData.get("alt_text") ?? ""
  ).trim();

  const eventId = String(
    formData.get("event_id") ?? ""
  ).trim();

  const sortOrder = Number.parseInt(
    String(
      formData.get("sort_order") ?? "0"
    ),
    10
  );

  const isPublished =
    formData.get("is_published") ===
    "on";

  if (!id) {
    throw new Error(
      "Gallery image ID is missing."
    );
  }

  if (!imageUrl) {
    throw new Error(
      "Image is required."
    );
  }

  if (Number.isNaN(sortOrder)) {
    throw new Error(
      "Invalid sort order."
    );
  }

  const {
    data: existing,
    error: findError,
  } =
    await supabase
      .from("gallery_images")
      .select(`
        id,
        image_url,
        storage_path,
        caption,
        alt_text,
        event_id,
        sort_order,
        is_published
      `)
      .eq("id", id)
      .maybeSingle();

  if (findError) {
    throw new Error(
      findError.message
    );
  }

  if (!existing) {
    throw new Error(
      "Gallery image not found."
    );
  }

  const {
    data: updated,
    error,
  } =
    await supabase
      .from("gallery_images")
      .update({
        image_url:
          imageUrl,
        storage_path:
          storagePath ||
          existing.storage_path ||
          null,
        caption:
          caption || null,
        alt_text:
          altText || null,
        event_id:
          eventId || null,
        sort_order:
          sortOrder,
        is_published:
          isPublished,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        id,
        image_url,
        storage_path,
        caption,
        alt_text,
        event_id,
        sort_order,
        is_published
      `)
      .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  /*
   * Remove old file only when
   * a new file was uploaded.
   */

  let oldFileDeleted =
    false;

  if (
    storagePath &&
    oldStoragePath &&
    storagePath !== oldStoragePath
  ) {
    const {
      error: storageError,
    } = await supabase.storage
      .from(
        "roboticsclub-media"
      )
      .remove([
        oldStoragePath,
      ]);

    if (storageError) {
      console.error(
        "Old image cleanup failed:",
        storageError
      );
    } else {
      oldFileDeleted = true;
    }
  }

  await createAuditLog({
    supabase,
    userId: user.id,
    action:
      "gallery_image_updated",
    entityType:
      "gallery_image",
    entityId:
      id,
    description:
      `Updated gallery image${updated.caption ? `: ${updated.caption}` : ""}`,
    metadata: {
      changes: {
        image_changed:
          existing.image_url !==
          updated.image_url,

        storage_file_changed:
          existing.storage_path !==
          updated.storage_path,

        caption_changed:
          existing.caption !==
          updated.caption,

        alt_text_changed:
          existing.alt_text !==
          updated.alt_text,

        event_changed:
          existing.event_id !==
          updated.event_id,

        sort_order_changed:
          existing.sort_order !==
          updated.sort_order,

        published_changed:
          existing.is_published !==
          updated.is_published,
      },

      before: {
        image_url:
          existing.image_url,
        storage_path:
          existing.storage_path,
        caption:
          existing.caption,
        alt_text:
          existing.alt_text,
        event_id:
          existing.event_id,
        sort_order:
          existing.sort_order,
        is_published:
          existing.is_published,
      },

      after: {
        image_url:
          updated.image_url,
        storage_path:
          updated.storage_path,
        caption:
          updated.caption,
        alt_text:
          updated.alt_text,
        event_id:
          updated.event_id,
        sort_order:
          updated.sort_order,
        is_published:
          updated.is_published,
      },

      old_storage_file_deleted:
        oldFileDeleted,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");

  redirect("/admin/gallery");
}

/* ============================================================
   DELETE
============================================================ */

export async function deleteGalleryImage(
  formData: FormData
): Promise<void> {
  const {
    supabase,
    user,
  } =
    await requireGalleryPermission();

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  if (!id) {
    throw new Error(
      "Gallery image ID is missing."
    );
  }

  const {
    data: existing,
    error: findError,
  } =
    await supabase
      .from("gallery_images")
      .select(`
        id,
        image_url,
        storage_path,
        caption,
        alt_text,
        event_id,
        sort_order,
        is_published
      `)
      .eq("id", id)
      .maybeSingle();

  if (findError) {
    throw new Error(
      findError.message
    );
  }

  if (!existing) {
    throw new Error(
      "Gallery image not found."
    );
  }

  /*
   * Delete actual Storage file.
   */

  if (existing.storage_path) {
    const {
      error: storageError,
    } = await supabase.storage
      .from(
        "roboticsclub-media"
      )
      .remove([
        existing.storage_path,
      ]);

    if (storageError) {
      console.error(
        "Storage delete failed:",
        storageError
      );

      throw new Error(
        "Could not delete image file."
      );
    }
  }

  /*
   * Delete database record.
   */

  const { error } =
    await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  /*
   * IMPORTANT:
   * Log the deletion AFTER the
   * gallery record has successfully
   * been deleted.
   */

  await createAuditLog({
    supabase,
    userId: user.id,
    action:
      "gallery_image_deleted",
    entityType:
      "gallery_image",
    entityId:
      id,
    description:
      `Deleted gallery image${existing.caption ? `: ${existing.caption}` : ""}`,
    metadata: {
      deleted_record: {
        image_url:
          existing.image_url,
        storage_path:
          existing.storage_path,
        caption:
          existing.caption,
        alt_text:
          existing.alt_text,
        event_id:
          existing.event_id,
        sort_order:
          existing.sort_order,
        is_published:
          existing.is_published,
      },

      storage_file_deleted:
        Boolean(
          existing.storage_path
        ),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");

  redirect("/admin/gallery");
}
