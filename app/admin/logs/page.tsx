import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import SystemLogsClient from "@/components/admin/SystemLogsClient";

export default async function AdminLogsPage() {
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
     PERMISSION
  ============================================================ */

  const {
    data: allowed,
    error: permissionError,
  } = await supabase.rpc(
    "has_permission",
    {
      perm: "view_system_logs",
    }
  );

  if (permissionError || !allowed) {
    return (
      <main className="min-h-screen bg-[#030303] px-6 py-20 text-white">

        <div className="mx-auto max-w-4xl">

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-300/60">
            Access Denied
          </p>

          <h1 className="mt-4 text-4xl font-medium">
            System Logs
          </h1>

          <p className="mt-4 text-[16px] text-white/35">
            You do not have permission to view system logs.
          </p>

          <a
            href="/admin"
            className="mt-8 inline-block border border-white/[0.1] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
          >
            ← Back to Admin
          </a>

        </div>

      </main>
    );
  }

  /* ============================================================
     LOAD LOGS
  ============================================================ */

  const {
    data: logs,
    error: logsError,
  } = await supabase
    .from("system_logs")
    .select(`
      id,
      user_id,
      action,
      entity_type,
      entity_id,
      description,
      metadata,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(200);

  if (logsError) {
    throw new Error(
      logsError.message
    );
  }

  /* ============================================================
     LOAD ACTORS
  ============================================================ */

  const userIds = Array.from(
    new Set(
      (logs ?? [])
        .map(
          (log) =>
            log.user_id
        )
        .filter(Boolean)
    )
  );

  const {
    data: profiles,
  } = userIds.length
    ? await supabase
        .from("profiles")
        .select(
          "id, full_name"
        )
        .in(
          "id",
          userIds
        )
    : {
        data: [],
      };

  const profileMap =
    new Map(
      (profiles ?? []).map(
        (profile) => [
          profile.id,
          profile.full_name,
        ]
      )
    );

  /* ============================================================
     PREPARE CLIENT DATA
  ============================================================ */

  const formattedLogs =
    (logs ?? []).map(
      (log) => ({
        id: log.id,

        user_id:
          log.user_id,

        action:
          log.action,

        entity_type:
          log.entity_type,

        entity_id:
          log.entity_id,

        description:
          log.description,

        metadata:
          (log.metadata as Record<
            string,
            unknown
          > | null) ?? null,

        created_at:
          log.created_at,

        actor:
          log.user_id
            ? profileMap.get(
                log.user_id
              ) ??
              "Unknown user"
            : "System",
      })
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

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
              Administration
            </p>

            <h1 className="mt-2 text-2xl font-medium">
              System Logs
            </h1>

          </div>

          <a
            href="/admin"
            className="border border-white/[0.1] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:border-white/20 hover:text-white"
          >
            ← Admin
          </a>

        </div>

      </header>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <section className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10">

        {/* ======================================================
            INTRO
        ====================================================== */}

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
              Audit Trail
            </p>

            <p className="mt-2 text-[15px] text-white/35">
              {formattedLogs.length} recent system events
            </p>

          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
            Latest 200
          </div>

        </div>

        {/* ======================================================
            LOG VIEWER
        ====================================================== */}

        <SystemLogsClient
          logs={formattedLogs}
        />

      </section>

    </main>
  );
}