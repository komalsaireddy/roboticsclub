"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative z-10 border-t border-white/[0.06] px-6 pb-8 pt-20">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-12 md:grid-cols-[1fr_auto]">

          {/* Brand */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4">
              <img
                src="/robotics-club-logo.jpg"
                alt="Robotics Club"
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-medium tracking-wide text-white/75">
                  ROBOTICS CLUB
                </p>

                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.25em] text-white/20">
                  GCET
                </p>
              </div>
            </div>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/25">
              Building, experimenting and learning through robotics,
              automation and intelligent systems.
            </p>
          </motion.div>

          {/* Navigation */}

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 sm:grid-cols-3">

            {/* Explore */}

            <div>
              <p className="mb-4 font-mono text-[8px] uppercase tracking-[0.25em] text-white/15">
                Explore
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="#about"
                  className="text-xs text-white/35 transition-colors hover:text-cyan-300"
                >
                  About
                </a>

                <a
                  href="#projects"
                  className="text-xs text-white/35 transition-colors hover:text-cyan-300"
                >
                  Projects
                </a>

                <a
                  href="#events"
                  className="text-xs text-white/35 transition-colors hover:text-cyan-300"
                >
                  Events
                </a>
              </div>
            </div>

            {/* Archive */}

            <div>
              <p className="mb-4 font-mono text-[8px] uppercase tracking-[0.25em] text-white/15">
                Archive
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="#gallery"
                  className="text-xs text-white/35 transition-colors hover:text-cyan-300"
                >
                  Gallery
                </a>

                <a
                  href="#updates"
                  className="text-xs text-white/35 transition-colors hover:text-cyan-300"
                >
                  Updates
                </a>

                <a
                  href="#contact"
                  className="text-xs text-white/35 transition-colors hover:text-cyan-300"
                >
                  Contact
                </a>

                <Link
                  href="/credits"
                  className="text-xs text-cyan-400/70 transition-colors hover:text-cyan-300"
                >
                  Tech Stack & Credits
                </Link>
              </div>
            </div>

            {/* Connect */}

            <div className="col-span-2 sm:col-span-1">
              <p className="mb-4 font-mono text-[8px] uppercase tracking-[0.25em] text-white/15">
                Connect
              </p>

              <div className="flex gap-3">

                {/* Instagram */}

                <a
                  href="https://www.instagram.com/roboticsclub.gcet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center border border-white/[0.08] text-white/30 transition-all hover:border-cyan-300/30 hover:text-cyan-300"
                >
                  <span className="text-[10px] font-bold">
                    IG
                  </span>
                </a>

                {/* LinkedIn */}

                <a
                  href="https://www.linkedin.com/in/robotics-club-gcet-0974282a6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center border border-white/[0.08] text-white/30 transition-all hover:border-cyan-300/30 hover:text-cyan-300"
                >
                  <span className="text-[10px] font-bold">
                    in
                  </span>
                </a>

              </div>
            </div>

          </div>
        </div>

        {/* Bottom */}

        <div className="mt-20 flex flex-col gap-5 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/15">
            © {new Date().getFullYear()} Robotics Club, GCET
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-3 self-start font-mono text-[8px] uppercase tracking-[0.2em] text-white/20 transition-colors hover:text-cyan-300 sm:self-auto"
          >
            Back to top

            <span className="flex h-8 w-8 items-center justify-center border border-white/[0.08] transition-all group-hover:border-cyan-300/30">
              <ArrowUp
                size={13}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </span>
          </button>

        </div>
      </div>
    </footer>
  );
}