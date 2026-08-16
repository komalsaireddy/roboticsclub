"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

async function requireRolePermission() {
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
      perm: "manage_roles",
    }
  );

  if (error) {
    throw new Error(
      "Unable to verify role permissions."
    );
  }

  if (!allowed) {
    throw new Error(
      "You do not have permission to manage roles."
    );
  }

  return {
    supabase,
    user,
  };
}

/* ============================================================
   CREATE ROLE
============================================================ */

export async function createRole(
  formData: FormData
): Promise<void> {
  const {
    supabase,
  } = await requireRolePermission();

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const rank = Number.parseInt(
    String(
      formData.get("rank") ?? "10"
    ),
    10
  );

  const color = String(
    formData.get("color") ?? "#888780"
  ).trim();

  if (!name) {
    throw new Error(
      "Role name is required."
    );
  }

  if (
    Number.isNaN(rank) ||
    rank < 0 ||
    rank > 100
  ) {
    throw new Error(
      "Rank must be between 0 and 100."
    );
  }

  const {
    error,
  } =
    await supabase
      .from("roles")
      .insert({
        name,
        rank,
        color:
          color || "#888780",
      });

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/roles");
  revalidatePath("/admin/members");

  redirect("/admin/roles");
}

/* ============================================================
   UPDATE ROLE
============================================================ */

export async function updateRole(
  formData: FormData
): Promise<void> {
  const {
    supabase,
  } = await requireRolePermission();

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const rank = Number.parseInt(
    String(
      formData.get("rank") ?? "10"
    ),
    10
  );

  const color = String(
    formData.get("color") ?? "#888780"
  ).trim();

  if (!id) {
    throw new Error(
      "Role ID is missing."
    );
  }

  if (!name) {
    throw new Error(
      "Role name is required."
    );
  }

  if (
    Number.isNaN(rank) ||
    rank < 0 ||
    rank > 100
  ) {
    throw new Error(
      "Rank must be between 0 and 100."
    );
  }

  const {
    data: existing,
  } =
    await supabase
      .from("roles")
      .select("id, name")
      .eq("id", id)
      .maybeSingle();

  if (!existing) {
    throw new Error(
      "Role not found."
    );
  }

  if (
    existing.name === "Owner" &&
    name !== "Owner"
  ) {
    throw new Error(
      "The Owner role cannot be renamed."
    );
  }

  const {
    error,
  } =
    await supabase
      .from("roles")
      .update({
        name,
        rank,
        color:
          color || "#888780",
      })
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/roles");
  revalidatePath("/admin/members");

  redirect("/admin/roles");
}

/* ============================================================
   UPDATE ROLE PERMISSIONS
============================================================ */

export async function updateRolePermissions(
  formData: FormData
): Promise<void> {
  const {
    supabase,
  } = await requireRolePermission();

  const roleId = String(
    formData.get("role_id") ?? ""
  ).trim();

  if (!roleId) {
    throw new Error(
      "Role ID is missing."
    );
  }

  const {
    data: role,
    error: roleError,
  } =
    await supabase
      .from("roles")
      .select("id, name")
      .eq("id", roleId)
      .maybeSingle();

  if (roleError) {
    throw new Error(
      roleError.message
    );
  }

  if (!role) {
    throw new Error(
      "Role not found."
    );
  }

  if (role.name === "Owner") {
    redirect("/admin/roles");
  }

  const {
    data: permissions,
    error: permissionsError,
  } =
    await supabase
      .from("permissions")
      .select("key");

  if (permissionsError) {
    throw new Error(
      permissionsError.message
    );
  }

  const selectedPermissions =
    permissions
      .map(
        (permission) => permission.key
      )
      .filter(
        (key) =>
          formData.get(
            `permission_${key}`
          ) === "on"
      );

  const {
    error: deleteError,
  } =
    await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", roleId);

  if (deleteError) {
    throw new Error(
      deleteError.message
    );
  }

  if (
    selectedPermissions.length > 0
  ) {
    const rows =
      selectedPermissions.map(
        (permissionKey) => ({
          role_id: roleId,
          permission_key:
            permissionKey,
        })
      );

    const {
      error: insertError,
    } =
      await supabase
        .from("role_permissions")
        .insert(rows);

    if (insertError) {
      throw new Error(
        insertError.message
      );
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/roles");
  revalidatePath("/admin/members");

  redirect("/admin/roles");
}

/* ============================================================
   DELETE ROLE
============================================================ */

export async function deleteRole(
  formData: FormData
): Promise<void> {
  const {
    supabase,
  } = await requireRolePermission();

  const id = String(
    formData.get("id") ?? ""
  ).trim();

  if (!id) {
    throw new Error(
      "Role ID is missing."
    );
  }

  const {
    data: role,
    error: roleError,
  } =
    await supabase
      .from("roles")
      .select("id, name")
      .eq("id", id)
      .maybeSingle();

  if (roleError) {
    throw new Error(
      roleError.message
    );
  }

  if (!role) {
    throw new Error(
      "Role not found."
    );
  }

  if (role.name === "Owner") {
    throw new Error(
      "The Owner role cannot be deleted."
    );
  }

  const {
    data: assigned,
    error: assignedError,
  } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("role_id", id)
      .limit(1);

  if (assignedError) {
    throw new Error(
      assignedError.message
    );
  }

  if (
    assigned &&
    assigned.length > 0
  ) {
    throw new Error(
      "This role is assigned to a member. Reassign those members first."
    );
  }

  const {
    error,
  } =
    await supabase
      .from("roles")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/roles");
  revalidatePath("/admin/members");

  redirect("/admin/roles");
}
