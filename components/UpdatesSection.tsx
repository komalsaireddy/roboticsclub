"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Bell,
} from "lucide-react";

import updates from "@/lib/data/updates";

export default function UpdatesSection() {
  return (
    <section
      id="updates"
      className="relative z-10 overflow-hidden border-t border-white/[0.06] px-6 py-28 sm:px-10 sm:py-36 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-7xl">

        {/* ============================================================
            HEADER
        ============================================================ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-16 flex items-center justify-between sm:mb-20"
        >
          <div className="flex items-center gap-4">

            <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-cyan-400/70">
              05
            </span>

            <span className="h-px w-10 bg-white/15 sm:w-12" />

            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
              Updates
            </span>

          </div>

          <div className="hidden items-center gap-3 sm:flex">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              Club Feed
            </span>

          </div>
        </motion.div>

        {/* ============================================================
            TITLE
        ============================================================ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-20 grid gap-10 lg:grid-cols-[1fr_0.5fr] lg:items-end"
        >

          <h2 className="text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
            WHAT&apos;S
            <br />
            <span className="text-white/[0.25]">
              HAPPENING
            </span>
            <br />
            NOW.
          </h2>

          <div>

            <div className="mb-6 h-px w-14 bg-cyan-400/60" />

            <p className="max-w-md text-[15px] leading-7 text-white/45 sm:text-[16px] sm:leading-8">
              Follow the latest activity, announcements and milestones from
              the Robotics Club.
            </p>

          </div>

        </motion.div>

        {/* ============================================================
            UPDATE FEED
        ============================================================ */}

        <div className="border-t border-white/[0.08]">

          {updates.map((update, index) => (
            <motion.article
              key={update.id}
              initial={{
                opacity: 0,
                x: -25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative grid gap-6 border-b border-white/[0.08] py-9 transition-colors duration-500 hover:bg-white/[0.015] sm:py-11 lg:grid-cols-[140px_170px_1fr_40px] lg:items-center"
            >

              {/* ======================================================
                  DATE
              ====================================================== */}

              <div>

                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/25">
                  {update.date}
                </span>

              </div>

              {/* ======================================================
                  CATEGORY
              ====================================================== */}

              <div className="flex items-center gap-3">

                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.08] text-cyan-300/55 transition-colors duration-300 group-hover:border-cyan-300/20 group-hover:text-cyan-300/80">
                  <Bell
                    size={15}
                    strokeWidth={1.2}
                  />
                </span>

                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/30">
                  {update.category}
                </span>

              </div>

              {/* ======================================================
                  CONTENT
              ====================================================== */}

              <div>

                <h3 className="text-[21px] font-medium leading-tight tracking-[-0.025em] text-white/80 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                  {update.title}
                </h3>

                <p className="mt-3 max-w-2xl text-[14px] leading-7 text-white/40 transition-colors duration-300 group-hover:text-white/55 sm:text-[15px]">
                  {update.description}
                </p>

              </div>

              {/* ======================================================
                  ARROW
              ====================================================== */}

              <div className="hidden lg:block">

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.2}
                  className="text-white/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300/70"
                />

              </div>

              {/* ======================================================
                  HOVER LINE
              ====================================================== */}

              <motion.div
                className="absolute bottom-0 left-0 h-px bg-cyan-300/50"
                initial={{
                  width: 0,
                }}
                whileHover={{
                  width: "100%",
                }}
                transition={{
                  duration: 0.5,
                }}
              />

            </motion.article>
          ))}

        </div>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >

          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/20">
            Public Activity Feed
          </span>

          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/15">
            Admin Managed / Future
          </span>

        </motion.div>

      </div>
    </section>
  );
}