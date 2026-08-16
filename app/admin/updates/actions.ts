"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

async function requireUpdatePermission() {
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
  } = await supabase.rpc("has_permission", {
    perm: "manage_updates",
  });

  if (error) {
    throw new Error(
      "Unable to verify update permissions."
    );
  }

  if (!allowed) {
    throw new Error(
      "You do not have permission to manage updates."
    );
  }

  return supabase;
}

/* ============================================================
   CREATE
============================================================ */

export async function createUpdate(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireUpdatePermission();

  const dateLabel = String(
    formData.get("date_label") ?? ""
  ).trim();

  const category = String(
    formData.get("category") ?? ""
  ).trim();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const featured =
    formData.get("featured") === "on";

  const isPublished =
    formData.get("is_published") === "on";

  if (!title) {
    throw new Error(
      "Update title is required."
    );
  }

  if (!category) {
    throw new Error(
      "Update category is required."
    );
  }

  const { error } =
    await supabase
      .from("updates")
      .insert({
        date_label:
          dateLabel || null,
        category,
        title,
        description:
          description || null,
        featured,
        is_published:
          isPublished,
      });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/updates");

  redirect("/admin/updates");
}

/* ============================================================
   UPDATE
============================================================ */

export async function updateUpdate(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireUpdatePermission();

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  const dateLabel = String(
    formData.get("date_label") ?? ""
  ).trim();

  const category = String(
    formData.get("category") ?? ""
  ).trim();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const featured =
    formData.get("featured") === "on";

  const isPublished =
    formData.get("is_published") === "on";

  if (!id) {
    throw new Error(
      "Update ID is missing."
    );
  }

  if (!title) {
    throw new Error(
      "Update title is required."
    );
  }

  if (!category) {
    throw new Error(
      "Update category is required."
    );
  }

  const {
    data: existing,
    error: findError,
  } =
    await supabase
      .from("updates")
      .select("id")
      .eq("id", id)
      .maybeSingle();

  if (findError) {
    throw new Error(
      findError.message
    );
  }

  if (!existing) {
    throw new Error(
      "Update not found."
    );
  }

  const { error } =
    await supabase
      .from("updates")
      .update({
        date_label:
          dateLabel || null,
        category,
        title,
        description:
          description || null,
        featured,
        is_published:
          isPublished,
      })
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/updates");

  redirect("/admin/updates");
}

/* ============================================================
   DELETE
============================================================ */

export async function deleteUpdate(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireUpdatePermission();

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  if (!id) {
    throw new Error(
      "Update ID is missing."
    );
  }

  const { error } =
    await supabase
      .from("updates")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/updates");

  redirect("/admin/updates");
}
