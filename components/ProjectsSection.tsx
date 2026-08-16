"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  ExternalLink,
  FileText,
} from "lucide-react";

import projects from "@/lib/data/projects";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 overflow-hidden border-t border-white/[0.06] px-6 py-28 sm:px-10 sm:py-36 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-7xl">

        {/* ============================================================
            SECTION HEADER
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
              02
            </span>

            <span className="h-px w-10 bg-white/15 sm:w-12" />

            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
              Projects
            </span>

          </div>

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/20 sm:block">
            Built / Tested / Refined
          </span>
        </motion.div>

        {/* ============================================================
            INTRO
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
          className="mb-20 grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end"
        >

          <h2 className="text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
            ENGINEERED
            <br />
            <span className="text-white/[0.25]">
              TO WORK.
            </span>
          </h2>

          <div>

            <div className="mb-6 h-px w-14 bg-cyan-400/60" />

            <p className="max-w-md text-[15px] leading-7 text-white/45 sm:text-[16px] sm:leading-8">
              Explore projects developed by Robotics Club members across
              autonomous systems, mobile robotics, humanoid robotics and
              embedded engineering.
            </p>

          </div>

        </motion.div>

        {/* ============================================================
            PROJECT ARCHIVE
        ============================================================ */}

        <div className="border-t border-white/[0.08]">

          {projects.map((project, index) => (
            <motion.article
              key={project.id}
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
                amount: 0.12,
              }}
              transition={{
                duration: 0.65,
                delay: index * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative grid border-b border-white/[0.08] py-9 transition-colors duration-500 hover:bg-white/[0.018] sm:py-11 lg:grid-cols-[70px_1fr_1.2fr_190px] lg:items-center lg:gap-8"
            >

              {/* ======================================================
                  NUMBER
              ====================================================== */}

              <div className="mb-5 lg:mb-0">

                <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">
                  {project.number}
                </span>

              </div>

              {/* ======================================================
                  TITLE
              ====================================================== */}

              <div className="mb-5 lg:mb-0">

                <div className="mb-2.5">

                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400/55">
                    {project.category}
                  </span>

                </div>

                <h3 className="text-[21px] font-medium leading-tight tracking-[-0.025em] text-white/80 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                  {project.title}
                </h3>

              </div>

              {/* ======================================================
                  DESCRIPTION
              ====================================================== */}

              <div className="mb-6 lg:mb-0">

                <p className="max-w-lg text-[14px] leading-7 text-white/40 transition-colors duration-300 group-hover:text-white/55 sm:text-[15px]">
                  {project.description}
                </p>

              </div>

              {/* ======================================================
                  DOCUMENTATION
              ====================================================== */}

              <div className="flex items-center justify-start lg:justify-end">

                {project.document ? (

                  project.status === "available" ? (

                    <a
                      href={project.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                    >

                      <FileText
                        size={15}
                        strokeWidth={1.3}
                      />

                      <span>
                        Documentation
                      </span>

                      <ExternalLink
                        size={13}
                        strokeWidth={1.3}
                        className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      />

                    </a>

                  ) : (

                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/20">

                      <FileText
                        size={14}
                        strokeWidth={1.2}
                      />

                      Documentation unavailable

                    </span>

                  )

                ) : (

                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/20">
                    Details unavailable
                  </span>

                )}

              </div>

              {/* ======================================================
                  MOBILE ACCENT
              ====================================================== */}

              <div className="mt-7 h-px w-0 bg-cyan-400/50 transition-all duration-500 group-hover:w-12 lg:hidden" />

            </motion.article>
          ))}

        </div>

        {/* ============================================================
            ARCHIVE FOOTER
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
          className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/20">
            Robotics Club / Project Archive
          </p>

          <a
            href="#contact"
            className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 hover:text-cyan-300"
          >

            Have a project idea?

            <ArrowUpRight
              size={14}
              strokeWidth={1.2}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />

          </a>

        </motion.div>

      </div>
    </section>
  );
}