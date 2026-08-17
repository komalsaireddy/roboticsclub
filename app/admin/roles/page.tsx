import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import AccessDenied from "@/components/admin/AccessDenied";

import {
  createRole,
  deleteRole,
  updateRole,
  updateRolePermissions,
} from "./actions";

export default async function AdminRolesPage() {
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
      perm: "manage_roles",
    }
  );

  if (
    permissionError ||
    !allowed
  ) {
    return <AccessDenied />;
  }

  /* ============================================================
     LOAD ROLES
  ============================================================ */

  const {
    data: roles,
  } =
    await supabase
      .from("roles")
      .select(`
        id,
        name,
        rank,
        color,
        created_at
      `)
      .order("rank", {
        ascending: false,
      });

  /* ============================================================
     LOAD PERMISSIONS
  ============================================================ */

  const {
    data: permissions,
  } =
    await supabase
      .from("permissions")
      .select(
        "key, description"
      )
      .order("key", {
        ascending: true,
      });

  /* ============================================================
     LOAD ROLE PERMISSIONS
  ============================================================ */

  const {
    data: rolePermissions,
  } =
    await supabase
      .from("role_permissions")
      .select(
        "role_id, permission_key"
      );

  const roleList =
    roles ?? [];

  const permissionList =
    permissions ?? [];

  const assignmentList =
    rolePermissions ?? [];

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
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Members
              </a>

              <a
                href="/admin/roles"
                className="block border-l border-cyan-400 bg-white/[0.04] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white"
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
              Roles & Permissions
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
              Define roles and control what
              each role can manage across the
              Robotics Club website.
            </p>

          </div>

          {/* ====================================================
              CREATE ROLE
          ==================================================== */}

          <section className="mb-10 border border-white/[0.08] bg-white/[0.01] p-6">

            <div className="mb-6">

              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
                Role Management
              </p>

              <h2 className="mt-2 text-xl font-medium text-white/80">
                Create Role
              </h2>

            </div>

            <form
              action={createRole}
              className="grid gap-5 md:grid-cols-[1fr_180px_180px_auto]"
            >

              <div>

                <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                  Role Name
                </label>

                <input
                  name="name"
                  placeholder="Role name"
                  required
                  className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none placeholder:text-white/10 transition-colors focus:border-cyan-400/40"
                />

              </div>

              <div>

                <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                  Rank
                </label>

                <input
                  name="rank"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="20"
                  required
                  className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none transition-colors focus:border-cyan-400/40"
                />

              </div>

              <div>

                <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                  Color
                </label>

                <input
                  name="color"
                  type="text"
                  defaultValue="#888780"
                  placeholder="#888780"
                  className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none placeholder:text-white/10 transition-colors focus:border-cyan-400/40"
                />

              </div>

              <div className="flex items-end">

                <button
                  type="submit"
                  className="h-11 w-full bg-white px-6 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-cyan-300 md:w-auto"
                >
                  Create Role
                </button>

              </div>

            </form>

          </section>

          {/* ====================================================
              ROLE LIST
          ==================================================== */}

          <div className="space-y-6">

            {roleList.length === 0 ? (

              <section className="border border-white/[0.08] p-12 text-center">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                  No roles found
                </p>

              </section>

            ) : (

              roleList.map(
                (role) => {

                  const rolePermissionKeys =
                    assignmentList
                      .filter(
                        (item) =>
                          item.role_id ===
                          role.id
                      )
                      .map(
                        (item) =>
                          item.permission_key
                      );

                  const isOwner =
                    role.name ===
                    "Owner";

                  return (

                    <section
                      key={role.id}
                      className="border border-white/[0.08] bg-white/[0.01]"
                    >

                      {/* ROLE HEADER */}

                      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] p-6 sm:flex-row sm:items-center">

                        <div className="flex items-center gap-4">

                          <span
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor:
                                role.color ??
                                "#888780",
                            }}
                          />

                          <div>

                            <div className="flex items-center gap-3">

                              <h2 className="text-xl font-medium text-white/85">
                                {role.name}
                              </h2>

                              {isOwner && (
                                <span className="border border-cyan-400/20 bg-cyan-400/[0.04] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-cyan-300/60">
                                  Protected
                                </span>
                              )}

                            </div>

                            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
                              Rank {role.rank}
                            </p>

                          </div>

                        </div>

                        {!isOwner && (

                          <form
                            action={
                              deleteRole
                            }
                          >

                            <input
                              type="hidden"
                              name="id"
                              value={
                                role.id
                              }
                            />

                            <button
                              type="submit"
                              className="border border-red-400/10 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/50 transition-colors hover:border-red-400/30 hover:text-red-300"
                            >
                              Delete Role
                            </button>

                          </form>

                        )}

                      </div>

                      <div className="p-6">

                        {/* ROLE DETAILS */}

                        <form
                          action={
                            updateRole
                          }
                          className="mb-8 grid gap-5 md:grid-cols-[1fr_180px_180px_auto]"
                        >

                          <input
                            type="hidden"
                            name="id"
                            value={
                              role.id
                            }
                          />

                          <div>

                            <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                              Role Name
                            </label>

                            <input
                              name="name"
                              defaultValue={
                                role.name
                              }
                              disabled={
                                isOwner
                              }
                              className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none transition-colors disabled:opacity-40 focus:border-cyan-400/40"
                            />

                          </div>

                          <div>

                            <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                              Rank
                            </label>

                            <input
                              name="rank"
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={
                                role.rank
                              }
                              className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none transition-colors focus:border-cyan-400/40"
                            />

                          </div>

                          <div>

                            <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                              Color
                            </label>

                            <input
                              name="color"
                              defaultValue={
                                role.color ??
                                "#888780"
                              }
                              className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none transition-colors focus:border-cyan-400/40"
                            />

                          </div>

                          <div className="flex items-end">

                            <button
                              type="submit"
                              className="h-11 w-full border border-white/[0.1] px-6 font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 transition-colors hover:border-cyan-400/30 hover:text-white md:w-auto"
                            >
                              Save Role
                            </button>

                          </div>

                        </form>

                        {/* PERMISSIONS */}

                        <div className="border-t border-white/[0.06] pt-6">

                          <div className="mb-5 flex items-center justify-between">

                            <div>

                              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                                Permissions
                              </p>

                              <p className="mt-2 text-sm text-white/25">
                                Control access granted
                                to this role.
                              </p>

                            </div>

                            {!isOwner && (
                              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/15">
                                {
                                  rolePermissionKeys.length
                                }{" "}
                                assigned
                              </span>
                            )}

                          </div>

                          {isOwner ? (

                            <div className="border border-cyan-400/10 bg-cyan-400/[0.02] px-5 py-4 text-sm text-cyan-300/60">
                              Owner automatically has
                              every permission.
                            </div>

                          ) : (

                            <form
                              action={
                                updateRolePermissions
                              }
                            >

                              <input
                                type="hidden"
                                name="role_id"
                                value={
                                  role.id
                                }
                              />

                              {permissionList.length ===
                              0 ? (

                                <div className="border border-white/[0.06] p-5 text-sm text-white/25">
                                  No permissions
                                  available.
                                </div>

                              ) : (

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                  {permissionList.map(
                                    (
                                      permission
                                    ) => (

                                      <label
                                        key={
                                          permission.key
                                        }
                                        className="flex cursor-pointer gap-3 border border-white/[0.06] p-4 transition-colors hover:border-white/[0.15] hover:bg-white/[0.02]"
                                      >

                                        <input
                                          type="checkbox"
                                          name={`permission_${permission.key}`}
                                          defaultChecked={rolePermissionKeys.includes(
                                            permission.key
                                          )}
                                          className="mt-0.5 h-4 w-4 accent-cyan-400"
                                        />

                                        <span>

                                          <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-white/60">
                                            {
                                              permission.key
                                            }
                                          </span>

                                          {permission.description && (

                                            <span className="mt-1 block text-xs leading-5 text-white/25">
                                              {
                                                permission.description
                                              }
                                            </span>

                                          )}

                                        </span>

                                      </label>

                                    )
                                  )}

                                </div>

                              )}

                              <button
                                type="submit"
                                className="mt-5 bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-cyan-300"
                              >
                                Save Permissions
                              </button>

                            </form>

                          )}

                        </div>

                      </div>

                    </section>

                  );
                }
              )

            )}

          </div>

        </section>

      </div>

    </main>
  );
}
