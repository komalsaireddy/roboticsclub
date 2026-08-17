"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const mainLinks = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/projects",
    label: "Projects",
  },
  {
    href: "/admin/events",
    label: "Events",
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
  },
  {
    href: "/admin/updates",
    label: "Updates",
  },
  {
    href: "/admin/team",
    label: "Team",
  },
];

const adminLinks = [
  {
    href: "/admin/members",
    label: "Members",
  },
  {
    href: "/admin/roles",
    label: "Roles & Permissions",
  },
  {
    href: "/admin/logs",
    label: "System Logs",
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

export default function MobileAdminNav() {
  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  const currentPage =
    pathname === "/admin"
      ? "Dashboard"
      : pathname.includes("/projects")
        ? "Projects"
        : pathname.includes("/events")
          ? "Events"
          : pathname.includes("/gallery")
            ? "Gallery"
            : pathname.includes("/updates")
              ? "Updates"
              : pathname.includes("/team")
                ? "Team"
                : pathname.includes("/members")
                  ? "Members"
                  : pathname.includes("/roles")
                    ? "Roles & Permissions"
                    : pathname.includes("/logs")
                      ? "System Logs"
                      : "Navigation";

  return (
    <div className="border-b border-white/[0.08] lg:hidden">

      {/* ============================================================
          MOBILE NAV HEADER
      ============================================================ */}

      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-admin-navigation"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.02]"
      >

        <div className="text-left">

          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">
            Control Center
          </p>

          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
            {currentPage}
          </p>

        </div>

        <span
          className={`font-mono text-xl leading-none text-white/50 transition-transform duration-200 ${
            open
              ? "rotate-45"
              : ""
          }`}
        >
          +
        </span>

      </button>

      {/* ============================================================
          MOBILE MENU
      ============================================================ */}

      {open && (
        <nav
          id="mobile-admin-navigation"
          className="border-t border-white/[0.06] bg-[#050505] px-6 py-5"
        >

          {/* ========================================================
              MANAGEMENT
          ======================================================== */}

          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">
            Management
          </p>

          <div className="space-y-1">

            {mainLinks.map((item) => {

              const active =
                isActivePath(
                  pathname,
                  item.href
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setOpen(false)
                  }
                  className={
                    active
                      ? "block border-l border-cyan-400 bg-white/[0.05] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white"
                      : "block border-l border-transparent px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:border-cyan-400/50 hover:bg-white/[0.03] hover:text-white"
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

          <div className="my-5 h-px bg-white/[0.06]" />

          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">
            Administration
          </p>

          <div className="space-y-1">

            {adminLinks.map((item) => {

              const active =
                isActivePath(
                  pathname,
                  item.href
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setOpen(false)
                  }
                  className={
                    active
                      ? "block border-l border-cyan-400 bg-white/[0.05] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white"
                      : "block border-l border-transparent px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:border-cyan-400/50 hover:bg-white/[0.03] hover:text-white"
                  }
                >
                  {item.label}
                </Link>
              );

            })}

          </div>

        </nav>
      )}

    </div>
  );
}