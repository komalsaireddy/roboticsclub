"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

const BUCKET = "roboticsclub-media";

async function requireTeamPermission() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: allowed,
    error,
  } =
    await supabase.rpc(
      "has_permission",
      {
        perm: "manage_team",
      }
    );

  if (error) {
    throw new Error(
      "Unable to verify team permissions."
    );
  }

  if (!allowed) {
    throw new Error(
      "You do not have permission to manage the team."
    );
  }

  return supabase;
}

function getStoragePathFromPublicUrl(
  url: string | null | undefined
) {
  if (!url) {
    return null;
  }

  const marker =
    `/storage/v1/object/public/${BUCKET}/`;

  const index =
    url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    url.slice(index + marker.length)
  );
}

/* ============================================================
   CREATE
============================================================ */

export async function createTeamMember(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireTeamPermission();

  const name =
    String(
      formData.get("name") ?? ""
    ).trim();

  const position =
    String(
      formData.get("position") ?? ""
    ).trim();

  const year =
    String(
      formData.get("year") ?? ""
    ).trim();

  const category =
    String(
      formData.get("category") ??
        "student"
    ).trim();

  const photoUrl =
    String(
      formData.get("photo_url") ?? ""
    ).trim();

  const linkedinUrl =
    String(
      formData.get("linkedin_url") ?? ""
    ).trim();

  const instagramUrl =
    String(
      formData.get("instagram_url") ?? ""
    ).trim();

  const githubUrl =
    String(
      formData.get("github_url") ?? ""
    ).trim();

  const email =
    String(
      formData.get("email") ?? ""
    ).trim();

  const sortOrder =
    Number.parseInt(
      String(
        formData.get("sort_order") ??
          "0"
      ),
      10
    );

  const isPublished =
    formData.get(
      "is_published"
    ) === "on";

  if (!name) {
    throw new Error(
      "Member name is required."
    );
  }

  if (!position) {
    throw new Error(
      "Member position is required."
    );
  }

  if (!year) {
    throw new Error(
      "Member year is required."
    );
  }

  if (Number.isNaN(sortOrder)) {
    throw new Error(
      "Invalid display order."
    );
  }

  const {
    error,
  } =
    await supabase
      .from("team_members")
      .insert({
        name,
        position,
        year,
        category:
          category || "student",
        photo_url:
          photoUrl || null,
        linkedin_url:
          linkedinUrl || null,
        instagram_url:
          instagramUrl || null,
        github_url:
          githubUrl || null,
        email:
          email || null,
        sort_order:
          sortOrder,
        is_published:
          isPublished,
      });

  if (error) {
    console.error(
      "Create team member failed:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/team");

  redirect("/admin/team");
}

/* ============================================================
   UPDATE
============================================================ */

export async function updateTeamMember(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireTeamPermission();

  const id =
    String(
      formData.get("id") ?? ""
    ).trim();

  const name =
    String(
      formData.get("name") ?? ""
    ).trim();

  const position =
    String(
      formData.get("position") ?? ""
    ).trim();

  const year =
    String(
      formData.get("year") ?? ""
    ).trim();

  const category =
    String(
      formData.get("category") ??
        "student"
    ).trim();

  const photoUrl =
    String(
      formData.get("photo_url") ?? ""
    ).trim();

  const linkedinUrl =
    String(
      formData.get("linkedin_url") ?? ""
    ).trim();

  const instagramUrl =
    String(
      formData.get("instagram_url") ?? ""
    ).trim();

  const githubUrl =
    String(
      formData.get("github_url") ?? ""
    ).trim();

  const email =
    String(
      formData.get("email") ?? ""
    ).trim();

  const sortOrder =
    Number.parseInt(
      String(
        formData.get("sort_order") ??
          "0"
      ),
      10
    );

  const isPublished =
    formData.get(
      "is_published"
    ) === "on";

  if (!id) {
    throw new Error(
      "Team member ID is missing."
    );
  }

  if (!name) {
    throw new Error(
      "Member name is required."
    );
  }

  if (!position) {
    throw new Error(
      "Member position is required."
    );
  }

  if (!year) {
    throw new Error(
      "Member year is required."
    );
  }

  if (Number.isNaN(sortOrder)) {
    throw new Error(
      "Invalid display order."
    );
  }

  const {
    data: existing,
    error: findError,
  } =
    await supabase
      .from("team_members")
      .select(
        "id, photo_url"
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
      "Team member not found."
    );
  }

  const {
    error: updateError,
  } =
    await supabase
      .from("team_members")
      .update({
        name,
        position,
        year,
        category:
          category || "student",
        photo_url:
          photoUrl || null,
        linkedin_url:
          linkedinUrl || null,
        instagram_url:
          instagramUrl || null,
        github_url:
          githubUrl || null,
        email:
          email || null,
        sort_order:
          sortOrder,
        is_published:
          isPublished,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  /* Remove previous Storage image */

  if (
    existing.photo_url &&
    existing.photo_url !== photoUrl
  ) {
    const oldPath =
      getStoragePathFromPublicUrl(
        existing.photo_url
      );

    if (oldPath) {
      const {
        error: storageError,
      } =
        await supabase.storage
          .from(BUCKET)
          .remove([oldPath]);

      if (storageError) {
        console.error(
          "Old team photo cleanup failed:",
          storageError
        );
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/team");

  redirect("/admin/team");
}

/* ============================================================
   DELETE
============================================================ */

export async function deleteTeamMember(
  formData: FormData
): Promise<void> {
  const supabase =
    await requireTeamPermission();

  const id =
    String(
      formData.get("id") ?? ""
    ).trim();

  if (!id) {
    throw new Error(
      "Team member ID is missing."
    );
  }

  const {
    data: existing,
    error: findError,
  } =
    await supabase
      .from("team_members")
      .select(
        "id, photo_url"
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
      "Team member not found."
    );
  }

  const {
    error: deleteError,
  } =
    await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

  if (deleteError) {
    throw new Error(
      deleteError.message
    );
  }

  if (existing.photo_url) {
    const storagePath =
      getStoragePathFromPublicUrl(
        existing.photo_url
      );

    if (storagePath) {
      const {
        error: storageError,
      } =
        await supabase.storage
          .from(BUCKET)
          .remove([
            storagePath,
          ]);

      if (storageError) {
        console.error(
          "Team photo deletion failed:",
          storageError
        );
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/team");

  redirect("/admin/team");
}
