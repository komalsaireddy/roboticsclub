"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Projects", href: "#projects" },
  { label: "Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* =========================================================
          DESKTOP / MOBILE NAVBAR
      ========================================================= */}

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`fixed left-0 right-0 top-0 z-50 px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
          scrolled ? "pt-3" : "pt-5"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-6 ${
            scrolled
              ? "border border-white/[0.08] bg-black/60 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl"
              : "border border-transparent bg-transparent py-3"
          }`}
        >
          {/* =====================================================
              BRAND
          ===================================================== */}

          <a
            href="#home"
            className="group flex items-center gap-3"
            onClick={closeMenu}
          >
            {/* Brand mark */}
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
              <div className="absolute inset-0 bg-cyan-400/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />

              <span className="relative font-mono text-base font-bold text-white">
                ◈
              </span>
            </div>

            {/* Brand text */}
            <div className="hidden sm:block">
              <p className="font-mono text-[12px] font-medium uppercase tracking-[0.22em] text-white">
                Robotics Club
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/30">
                GCET
              </p>
            </div>
          </a>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative rounded-full px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-white/55 transition-colors duration-300 hover:text-white"
              >
                {item.label}

                {/* Hover underline */}
                <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-cyan-400 transition-all duration-300 group-hover:w-6" />
              </a>
            ))}
          </div>

          {/* =====================================================
              JOIN CLUB BUTTON
          ===================================================== */}

          <a
            href="#contact"
            className="group hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.08] lg:flex"
          >
            Join Club

            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{
                    opacity: 0,
                    rotate: -90,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 90,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <X size={19} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{
                    opacity: 0,
                    rotate: 90,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -90,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <Menu size={19} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* =========================================================
          MOBILE FULLSCREEN MENU
      ========================================================= */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#030303]/98 backdrop-blur-2xl lg:hidden"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
            }}
          >
            {/* Mobile background grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />

            {/* Atmospheric glow */}
            <div
              className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,200,255,0.06), transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <div className="relative flex h-full flex-col px-6 pb-8 pt-28">
              {/* Header */}
              <div className="mb-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-400/60">
                  Navigation
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-1 flex-col justify-center">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    initial={{
                      opacity: 0,
                      x: -30,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.08 * index,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group flex items-center justify-between border-b border-white/[0.07] py-5"
                  >
                    <span className="text-3xl font-medium tracking-tight text-white/80 transition-colors duration-300 group-hover:text-white sm:text-4xl">
                      {item.label}
                    </span>

                    <ArrowUpRight
                      size={22}
                      strokeWidth={1}
                      className="text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400"
                    />
                  </motion.a>
                ))}

                {/* Mobile CTA */}
                <motion.a
                  href="#contact"
                  onClick={closeMenu}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.5,
                    duration: 0.5,
                  }}
                  className="mt-8 flex items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300 transition-colors duration-300 hover:bg-cyan-400/[0.1]"
                >
                  Join Robotics Club
                </motion.a>
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                    Geetanjali College of
                  </p>

                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                    Engineering & Technology
                  </p>
                </div>

                <span className="font-mono text-[9px] tracking-[0.25em] text-white/20">
                  GCET / RC
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}