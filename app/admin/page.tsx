import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import MobileAdminNav from "@/components/admin/MobileAdminNav";

export default async function AdminPage() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /* ============================================================
     PROFILE
  ============================================================ */

  const { data: profile } =
    await supabase
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

  const role = Array.isArray(profile?.role)
    ? profile.role[0]
    : profile?.role;

  /* ============================================================
     DASHBOARD COUNTS
  ============================================================ */

  const [
    projectsResult,
    eventsResult,
    galleryResult,
    updatesResult,
    membersResult,
    pendingResult,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("events")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("gallery_images")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("updates")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("membership_requests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending"),
  ]);

  const stats = {
    projects:
      projectsResult.count ?? 0,

    events:
      eventsResult.count ?? 0,

    gallery:
      galleryResult.count ?? 0,

    updates:
      updatesResult.count ?? 0,

    members:
      membersResult.count ?? 0,

    pending:
      pendingResult.count ?? 0,
  };

  /* ============================================================
     RECENT SYSTEM ACTIVITY
  ============================================================ */

  const {
    data: recentLogs,
  } = await supabase
    .from("system_logs")
    .select(`
      id,
      user_id,
      action,
      entity_type,
      description,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  const actorIds = Array.from(
    new Set(
      (recentLogs ?? [])
        .map(
          (log) =>
            log.user_id
        )
        .filter(Boolean)
    )
  );

  const {
    data: actors,
  } = actorIds.length
    ? await supabase
        .from("profiles")
        .select(
          "id, full_name"
        )
        .in(
          "id",
          actorIds
        )
    : {
        data: [],
      };

  const actorMap =
    new Map(
      (actors ?? []).map(
        (actor) => [
          actor.id,
          actor.full_name,
        ]
      )
    );

  /* ============================================================
     PAGE
  ============================================================ */

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
                    role?.color ??
                    "#888780",
                }}
              >
                {role?.name ??
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
          BODY
      ======================================================== */}

      <MobileAdminNav />

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
                className="block border-l border-cyan-400 bg-white/[0.04] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white"
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
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                Roles & Permissions
              </a>

              <a
                href="/admin/logs"
                className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                System Logs
              </a>

            </div>

          </nav>

        </aside>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <section className="min-w-0 flex-1 px-6 py-10 lg:px-10 lg:py-12">

          {/* ====================================================
              TITLE
          ==================================================== */}

          <div className="mb-10">

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
              Overview
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Control Center
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
              Manage the Robotics Club website,
              content and members from one place.
            </p>

          </div>

          {/* ====================================================
              PRIMARY STATS
          ==================================================== */}

          <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              label="Projects"
              href="/admin/projects"
              value={stats.projects}
            />

            <StatCard
              label="Events"
              href="/admin/events"
              value={stats.events}
            />

            <StatCard
              label="Gallery"
              href="/admin/gallery"
              value={stats.gallery}
            />

            <StatCard
              label="Updates"
              href="/admin/updates"
              value={stats.updates}
            />

          </div>

          {/* ====================================================
              MEMBERSHIP STATS
          ==================================================== */}

          <div className="mt-8 grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">

            <a
              href="/admin/members"
              className="group bg-[#050505] p-6 transition-colors hover:bg-white/[0.025]"
            >

              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">
                Members
              </p>

              <div className="mt-5 flex items-end justify-between">

                <span className="text-4xl font-semibold tracking-[-0.04em] text-white/80">
                  {stats.members}
                </span>

                <span className="text-lg text-white/15 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-300/70">
                  ↗
                </span>

              </div>

            </a>

            <a
              href="/admin/members"
              className="group bg-[#050505] p-6 transition-colors hover:bg-white/[0.025]"
            >

              <div className="flex items-center justify-between">

                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">
                  Pending Requests
                </p>

                {stats.pending > 0 && (
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                )}

              </div>

              <div className="mt-5 flex items-end justify-between">

                <span className="text-4xl font-semibold tracking-[-0.04em] text-white/80">
                  {stats.pending}
                </span>

                <span className="text-lg text-white/15 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-300/70">
                  ↗
                </span>

              </div>

            </a>

          </div>

          {/* ====================================================
              QUICK ACTIONS
          ==================================================== */}

          <div className="mt-10">

            <div className="mb-4">

              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/20">
                Quick Actions
              </p>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

              <QuickAction
                href="/admin/projects"
                label="Manage Projects"
                symbol="+"
              />

              <QuickAction
                href="/admin/events"
                label="Manage Events"
                symbol="+"
              />

              <QuickAction
                href="/admin/team"
                label="Manage Team"
                symbol="+"
              />

              <QuickAction
                href="/admin/updates"
                label="Post Update"
                symbol="+"
              />

            </div>

          </div>

          {/* ====================================================
              RECENT ACTIVITY
          ==================================================== */}

          <div className="mt-10">

            <div className="mb-4 flex items-end justify-between">

              <div>

                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/20">
                  Recent Activity
                </p>

                <p className="mt-2 text-sm text-white/25">
                  Latest changes across the system.
                </p>

              </div>

              <a
                href="/admin/logs"
                className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300/50 transition-colors hover:text-cyan-300"
              >
                View all →
              </a>

            </div>

            <div className="border border-white/[0.08]">

              {recentLogs &&
              recentLogs.length > 0 ? (

                <div className="divide-y divide-white/[0.06]">

                  {recentLogs.map(
                    (log) => {

                      const actor =
                        log.user_id
                          ? actorMap.get(
                              log.user_id
                            ) ??
                            "Unknown user"
                          : "System";

                      const date =
                        new Date(
                          log.created_at
                        );

                      return (
                        <div
                          key={log.id}
                          className="flex flex-col gap-3 px-5 py-5 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
                        >

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-cyan-300/50">
                                {log.action
                                  .replace(
                                    /_/g,
                                    " "
                                  )}
                              </span>

                              <span className="text-white/15">
                                ·
                              </span>

                              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/20">
                                {log.entity_type.replace(
                                  /_/g,
                                  " "
                                )}
                              </span>

                            </div>

                            <p className="mt-2 truncate text-sm text-white/55">
                              {log.description}
                            </p>

                            <p className="mt-1 text-xs text-white/20">
                              by {actor}
                            </p>

                          </div>

                          <time className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-white/20">
                            {date.toLocaleString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </time>

                        </div>
                      );
                    }
                  )}

                </div>

              ) : (

                <div className="px-6 py-12 text-center">

                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
                    No recent activity
                  </p>

                </div>

              )}

            </div>

          </div>

          {/* ====================================================
              ROLE / ACCESS
          ==================================================== */}

          <div className="mt-10 border border-white/[0.08] bg-white/[0.02] p-6">

            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/20">
              Current access
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-5">

              <div>

                <p className="text-lg text-white/80">
                  {role?.name ??
                    "Member"}
                </p>

                <p className="mt-1 text-sm text-white/30">
                  Rank {role?.rank ??
                    10}
                </p>

              </div>

              <div className="h-8 w-px bg-white/[0.08]" />

              <p className="text-sm text-white/35">
                {user.email}
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  label,
  href,
  value,
}: {
  label: string;
  href: string;
  value: number;
}) {
  return (
    <a
      href={href}
      className="group bg-[#050505] p-6 transition-colors hover:bg-white/[0.025]"
    >

      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">
        {label}
      </p>

      <div className="mt-6 flex items-end justify-between">

        <span className="text-4xl font-semibold tracking-[-0.04em] text-white/80">
          {value}
        </span>

        <span className="text-lg text-white/15 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-300/70">
          ↗
        </span>

      </div>

    </a>
  );
}

/* ================================================================
   QUICK ACTION
================================================================ */

function QuickAction({
  href,
  label,
  symbol,
}: {
  href: string;
  label: string;
  symbol: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between border border-white/[0.08] bg-white/[0.015] px-5 py-4 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/[0.02]"
    >

      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40 transition-colors group-hover:text-white/70">
        {label}
      </span>

      <span className="text-lg text-white/20 transition-all group-hover:text-cyan-300/70">
        {symbol}
      </span>

    </a>
  );
}