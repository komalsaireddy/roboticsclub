"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mainLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    key: "dashboard",
  },
  {
    href: "/admin/projects",
    label: "Projects",
    key: "projects",
  },
  {
    href: "/admin/events",
    label: "Events",
    key: "events",
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    key: "gallery",
  },
  {
    href: "/admin/updates",
    label: "Updates",
    key: "updates",
  },
  {
    href: "/admin/team",
    label: "Team",
    key: "team",
  },
];

const adminLinks = [
  {
    href: "/admin/members",
    label: "Members",
    key: "members",
  },
  {
    href: "/admin/roles",
    label: "Roles & Permissions",
    key: "roles",
  },
  {
    href: "/admin/logs",
    label: "System Logs",
    key: "logs",
  },
];

function isActivePath(
  pathname: string,
  href: string
) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full p-6">

      {/* ========================================================
          MANAGEMENT
      ======================================================== */}

      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">
        Management
      </p>

      <div className="space-y-1">

        {mainLinks.map((item) => {
          const active = isActivePath(
            pathname,
            item.href
          );

          return (
            <Link
              key={item.key}
              href={item.href}
              className={
                active
                  ? "block border-l border-cyan-400 bg-white/[0.04] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white"
                  : "block border-l border-transparent px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              }
            >
              {item.label}
            </Link>
          );
        })}

      </div>

      {/* ========================================================
          ADMINISTRATION
      ======================================================== */}

      <div className="my-6 h-px bg-white/[0.06]" />

      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">
        Administration
      </p>

      <div className="space-y-1">

        {adminLinks.map((item) => {
          const active = isActivePath(
            pathname,
            item.href
          );

          return (
            <Link
              key={item.key}
              href={item.href}
              className={
                active
                  ? "block border-l border-cyan-400 bg-white/[0.04] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white"
                  : "block border-l border-transparent px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white"
              }
            >
              {item.label}
            </Link>
          );
        })}

      </div>

    </nav>
  );
}
