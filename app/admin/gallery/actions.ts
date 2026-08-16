"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const { error } =
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
      });

  if (error) {
    console.error(
      "Create gallery image failed:",
      error
    );

    throw new Error(
      error.message
    );
  }

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
      .select(
        "id, storage_path"
      )
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

  const { error } =
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
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  /*
   * Remove old file only when
   * a new file was uploaded.
   */

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
    }
  }

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
      .select(
        "id, storage_path"
      )
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

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");

  redirect("/admin/gallery");
}