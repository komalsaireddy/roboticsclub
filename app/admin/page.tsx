import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
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

  return (
    <main className="min-h-screen bg-[#030303] text-white">

      {/* ============================================================
          HEADER
      ============================================================ */}

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
                {profile?.full_name ?? user.email}
              </p>

              <p
                className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em]"
                style={{
                  color:
                    role?.color ?? "#888780",
                }}
              >
                {role?.name ?? "Member"}
              </p>

            </div>

            <form action="/auth/signout" method="post">
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

      {/* ============================================================
          BODY
      ============================================================ */}

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1600px]">

        {/* ==========================================================
            SIDEBAR
        ========================================================== */}

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

            </div>

          </nav>

        </aside>

        {/* ==========================================================
            CONTENT
        ========================================================== */}

        <section className="min-w-0 flex-1 px-6 py-10 lg:px-10 lg:py-12">

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

          {/* ========================================================
              STAT CARDS
          ======================================================== */}

          <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              label="Projects"
              href="/admin/projects"
              table="projects"
            />

            <StatCard
              label="Events"
              href="/admin/events"
              table="events"
            />

            <StatCard
              label="Gallery"
              href="/admin/gallery"
              table="gallery_images"
            />

            <StatCard
              label="Updates"
              href="/admin/updates"
              table="updates"
            />

          </div>

          {/* ========================================================
              ROLE
          ======================================================== */}

          <div className="mt-10 border border-white/[0.08] bg-white/[0.02] p-6">

            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/20">
              Current access
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-5">

              <div>
                <p className="text-lg text-white/80">
                  {role?.name ?? "Member"}
                </p>

                <p className="mt-1 text-sm text-white/30">
                  Rank {role?.rank ?? 10}
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

async function StatCard({
  label,
  href,
  table,
}: {
  label: string;
  href: string;
  table: string;
}) {
  const supabase = await createSupabaseServerClient();

  const { count } = await supabase
    .from(table)
    .select("*", {
      count: "exact",
      head: true,
    });

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
          {count ?? 0}
        </span>

        <span className="text-lg text-white/15 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-300/70">
          ↗
        </span>

      </div>

    </a>
  );
}
