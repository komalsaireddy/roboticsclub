"use server";

import {
  redirect,
} from "next/navigation";

import {
  revalidatePath,
} from "next/cache";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

/* ============================================================
   PERMISSION
============================================================ */

async function requireProjectPermission() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: allowed,
    error: permissionError,
  } =
    await supabase.rpc(
      "has_permission",
      {
        perm: "manage_projects",
      }
    );

  if (permissionError) {
    console.error(
      "Permission check failed:",
      permissionError
    );

    throw new Error(
      "Unable to verify permissions."
    );
  }

  if (!allowed) {
    throw new Error(
      "You do not have permission to manage projects."
    );
  }

  return supabase;
}

/* ============================================================
   CREATE
============================================================ */

export async function createProject(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireProjectPermission();

  const number =
    String(
      formData.get(
        "number"
      ) ?? ""
    ).trim();

  const title =
    String(
      formData.get(
        "title"
      ) ?? ""
    ).trim();

  const category =
    String(
      formData.get(
        "category"
      ) ?? ""
    ).trim();

  const description =
    String(
      formData.get(
        "description"
      ) ?? ""
    ).trim();

  const imageUrl =
    String(
      formData.get(
        "image_url"
      ) ?? ""
    ).trim();

  const imageStoragePath =
    String(
      formData.get(
        "image_storage_path"
      ) ?? ""
    ).trim();

  const documentUrl =
    String(
      formData.get(
        "document_url"
      ) ?? ""
    ).trim();

  const documentStatus =
    String(
      formData.get(
        "document_status"
      ) ??
        "available"
    ).trim();

  const isPublished =
    formData.get(
      "is_published"
    ) === "on";

  if (!title) {
    throw new Error(
      "Project title is required."
    );
  }

  const {
    error,
  } =
    await supabase
      .from("projects")
      .insert({
        number:
          number || null,

        title,

        category:
          category || null,

        description:
          description || null,

        image_url:
          imageUrl || null,

        image_storage_path:
          imageStoragePath ||
          null,

        document_url:
          documentUrl || null,

        document_status:
          documentStatus ||
          "available",

        is_published:
          isPublished,
      });

  if (error) {
    console.error(
      "Create project failed:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(
    "/admin/projects"
  );

  redirect(
    "/admin/projects"
  );
}

/* ============================================================
   UPDATE
============================================================ */

export async function updateProject(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireProjectPermission();

  const id =
    String(
      formData.get(
        "id"
      ) ?? ""
    ).trim();

  const number =
    String(
      formData.get(
        "number"
      ) ?? ""
    ).trim();

  const title =
    String(
      formData.get(
        "title"
      ) ?? ""
    ).trim();

  const category =
    String(
      formData.get(
        "category"
      ) ?? ""
    ).trim();

  const description =
    String(
      formData.get(
        "description"
      ) ?? ""
    ).trim();

  const imageUrl =
    String(
      formData.get(
        "image_url"
      ) ?? ""
    ).trim();

  const imageStoragePath =
    String(
      formData.get(
        "image_storage_path"
      ) ?? ""
    ).trim();

  const oldImageStoragePath =
    String(
      formData.get(
        "old_image_storage_path"
      ) ?? ""
    ).trim();

  const documentUrl =
    String(
      formData.get(
        "document_url"
      ) ?? ""
    ).trim();

  const documentStatus =
    String(
      formData.get(
        "document_status"
      ) ??
        "available"
    ).trim();

  const isPublished =
    formData.get(
      "is_published"
    ) === "on";

  if (!id) {
    throw new Error(
      "Project ID is missing."
    );
  }

  if (!title) {
    throw new Error(
      "Project title is required."
    );
  }

  /* ==========================================================
     FIND PROJECT
  ========================================================== */

  const {
    data: existingProject,
    error: findError,
  } =
    await supabase
      .from("projects")
      .select(
        "id, image_storage_path"
      )
      .eq("id", id)
      .maybeSingle();

  if (findError) {
    console.error(
      "Project lookup failed:",
      findError
    );

    throw new Error(
      findError.message
    );
  }

  if (!existingProject) {
    throw new Error(
      "Project not found."
    );
  }

  /* ==========================================================
     UPDATE
  ========================================================== */

  const finalStoragePath =
    imageStoragePath ||
    existingProject.image_storage_path ||
    null;

  const finalImageUrl =
    imageUrl || null;

  const {
    data: updatedProject,
    error: updateError,
  } =
    await supabase
      .from("projects")
      .update({
        number:
          number || null,

        title,

        category:
          category || null,

        description:
          description || null,

        image_url:
          finalImageUrl,

        image_storage_path:
          finalStoragePath,

        document_url:
          documentUrl || null,

        document_status:
          documentStatus ||
          "available",

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
      "Update project failed:",
      updateError
    );

    throw new Error(
      updateError.message
    );
  }

  if (!updatedProject) {
    throw new Error(
      "Project was not updated."
    );
  }

  /* ==========================================================
     DELETE OLD IMAGE AFTER SUCCESSFUL UPDATE
  ========================================================== */

  if (
    oldImageStoragePath &&
    finalStoragePath &&
    oldImageStoragePath !==
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
          oldImageStoragePath,
        ]);

    if (storageError) {
      console.error(
        "Old project image cleanup failed:",
        storageError
      );
    }
  }

  /* ==========================================================
     REFRESH
  ========================================================== */

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(
    "/admin/projects"
  );

  redirect(
    "/admin/projects"
  );
}

/* ============================================================
   DELETE
============================================================ */

export async function deleteProject(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireProjectPermission();

  const id =
    String(
      formData.get(
        "id"
      ) ?? ""
    ).trim();

  if (!id) {
    throw new Error(
      "Project ID is missing."
    );
  }

  /* ==========================================================
     FIND PROJECT
  ========================================================== */

  const {
    data: existingProject,
    error: findError,
  } =
    await supabase
      .from("projects")
      .select(
        "id, image_storage_path"
      )
      .eq("id", id)
      .maybeSingle();

  if (findError) {
    console.error(
      "Project lookup failed:",
      findError
    );

    throw new Error(
      findError.message
    );
  }

  if (!existingProject) {
    throw new Error(
      "Project not found."
    );
  }

  /* ==========================================================
     DELETE STORAGE IMAGE
  ========================================================== */

  if (
    existingProject.image_storage_path
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
          existingProject.image_storage_path,
        ]);

    if (storageError) {
      console.error(
        "Project image deletion failed:",
        storageError
      );

      throw new Error(
        "Could not delete project image."
      );
    }
  }

  /* ==========================================================
     DELETE DATABASE RECORD
  ========================================================== */

  const {
    error: deleteError,
  } =
    await supabase
      .from("projects")
      .delete()
      .eq("id", id);

  if (deleteError) {
    console.error(
      "Delete project failed:",
      deleteError
    );

    throw new Error(
      deleteError.message
    );
  }

  /* ==========================================================
     REFRESH
  ========================================================== */

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(
    "/admin/projects"
  );

  redirect(
    "/admin/projects"
  );
}