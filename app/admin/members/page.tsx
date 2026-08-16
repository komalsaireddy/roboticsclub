import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import AccessDenied from "@/components/admin/AccessDenied";

import {
  updateMember,
} from "./actions";

export default async function AdminMembersPage() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /* ============================================================
     CURRENT USER
  ============================================================ */

  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select(`
      full_name,
      avatar_url,
      role:roles (
        name,
        rank,
        color
      )
    `)
    .eq("id", user.id)
    .single();

  const currentRole =
    Array.isArray(profile?.role)
      ? profile.role[0]
      : profile?.role;

  /* ============================================================
     PERMISSION
  ============================================================ */

  const {
    data: allowed,
    error: permissionError,
  } = await supabase.rpc(
    "has_permission",
    {
      perm: "manage_members",
    }
  );

  if (
    permissionError ||
    !allowed
  ) {
    return <AccessDenied />;
  }

  /* ============================================================
     LOAD MEMBERS
  ============================================================ */

  const {
    data: members,
  } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        role_id,
        created_at,
        updated_at,
        roles (
          id,
          name,
          rank,
          color
        )
      `)
      .order("created_at", {
        ascending: true,
      });

  /* ============================================================
     LOAD ROLES
  ============================================================ */

  const {
    data: roles,
  } =
    await supabase
      .from("roles")
      .select(
        "id, name, rank, color"
      )
      .order("rank", {
        ascending: false,
      });

  const memberList =
    members ?? [];

  const roleList =
    roles ?? [];

  return (
    <main className="min-h-screen bg-[#030303] text-white">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="border-b border-white/[0.08]">

        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-10">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/[0.12]">
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
                Management Portal
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5">

            <div className="hidden text-right sm:block">

              <p className="text-sm text-white/70">
                {profile?.full_name ??
                  user.email}
              </p>

              <p
                className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em]"
                style={{
                  color:
                    currentRole?.color ??
                    "#888780",
                }}
              >
                {currentRole?.name ??
                  "Member"}
              </p>

            </div>

            <form
              action="/auth/signout"
              method="post"
            >
              <button
                type="submit"
                className="border border-white/[0.1] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:border-white/20 hover:text-white"
              >
                Sign out
              </button>
            </form>

          </div>

        </div>

      </header>

      {/* ========================================================
          MAIN LAYOUT
      ======================================================== */}

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1600px]">

        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <aside className="hidden w-64 shrink-0 border-r border-white/[0.08] lg:block">

          <nav className="sticky top-0 p-6">

            <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.25em] text-white/20">
              Control Center
            </p>

            <div className="space-y-1">

              <a
                href="/admin"
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Dashboard
              </a>

              <a
                href="/admin/projects"
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Projects
              </a>

              <a
                href="/admin/events"
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Events
              </a>

              <a
                href="/admin/gallery"
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Gallery
              </a>

              <a
                href="/admin/updates"
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Updates
              </a>

              <a
                href="/admin/team"
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Team
              </a>

              <div className="my-6 h-px bg-white/[0.06]" />

              <a
                href="/admin/members"
                className="block border-l border-cyan-400 bg-white/[0.04] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white"
              >
                Members
              </a>

              <a
                href="/admin/roles"
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Roles & Permissions
              </a>

            </div>

          </nav>

        </aside>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <section className="min-w-0 flex-1 px-6 py-10 lg:px-10 lg:py-12">

          <div className="mb-10">

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
              Access Control
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Members
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
              Manage existing accounts and
              assign roles across the Robotics
              Club management system.
            </p>

          </div>

          {/* ====================================================
              MEMBERS
          ==================================================== */}

          <section className="border border-white/[0.08]">

            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">

              <div>

                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
                  Member Directory
                </p>

                <p className="mt-2 text-lg text-white/75">
                  {memberList.length}{" "}
                  {memberList.length === 1
                    ? "Member"
                    : "Members"}
                </p>

              </div>

              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
                Role Management
              </div>

            </div>

            <div className="divide-y divide-white/[0.06]">

              {memberList.length === 0 ? (

                <div className="p-12 text-center">

                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                    No member profiles found
                  </p>

                </div>

              ) : (

                memberList.map(
                  (member) => {

                    const role =
                      Array.isArray(
                        member.roles
                      )
                        ? member.roles[0]
                        : member.roles;

                    return (

                      <form
                        key={member.id}
                        action={
                          updateMember
                        }
                        className="grid gap-5 px-6 py-7 lg:grid-cols-[1fr_1fr_220px_auto] lg:items-end"
                      >

                        <input
                          type="hidden"
                          name="id"
                          value={
                            member.id
                          }
                        />

                        <div>

                          <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                            Name
                          </label>

                          <input
                            name="full_name"
                            defaultValue={
                              member.full_name ??
                              ""
                            }
                            className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none transition-colors focus:border-cyan-400/40"
                          />

                        </div>

                        <div>

                          <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                            Avatar URL
                          </label>

                          <input
                            name="avatar_url"
                            defaultValue={
                              member.avatar_url ??
                              ""
                            }
                            placeholder="https://..."
                            className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none placeholder:text-white/10 transition-colors focus:border-cyan-400/40"
                          />

                        </div>

                        <div>

                          <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                            Role
                          </label>

                          <select
                            name="role_id"
                            defaultValue={
                              member.role_id ??
                              ""
                            }
                            className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none transition-colors focus:border-cyan-400/40"
                          >

                            <option value="">
                              Select role
                            </option>

                            {roleList.map(
                              (item) => (
                                <option
                                  key={
                                    item.id
                                  }
                                  value={
                                    item.id
                                  }
                                >
                                  {
                                    item.name
                                  }{" "}
                                  — Rank{" "}
                                  {
                                    item.rank
                                  }
                                </option>
                              )
                            )}

                          </select>

                        </div>

                        <button
                          type="submit"
                          className="h-11 bg-white px-6 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-cyan-300"
                        >
                          Save
                        </button>

                        <div className="border-t border-white/[0.05] pt-4 lg:col-span-4">

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

                            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/15">
                              ID:{" "}
                              {member.id}
                            </p>

                            <p
                              className="font-mono text-[9px] uppercase tracking-[0.12em]"
                              style={{
                                color:
                                  role?.color ??
                                  "#888780",
                              }}
                            >
                              Current Role:{" "}
                              {role?.name ??
                                "Unassigned"}
                            </p>

                          </div>

                        </div>

                      </form>

                    );
                  }
                )

              )}

            </div>

          </section>

        </section>

      </div>

    </main>
  );
}
