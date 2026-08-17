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
  } = await supabase.rpc(
    "has_permission",
    {
      perm: "manage_members",
    }
  );

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
    user,
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

  if (!fullName) {
    throw new Error(
      "Full name is required."
    );
  }

  if (!roleId) {
    throw new Error(
      "Role is required."
    );
  }

  /* ==========================================================
     LOAD MEMBER
  ========================================================== */

  const {
    data: existingMember,
    error: memberError,
  } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        role_id,
        roles (
          id,
          name,
          rank
        )
      `)
      .eq("id", id)
      .maybeSingle();

  if (memberError) {
    throw new Error(
      memberError.message
    );
  }

  if (!existingMember) {
    throw new Error(
      "Member not found."
    );
  }

  /* ==========================================================
     LOAD NEW ROLE
  ========================================================== */

  const {
    data: newRole,
    error: roleError,
  } =
    await supabase
      .from("roles")
      .select(
        "id, name, rank"
      )
      .eq("id", roleId)
      .maybeSingle();

  if (roleError) {
    throw new Error(
      roleError.message
    );
  }

  if (!newRole) {
    throw new Error(
      "Selected role not found."
    );
  }

  /* ==========================================================
     PREVENT HIGHER-RANK ASSIGNMENT
  ========================================================== */

  const {
    data: currentProfile,
  } =
    await supabase
      .from("profiles")
      .select(`
        id,
        role_id,
        roles (
          id,
          name,
          rank
        )
      `)
      .eq("id", user.id)
      .maybeSingle();

  const currentRole =
    Array.isArray(
      currentProfile?.roles
    )
      ? currentProfile.roles[0]
      : currentProfile?.roles;

  const currentRank =
    currentRole?.rank ?? 0;

  /*
   * Owner remains the highest authority.
   * Other admins cannot assign a role
   * above their own rank.
   */
  if (
    id !== user.id &&
    newRole.rank > currentRank
  ) {
    throw new Error(
      "You cannot assign a role above your own rank."
    );
  }

  /*
   * Prevent non-Owner users from changing
   * the Owner's role.
   */
  const existingRole =
    Array.isArray(
      existingMember.roles
    )
      ? existingMember.roles[0]
      : existingMember.roles;

  if (
    existingRole?.name === "Owner" &&
    currentRole?.name !== "Owner"
  ) {
    throw new Error(
      "Only the Owner can modify the Owner account."
    );
  }

  /* ==========================================================
     UPDATE
  ========================================================== */

  const {
    error: updateError,
  } =
    await supabase
      .from("profiles")
      .update({
        full_name:
          fullName,
        avatar_url:
          avatarUrl || null,
        role_id:
          roleId,
      })
      .eq("id", id);

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  /* ==========================================================
     AUDIT LOG
  ========================================================== */

  const oldRoleName =
    existingRole?.name ??
    "Unassigned";

  const oldRoleId =
    existingMember.role_id;

  const changes: Record<
    string,
    unknown
  > = {};

  if (
    existingMember.full_name !==
    fullName
  ) {
    changes.full_name = {
      from:
        existingMember.full_name,
      to: fullName,
    };
  }

  if (
    (existingMember.avatar_url ??
      null) !==
    (avatarUrl || null)
  ) {
    changes.avatar_url =
      "updated";
  }

  if (
    oldRoleId !== roleId
  ) {
    changes.role = {
      from:
        oldRoleName,
      to:
        newRole.name,
    };
  }

  await createAuditLog({
    supabase,
    userId: user.id,
    action:
      "member_updated",
    entityType:
      "member",
    entityId:
      id,
    description:
      `Updated member ${fullName}`,
    metadata: {
      changes,
      old_role:
        oldRoleName,
      new_role:
        newRole.name,
    },
  });

  revalidatePath(
    "/admin/members"
  );

  revalidatePath(
    "/admin/roles"
  );

  revalidatePath(
    "/member"
  );

  redirect(
    "/admin/members"
  );
}

/* ============================================================
   APPROVE MEMBERSHIP REQUEST
============================================================ */

export async function approveMembershipRequest(
  formData: FormData
): Promise<void> {
  const {
    supabase,
    user,
  } = await requireMemberPermission();

  const requestId =
    String(
      formData.get(
        "request_id"
      ) ?? ""
    ).trim();

  if (!requestId) {
    throw new Error(
      "Membership request ID is missing."
    );
  }

  /* ==========================================================
     LOAD REQUEST
  ========================================================== */

  const {
    data: request,
    error: requestError,
  } =
    await supabase
      .from(
        "membership_requests"
      )
      .select(`
        id,
        user_id,
        full_name,
        email,
        status
      `)
      .eq(
        "id",
        requestId
      )
      .maybeSingle();

  if (requestError) {
    throw new Error(
      requestError.message
    );
  }

  if (!request) {
    throw new Error(
      "Membership request not found."
    );
  }

  if (
    request.status !==
    "pending"
  ) {
    throw new Error(
      "This membership request has already been reviewed."
    );
  }

  /* ==========================================================
     DEFAULT MEMBER ROLE
  ========================================================== */

  const {
    data: memberRole,
    error: roleError,
  } =
    await supabase
      .from("roles")
      .select(
        "id, name, rank"
      )
      .eq(
        "name",
        "Member"
      )
      .maybeSingle();

  if (roleError) {
    throw new Error(
      roleError.message
    );
  }

  if (!memberRole) {
    throw new Error(
      "Member role not found."
    );
  }

  /* ==========================================================
     CREATE / UPDATE PROFILE
  ========================================================== */

  const {
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .upsert(
        {
          id:
            request.user_id,
          full_name:
            request.full_name,
          role_id:
            memberRole.id,
        },
        {
          onConflict:
            "id",
        }
      );

  if (profileError) {
    throw new Error(
      profileError.message
    );
  }

  /* ==========================================================
     APPROVE REQUEST
  ========================================================== */

  const {
    error: updateError,
  } =
    await supabase
      .from(
        "membership_requests"
      )
      .update({
        status:
          "approved",
        reviewed_by:
          user.id,
        reviewed_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        requestId
      );

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  /* ==========================================================
     AUDIT LOG
  ========================================================== */

  await createAuditLog({
    supabase,
    userId: user.id,
    action:
      "membership_approved",
    entityType:
      "membership_request",
    entityId:
      requestId,
    description:
      `Approved membership for ${request.full_name}`,
    metadata: {
      member_id:
        request.user_id,
      email:
        request.email,
      assigned_role:
        memberRole.name,
    },
  });

  revalidatePath(
    "/admin/members"
  );

  revalidatePath(
    "/admin/roles"
  );

  redirect(
    "/admin/members"
  );
}

/* ============================================================
   REJECT MEMBERSHIP REQUEST
============================================================ */

export async function rejectMembershipRequest(
  formData: FormData
): Promise<void> {
  const {
    supabase,
    user,
  } = await requireMemberPermission();

  const requestId =
    String(
      formData.get(
        "request_id"
      ) ?? ""
    ).trim();

  if (!requestId) {
    throw new Error(
      "Membership request ID is missing."
    );
  }

  /* ==========================================================
     LOAD REQUEST
  ========================================================== */

  const {
    data: request,
    error: requestError,
  } =
    await supabase
      .from(
        "membership_requests"
      )
      .select(`
        id,
        user_id,
        full_name,
        email,
        status
      `)
      .eq(
        "id",
        requestId
      )
      .maybeSingle();

  if (requestError) {
    throw new Error(
      requestError.message
    );
  }

  if (!request) {
    throw new Error(
      "Membership request not found."
    );
  }

  if (
    request.status !==
    "pending"
  ) {
    throw new Error(
      "This membership request has already been reviewed."
    );
  }

  /* ==========================================================
     REJECT
  ========================================================== */

  const {
    error: updateError,
  } =
    await supabase
      .from(
        "membership_requests"
      )
      .update({
        status:
          "rejected",
        reviewed_by:
          user.id,
        reviewed_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        requestId
      );

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  /* ==========================================================
     AUDIT LOG
  ========================================================== */

  await createAuditLog({
    supabase,
    userId: user.id,
    action:
      "membership_rejected",
    entityType:
      "membership_request",
    entityId:
      requestId,
    description:
      `Rejected membership for ${request.full_name}`,
    metadata: {
      member_id:
        request.user_id,
      email:
        request.email,
    },
  });

  revalidatePath(
    "/admin/members"
  );

  redirect(
    "/admin/members"
  );
}
