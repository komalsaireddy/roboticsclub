import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase =
    await createSupabaseServerClient();

  /* ============================================================
     AUTH USER
  ============================================================ */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        authenticated: false,
      },
      {
        status: 401,
      }
    );
  }

  /* ============================================================
     PROFILE + ROLE
  ============================================================ */

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      role_id,
      roles (
        id,
        name,
        rank,
        color
      )
    `)
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Login profile lookup failed:",
      profileError
    );

    return NextResponse.json(
      {
        authenticated: true,
        status: "error",
      },
      {
        status: 500,
      }
    );
  }

  /* ============================================================
     MEMBERSHIP REQUEST
  ============================================================ */

  const {
    data: request,
    error: requestError,
  } = await supabase
    .from("membership_requests")
    .select(`
      id,
      status,
      created_at,
      reviewed_at
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (requestError) {
    console.error(
      "Login membership lookup failed:",
      requestError
    );

    return NextResponse.json(
      {
        authenticated: true,
        status: "error",
      },
      {
        status: 500,
      }
    );
  }

  /* ============================================================
     ROLE
  ============================================================ */

  const role = Array.isArray(
    profile?.roles
  )
    ? profile.roles[0]
    : profile?.roles;

  /* ============================================================
     PENDING
  ============================================================ */

  if (
    request?.status === "pending"
  ) {
    return NextResponse.json({
      authenticated: true,
      status: "pending",
      role: null,
    });
  }

  /* ============================================================
     REJECTED
  ============================================================ */

  if (
    request?.status === "rejected"
  ) {
    return NextResponse.json({
      authenticated: true,
      status: "rejected",
      role: null,
    });
  }

  /* ============================================================
     APPROVED
     
     Determine destination from role rank.
     
     Member = rank 10
     Content Editor = 30
     Event Manager = 50
     Admin = 80
     President / Owner = 100
  ============================================================ */

  if (
    request?.status === "approved" &&
    role
  ) {
    if (
      role.rank >= 30
    ) {
      return NextResponse.json({
        authenticated: true,
        status: "approved",
        destination: "/admin",
        role: {
          name: role.name,
          rank: role.rank,
          color: role.color,
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      status: "approved",
      destination: "/member",
      role: {
        name: role.name,
        rank: role.rank,
        color: role.color,
      },
    });
  }

  /* ============================================================
     EXISTING ADMIN / OWNER ACCOUNTS
     
     If an existing account has a role but no membership
     request, preserve access.
  ============================================================ */

  if (
    role &&
    role.rank >= 30
  ) {
    return NextResponse.json({
      authenticated: true,
      status: "approved",
      destination: "/admin",
      role: {
        name: role.name,
        rank: role.rank,
        color: role.color,
      },
    });
  }

  /* ============================================================
     ACCOUNT HAS NO VALID ACCESS
  ============================================================ */

  return NextResponse.json({
    authenticated: true,
    status: "pending",
    role: null,
  });
}
