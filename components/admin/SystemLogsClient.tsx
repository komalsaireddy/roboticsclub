"use client";

import { useMemo, useState } from "react";

interface SystemLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  actor: string;
}

interface SystemLogsClientProps {
  logs: SystemLog[];
}

const AREA_LABELS: Record<string, string> = {
  events: "Events",
  gallery_images: "Gallery",
  membership_requests: "Members",
  profiles: "Members",
  projects: "Projects",
  roles: "Roles",
  role_permissions: "Permissions",
  team_members: "Team",
  updates: "Updates",
};

function getOperation(action: string) {
  if (action.endsWith("_inserted")) return "CREATE";
  if (action.endsWith("_updated")) return "UPDATE";
  if (action.endsWith("_deleted")) return "DELETE";

  return action
    .split("_")
    .pop()
    ?.toUpperCase() ?? "OTHER";
}

function getOperationClass(operation: string) {
  switch (operation) {
    case "CREATE":
      return "border-emerald-400/20 bg-emerald-400/[0.04] text-emerald-300/70";

    case "UPDATE":
      return "border-cyan-400/20 bg-cyan-400/[0.04] text-cyan-300/70";

    case "DELETE":
      return "border-red-400/20 bg-red-400/[0.04] text-red-300/70";

    default:
      return "border-white/[0.08] bg-white/[0.02] text-white/35";
  }
}

function formatArea(entityType: string) {
  return (
    AREA_LABELS[entityType] ??
    entityType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  );
}

function formatAction(action: string) {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(value: string) {
  const date = new Date(value);

  return {
    date: date.toLocaleDateString("en-IN"),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}

export default function SystemLogsClient({
  logs,
}: SystemLogsClientProps) {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("all");
  const [operation, setOperation] = useState("all");

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const currentOperation =
        getOperation(log.action);

      const matchesArea =
        area === "all" ||
        log.entity_type === area;

      const matchesOperation =
        operation === "all" ||
        currentOperation === operation;

      if (!query) {
        return (
          matchesArea &&
          matchesOperation
        );
      }

      const searchable = [
        log.actor,
        log.action,
        log.entity_type,
        log.entity_id ?? "",
        log.description,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesArea &&
        matchesOperation &&
        searchable.includes(query)
      );
    });
  }, [
    logs,
    search,
    area,
    operation,
  ]);

  const areas = Array.from(
    new Set(
      logs.map(
        (log) => log.entity_type
      )
    )
  );

  return (
    <>
      {/* FILTER BAR */}

      <div className="mb-8 border border-white/[0.08] bg-white/[0.015] p-4">

        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">

          {/* SEARCH */}

          <div className="relative">

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search logs..."
              className="h-11 w-full border border-white/[0.08] bg-black/30 px-4 font-mono text-[11px] text-white outline-none placeholder:text-white/20 focus:border-cyan-400/30"
            />

          </div>

          {/* AREA */}

          <select
            value={area}
            onChange={(event) =>
              setArea(event.target.value)
            }
            className="h-11 border border-white/[0.08] bg-[#080808] px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 outline-none focus:border-cyan-400/30"
          >
            <option value="all">
              All Areas
            </option>

            {areas.map((item) => (
              <option
                key={item}
                value={item}
              >
                {formatArea(item)}
              </option>
            ))}
          </select>

          {/* OPERATION */}

          <select
            value={operation}
            onChange={(event) =>
              setOperation(
                event.target.value
              )
            }
            className="h-11 border border-white/[0.08] bg-[#080808] px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 outline-none focus:border-cyan-400/30"
          >
            <option value="all">
              All Actions
            </option>

            <option value="CREATE">
              Create
            </option>

            <option value="UPDATE">
              Update
            </option>

            <option value="DELETE">
              Delete
            </option>
          </select>

        </div>

        <div className="mt-3 flex items-center justify-between">

          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
            Showing {filteredLogs.length} of{" "}
            {logs.length} logs
          </p>

          {(search ||
            area !== "all" ||
            operation !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setArea("all");
                setOperation("all");
              }}
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300/50 transition-colors hover:text-cyan-300"
            >
              Clear Filters
            </button>
          )}

        </div>

      </div>

      {/* EMPTY FILTER RESULT */}

      {filteredLogs.length === 0 ? (
        <div className="border border-white/[0.08] px-6 py-16 text-center">

          <p className="text-3xl text-white/20">
            ◌
          </p>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            No matching system logs
          </p>

        </div>
      ) : (

        <div className="overflow-hidden border border-white/[0.08]">

          {/* HEADER */}

          <div className="hidden grid-cols-[170px_180px_1fr_150px] gap-6 border-b border-white/[0.08] bg-white/[0.02] px-6 py-4 lg:grid">

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
              Time
            </p>

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
              Actor
            </p>

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
              Activity
            </p>

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
              Area
            </p>

          </div>

          <div className="divide-y divide-white/[0.06]">

            {filteredLogs.map((log) => {
              const {
                date,
                time,
              } = formatDate(
                log.created_at
              );

              const currentOperation =
                getOperation(log.action);

              return (
                <div
                  key={log.id}
                  className="grid gap-5 px-6 py-6 transition-colors hover:bg-white/[0.02] lg:grid-cols-[170px_180px_1fr_150px] lg:items-start lg:gap-6"
                >

                  {/* TIME */}

                  <div>
                    <p className="font-mono text-[10px] text-white/50">
                      {date}
                    </p>

                    <p className="mt-1 font-mono text-[9px] text-white/20">
                      {time}
                    </p>
                  </div>

                  {/* ACTOR */}

                  <div>
                    <p className="text-[14px] text-white/65">
                      {log.actor}
                    </p>

                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/15">
                      {log.user_id
                        ? "Authenticated user"
                        : "System"}
                    </p>
                  </div>

                  {/* ACTIVITY */}

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span
                        className={`inline-flex border px-2 py-1 font-mono text-[8px] font-medium uppercase tracking-[0.13em] ${getOperationClass(
                          currentOperation
                        )}`}
                      >
                        {currentOperation}
                      </span>

                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
                        {formatAction(
                          log.action
                        )}
                      </span>

                    </div>

                    <p className="mt-3 text-[14px] leading-6 text-white/55">
                      {log.description}
                    </p>

                    {log.entity_id && (
                      <p className="mt-2 font-mono text-[8px] text-white/15">
                        ID: {log.entity_id}
                      </p>
                    )}

                    {log.metadata && (
                      <details className="mt-4">

                        <summary className="cursor-pointer font-mono text-[8px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50">
                          View Changes
                        </summary>

                        <pre className="mt-3 max-h-96 overflow-auto border border-white/[0.06] bg-black/40 p-4 font-mono text-[9px] leading-5 text-white/35">
                          {JSON.stringify(
                            log.metadata,
                            null,
                            2
                          )}
                        </pre>

                      </details>
                    )}

                  </div>

                  {/* AREA */}

                  <div>

                    <span className="inline-flex border border-white/[0.08] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/30">
                      {formatArea(
                        log.entity_type
                      )}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      )}
    </>
  );
}
