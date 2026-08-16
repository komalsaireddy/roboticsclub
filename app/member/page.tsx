import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
  updateMemberProfile,
} from "./actions";

import MemberProfileEditor from "@/components/member/MemberProfileEditor";

export default async function MemberPage() {
  const supabase =
    await createSupabaseServerClient();

  /* ============================================================
     AUTHENTICATION
  ============================================================ */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /* ============================================================
     PROFILE
  ============================================================ */

  const {
    data: profile,
    error: profileError,
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
          rank,
          color
        )
      `)
      .eq("id", user.id)
      .maybeSingle();

  if (profileError || !profile) {
    redirect("/login");
  }

  const role =
    Array.isArray(profile.roles)
      ? profile.roles[0]
      : profile.roles;

  /* ============================================================
     ADMIN ROLES
  ============================================================ */

  if (
    role &&
    role.rank >= 30
  ) {
    redirect("/admin");
  }

  /* ============================================================
     MEMBERSHIP
  ============================================================ */

  const {
    data: membership,
    error: membershipError,
  } =
    await supabase
      .from(
        "membership_requests"
      )
      .select(`
        id,
        status,
        created_at,
        reviewed_at
      `)
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(1)
      .maybeSingle();

  if (membershipError) {
    throw new Error(
      "Unable to verify membership status."
    );
  }

  if (!membership) {
    redirect("/login");
  }

  if (
    membership.status !==
    "approved"
  ) {
    redirect("/login");
  }

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <main className="min-h-screen bg-[#030303] text-white">

      {/* HEADER */}

      <header className="border-b border-white/[0.08]">

        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-10">

          <a
            href="/"
            className="flex items-center gap-4"
          >

            <div className="h-10 w-10 overflow-hidden rounded-full border border-white/[0.12]">

              <img
                src="/robotics-club-logo.jpg"
                alt="Robotics Club GCET"
                className="h-full w-full object-cover"
              />

            </div>

            <div>

              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
                Robotics Club
              </p>

              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                Member Portal
              </p>

            </div>

          </a>

          <a
            href="/auth/signout"
            className="border border-white/[0.1] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:border-white/20 hover:text-white"
          >
            Sign out
          </a>

        </div>

      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10 lg:py-16">

        {/* INTRO */}

        <div className="mb-12">

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
            Member Access
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Welcome
            {profile.full_name
              ? `, ${profile.full_name}`
              : ""}
          </h1>

          <p className="mt-4 text-[16px] leading-8 text-white/40">
            Your Robotics Club membership is active.
          </p>

        </div>

        {/* STATUS CARDS */}

        <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">

          <div className="bg-[#050505] p-7">

            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">
              Role
            </p>

            <p
              className="mt-5 text-2xl font-medium"
              style={{
                color:
                  role?.color ??
                  "#888780",
              }}
            >
              {role?.name ??
                "Member"}
            </p>

            <p className="mt-2 text-sm text-white/30">
              Rank {role?.rank ?? 10}
            </p>

          </div>

          <div className="bg-[#050505] p-7">

            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">
              Membership
            </p>

            <div className="mt-5 flex items-center gap-3">

              <span className="h-2 w-2 rounded-full bg-cyan-300" />

              <p className="text-2xl font-medium text-white/80">
                Active
              </p>

            </div>

            <p className="mt-2 text-sm text-white/30">
              Approved member
            </p>

          </div>

          <div className="bg-[#050505] p-7">

            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">
              Account
            </p>

            <p className="mt-5 break-all text-[15px] text-white/60">
              {user.email}
            </p>

            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
              Authenticated
            </p>

          </div>

        </div>

        {/* PROFILE */}

        <section className="mt-10 border border-white/[0.08]">

          <div className="border-b border-white/[0.08] px-6 py-6">

            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">
              Account
            </p>

            <h2 className="mt-2 text-2xl font-medium text-white/85">
              Your Profile
            </h2>

            <p className="mt-2 text-[15px] leading-7 text-white/30">
              Update your name and profile photo.
            </p>

          </div>

          <MemberProfileEditor
            profile={{
              id: profile.id,
              full_name:
                profile.full_name,
              avatar_url:
                profile.avatar_url,
              role_name:
                role?.name ??
                "Member",
              role_color:
                role?.color ??
                "#888780",
            }}
            email={
              user.email ?? ""
            }
            updateAction={
              updateMemberProfile
            }
          />

        </section>

        {/* EXPLORE */}

        <section className="mt-12">

          <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">
            Explore
          </p>

          <div className="grid gap-3 md:grid-cols-3">

            <a
              href="/#projects"
              className="group border border-white/[0.08] bg-white/[0.015] p-7 transition-colors hover:border-cyan-300/20"
            >

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Projects
              </p>

              <p className="mt-3 text-[15px] leading-6 text-white/30">
                Explore Robotics Club projects.
              </p>

              <span className="mt-6 block text-right text-lg text-white/15 group-hover:text-cyan-300/60">
                ↗
              </span>

            </a>

            <a
              href="/#events"
              className="group border border-white/[0.08] bg-white/[0.015] p-7 transition-colors hover:border-cyan-300/20"
            >

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Events
              </p>

              <p className="mt-3 text-[15px] leading-6 text-white/30">
                See upcoming club events.
              </p>

              <span className="mt-6 block text-right text-lg text-white/15 group-hover:text-cyan-300/60">
                ↗
              </span>

            </a>

            <a
              href="/#team"
              className="group border border-white/[0.08] bg-white/[0.015] p-7 transition-colors hover:border-cyan-300/20"
            >

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Team
              </p>

              <p className="mt-3 text-[15px] leading-6 text-white/30">
                Meet the Robotics Club team.
              </p>

              <span className="mt-6 block text-right text-lg text-white/15 group-hover:text-cyan-300/60">
                ↗
              </span>

            </a>

          </div>

        </section>

      </div>

    </main>
  );
}
