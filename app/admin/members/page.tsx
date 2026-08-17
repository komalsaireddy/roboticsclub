import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import AccessDenied from "@/components/admin/AccessDenied";

import {
  updateMember,
  removeMember,
  approveMembershipRequest,
  rejectMembershipRequest,
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

  if (permissionError || !allowed) {
    return <AccessDenied />;
  }

  /* ============================================================
     EXISTING MEMBERS
  ============================================================ */

  const {
    data: members,
    error: membersError,
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
     ROLES
  ============================================================ */

  const {
    data: roles,
    error: rolesError,
  } =
    await supabase
      .from("roles")
      .select(
        "id, name, rank, color"
      )
      .order("rank", {
        ascending: false,
      });

  /* ============================================================
     PENDING REQUESTS
  ============================================================ */

  const {
    data: requests,
    error: requestsError,
  } =
    await supabase
      .from("membership_requests")
      .select(`
        id,
        user_id,
        full_name,
        email,
        status,
        created_at
      `)
      .eq("status", "pending")
      .order("created_at", {
        ascending: true,
      });

  const memberList =
    members ?? [];

  const roleList =
    roles ?? [];

  const requestList =
    requests ?? [];

  return (
    <main className="min-h-screen bg-[#030303] text-white">

      {/* ==========================================================
          HEADER
      ========================================================== */}

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
                Members / Management
              </p>

            </div>

          </div>

          <a
            href="/admin"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 transition-colors hover:text-cyan-300"
          >
            ← Dashboard
          </a>

        </div>

      </header>

      {/* ==========================================================
          CONTENT
      ========================================================== */}

      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10">

        {/* ========================================================
            TITLE
        ======================================================== */}

        <div className="mb-10">

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/60">
            Access Control
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
            Members
          </h1>

          <p className="mt-3 max-w-xl text-[16px] leading-7 text-white/40">
            Manage existing accounts, review membership
            requests and assign roles.
          </p>

        </div>

        {/* ========================================================
            PENDING REQUESTS
        ======================================================== */}

        <section className="mb-10 border border-white/[0.08]">

          <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">

            <div>

              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/60">
                Membership Requests
              </p>

              <h2 className="mt-2 text-xl font-medium text-white/80">
                Pending Approval
              </h2>

            </div>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.04] px-3 font-mono text-[10px] text-cyan-200/70">
              {requestList.length}
            </span>

          </div>

          {requestsError ? (

            <div className="p-6 text-sm text-red-300/70">
              Failed to load membership requests.
            </div>

          ) : requestList.length === 0 ? (

            <div className="p-10 text-center">

              <p className="text-sm text-white/30">
                No pending membership requests.
              </p>

              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/15">
                New registrations will appear here
              </p>

            </div>

          ) : (

            <div className="divide-y divide-white/[0.06]">

              {requestList.map(
                (request) => (

                  <div
                    key={request.id}
                    className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_1fr_auto] lg:items-center"
                  >

                    {/* MEMBER */}

                    <div>

                      <p className="text-[17px] font-medium text-white/80">
                        {request.full_name}
                      </p>

                      <p className="mt-1 text-sm text-white/35">
                        {request.email}
                      </p>

                    </div>

                    {/* DETAILS */}

                    <div>

                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
                        Requested
                      </p>

                      <p className="mt-1 text-sm text-white/35">
                        {new Date(
                          request.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-2">

                      <form
                        action={
                          approveMembershipRequest
                        }
                      >

                        <input
                          type="hidden"
                          name="request_id"
                          value={request.id}
                        />

                        <button
                          type="submit"
                          className="h-10 border border-cyan-300/20 bg-cyan-300/[0.04] px-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-200 transition-colors hover:border-cyan-300/50 hover:bg-cyan-300/[0.08]"
                        >
                          Approve
                        </button>

                      </form>

                      <form
                        action={
                          rejectMembershipRequest
                        }
                      >

                        <input
                          type="hidden"
                          name="request_id"
                          value={request.id}
                        />

                        <button
                          type="submit"
                          className="h-10 border border-red-400/15 px-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-red-300/60 transition-colors hover:border-red-400/40 hover:text-red-300"
                        >
                          Reject
                        </button>

                      </form>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ========================================================
            EXISTING MEMBERS
        ======================================================== */}

        <section className="border border-white/[0.08]">

          <div className="border-b border-white/[0.08] px-6 py-5">

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
              {memberList.length} Members
            </p>

          </div>

          <div className="divide-y divide-white/[0.06]">

            {memberList.length === 0 ? (

              <div className="p-10 text-center text-white/25">
                No member profiles found.
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
                      action={updateMember}
                      className="grid gap-5 px-6 py-7 lg:grid-cols-[1fr_1fr_220px_auto] lg:items-end"
                    >

                      <input
                        type="hidden"
                        name="id"
                        value={member.id}
                      />

                      {/* NAME */}

                      <div>

                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                          Name
                        </label>

                        <input
                          name="full_name"
                          defaultValue={
                            member.full_name ?? ""
                          }
                          className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
                        />

                      </div>

                      {/* AVATAR */}

                      <div>

                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                          Avatar URL
                        </label>

                        <input
                          name="avatar_url"
                          defaultValue={
                            member.avatar_url ?? ""
                          }
                          className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
                        />

                      </div>

                      {/* ROLE */}

                      <div>

                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                          Role
                        </label>

                        <select
                          name="role_id"
                          defaultValue={
                            member.role_id ?? ""
                          }
                          className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
                        >

                          <option value="">
                            Select role
                          </option>

                          {roleList.map(
                            (item) => (

                              <option
                                key={item.id}
                                value={item.id}
                              >
                                {item.name} — Rank{" "}
                                {item.rank}
                              </option>

                            )
                          )}

                        </select>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">

                        <button
                          type="submit"
                          className="h-11 bg-white px-6 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-cyan-300"
                        >
                          Save
                        </button>

                        <button
                          type="submit"
                          formAction={removeMember}
                          disabled={member.id === user.id || role?.name === "Owner"}
                          className="h-11 border border-red-500/40 bg-red-500/10 px-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-red-300 transition-colors hover:bg-red-500/30 hover:border-red-500/70 disabled:cursor-not-allowed disabled:opacity-20"
                          title={member.id === user.id ? "Cannot revoke yourself" : role?.name === "Owner" ? "Cannot revoke Owner" : "Revoke membership access"}
                        >
                          Revoke Access
                        </button>

                      </div>

                      {/* DETAILS */}

                      <div className="lg:col-span-4">

                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/20">
                          ID: {member.id}
                        </p>

                        <p
                          className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em]"
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

                    </form>

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
