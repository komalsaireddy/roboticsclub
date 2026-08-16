"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  FileText,
  ExternalLink,
} from "lucide-react";

import projects from "@/lib/data/projects";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 overflow-hidden border-t border-white/[0.06] px-6 py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* ======================================================
            SECTION HEADER
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-20 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/70">
              02
            </span>

            <span className="h-px w-12 bg-white/15" />

            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              Projects
            </span>
          </div>

          <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-white/15 sm:block">
            BUILT / TESTED / REFINED
          </span>
        </motion.div>

        {/* ======================================================
            INTRO
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
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
          className="mb-24 grid gap-10 lg:grid-cols-[1fr_0.55fr]"
        >
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
            ENGINEERED
            <br />
            <span className="text-white/25">TO WORK.</span>
          </h2>

          <div className="flex items-end">
            <p className="max-w-md text-sm leading-7 text-white/40 sm:text-base">
              Explore projects developed by Robotics Club members across
              autonomous systems, mobile robotics, humanoid robotics and
              embedded engineering.
            </p>
          </div>
        </motion.div>

        {/* ======================================================
            PROJECT LIST
        ====================================================== */}

        <div className="border-t border-white/[0.08]">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group grid border-b border-white/[0.08] py-8 transition-colors duration-500 hover:bg-white/[0.015] sm:py-10 lg:grid-cols-[80px_1fr_1.2fr_180px] lg:items-center lg:gap-8"
            >
              {/* Number */}

              <div className="mb-5 lg:mb-0">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/20">
                  {project.number}
                </span>
              </div>

              {/* Project title */}

              <div className="mb-5 lg:mb-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-cyan-400/50">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-2xl font-medium tracking-[-0.025em] text-white/80 transition-colors duration-300 group-hover:text-white sm:text-3xl">
                  {project.title}
                </h3>
              </div>

              {/* Description */}

              <div className="mb-6 lg:mb-0">
                <p className="max-w-lg text-sm leading-7 text-white/35 transition-colors duration-300 group-hover:text-white/50">
                  {project.description}
                </p>
              </div>

              {/* Action */}

              <div className="flex items-center justify-start lg:justify-end">
                {project.document ? (
                  project.status === "available" ? (
                    <a
                      href={project.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                    >
                      <FileText size={14} strokeWidth={1.3} />

                      Documentation

                      <ExternalLink
                        size={12}
                        strokeWidth={1.3}
                        className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      />
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/15">
                      <FileText size={13} strokeWidth={1.2} />
                      Documentation unavailable
                    </span>
                  )
                ) : (
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/15">
                    Details unavailable
                  </span>
                )}
              </div>

              {/* Mobile divider accent */}

              <div className="mt-7 h-px w-0 bg-cyan-400/40 transition-all duration-500 group-hover:w-12 lg:hidden" />
            </motion.article>
          ))}
        </div>

        {/* ======================================================
            FOOTNOTE
        ====================================================== */}

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
          className="mt-10 flex items-center justify-between"
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/15">
            Robotics Club / Project Archive
          </p>

          <a
            href="#contact"
            className="group flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.25em] text-white/25 transition-colors duration-300 hover:text-cyan-300"
          >
            Have a project idea?

            <ArrowUpRight
              size={12}
              strokeWidth={1.2}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}