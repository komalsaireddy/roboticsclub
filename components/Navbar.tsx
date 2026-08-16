"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Projects",
    href: "#projects",
  },
  {
    label: "Events",
    href: "#events",
  },
  {
    label: "Team",
    href: "#team",
  },
  {
    label: "Gallery",
    href: "#gallery",
  },
  {
    label: "Updates",
    href: "#updates",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* ============================================================
          NAVBAR
      ============================================================ */}

      <motion.header
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed left-0 right-0 top-0 z-50 px-5 pt-5 sm:px-8 sm:pt-7 lg:px-12"
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between">

          {/* ========================================================
              LOGO
          ======================================================== */}

          <a
            href="#home"
            className="group flex items-center gap-3"
            onClick={closeMenu}
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.025] transition-all duration-300 group-hover:border-cyan-300/30">
              <img
                src="/robotics-club-logo.jpg"
                alt="Robotics Club GCET"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="hidden sm:block">
              <p className="font-mono text-[12px] font-medium uppercase tracking-[0.22em] text-white/80">
                Robotics Club
              </p>

              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                GCET
              </p>
            </div>
          </a>

          {/* ========================================================
              DESKTOP NAVIGATION
          ======================================================== */}

          <div className="hidden items-center gap-6 lg:flex xl:gap-8">

            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-white/55 transition-colors duration-300 hover:text-cyan-300"
              >
                {item.label}
              </a>
            ))}

          </div>

          {/* ========================================================
              DESKTOP AUTH BUTTONS
          ======================================================== */}

          <div className="hidden items-center gap-3 lg:flex">

            {/* REGISTER */}

            <a
              href="/register"
              className="group inline-flex h-11 items-center gap-3 rounded-full border border-cyan-300/25 bg-cyan-300/[0.04] px-5 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-cyan-200/80 backdrop-blur-sm transition-all duration-300 hover:border-cyan-300/50 hover:bg-cyan-300/[0.08] hover:text-cyan-100"
            >
              <span>
                Register
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            {/* LOGIN */}

            <a
              href="/login"
              className="group inline-flex h-11 items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.025] px-5 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
            >
              <span>
                Login
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

          </div>

          {/* ========================================================
              MOBILE MENU BUTTON
          ======================================================== */}

          <button
            type="button"
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen((open) => !open)
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.025] text-white/70 transition-all duration-300 hover:border-cyan-300/30 hover:text-white lg:hidden"
          >
            {menuOpen ? (
              <X
                size={19}
                strokeWidth={1.4}
              />
            ) : (
              <Menu
                size={19}
                strokeWidth={1.4}
              />
            )}
          </button>

        </nav>
      </motion.header>

      {/* ==============================================================
          MOBILE MENU
      ============================================================== */}

      <motion.div
        initial={false}
        animate={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen
            ? "auto"
            : "none",
        }}
        transition={{
          duration: 0.25,
        }}
        className="fixed inset-0 z-40 bg-[#030303]/95 backdrop-blur-xl lg:hidden"
      >

        <div className="flex min-h-screen flex-col px-7 pb-10 pt-32">

          {/* ========================================================
              MOBILE HEADER
          ======================================================== */}

          <div className="mb-10">

            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300/70">
              Navigation
            </p>

            <div className="mt-3 h-px w-16 bg-cyan-400/50" />

          </div>

          {/* ========================================================
              MOBILE LINKS
          ======================================================== */}

          <div className="flex flex-col">

            {navigation.map(
              (item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={
                    menuOpen
                      ? {
                          opacity: 1,
                          x: 0,
                        }
                      : {
                          opacity: 0,
                          x: -20,
                        }
                  }
                  transition={{
                    duration: 0.4,
                    delay: menuOpen
                      ? index * 0.06
                      : 0,
                    ease: [
                      0.16,
                      1,
                      0.3,
                      1,
                    ],
                  }}
                  className="border-b border-white/[0.06] py-5 text-2xl font-medium text-white/75 transition-colors duration-300 hover:text-cyan-300"
                >
                  {item.label}
                </motion.a>
              )
            )}

          </div>

          {/* ========================================================
              MOBILE AUTH BUTTONS
          ======================================================== */}

          <div className="mt-auto flex flex-col gap-3">

            {/* REGISTER */}

            <a
              href="/register"
              onClick={closeMenu}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-full border border-cyan-300/25 bg-cyan-300/[0.04] px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-cyan-200 transition-all duration-300 hover:border-cyan-300/50 hover:bg-cyan-300/[0.08] hover:text-cyan-100"
            >
              Register

              <ArrowUpRight
                size={15}
                strokeWidth={1.7}
              />
            </a>

            {/* LOGIN */}

            <a
              href="/login"
              onClick={closeMenu}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-white px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-transform duration-300 hover:scale-[1.02]"
            >
              Login

              <ArrowUpRight
                size={15}
                strokeWidth={1.7}
              />
            </a>

          </div>

        </div>

      </motion.div>
    </>
  );
}
