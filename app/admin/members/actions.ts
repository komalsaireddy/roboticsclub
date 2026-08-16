"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireMemberPermission() {
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
    perm: "manage_members",
  });

  if (error) {
    throw new Error(
      "Unable to verify member permissions."
    );
  }

  if (!allowed) {
    throw new Error(
      "You do not have permission to manage members."
    );
  }

  return {
    supabase,
    user,
  };
}

/* ============================================================
   UPDATE MEMBER
============================================================ */

export async function updateMember(
  formData: FormData
): Promise<void> {
  const {
    supabase,
  } = await requireMemberPermission();

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  const fullName = String(
    formData.get("full_name") ?? ""
  ).trim();

  const avatarUrl = String(
    formData.get("avatar_url") ?? ""
  ).trim();

  const roleId = String(
    formData.get("role_id") ?? ""
  ).trim();

  if (!id) {
    throw new Error(
      "Member ID is missing."
    );
  }

  if (!roleId) {
    throw new Error(
      "Role is required."
    );
  }

  const {
    data: member,
    error: findError,
  } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .maybeSingle();

  if (findError) {
    throw new Error(
      findError.message
    );
  }

  if (!member) {
    throw new Error(
      "Member not found."
    );
  }

  const {
    error,
  } =
    await supabase
      .from("profiles")
      .update({
        full_name:
          fullName || null,
        avatar_url:
          avatarUrl || null,
        role_id: roleId,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/members");
  revalidatePath("/admin/roles");

  redirect("/admin/members");
}
