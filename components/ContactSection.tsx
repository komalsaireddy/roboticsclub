"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Mail,
  MapPin,
} from "lucide-react";

export default function ContactSection() {
  return (
    <section
      id="contact"
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
              06
            </span>

            <span className="h-px w-10 bg-white/15 sm:w-12" />

            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
              Contact
            </span>

          </div>

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 sm:block">
            Establish Connection
          </span>

        </motion.div>

        {/* ============================================================
            MAIN CONTENT
        ============================================================ */}

        <div className="grid gap-16 lg:grid-cols-[1fr_0.55fr] lg:gap-24">

          {/* ==========================================================
              LEFT
          ========================================================== */}

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
          >

            <p className="mb-6 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-400/65">
              Let&apos;s build something
            </p>

            <h2 className="text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
              HAVE AN
              <br />
              <span className="text-white/[0.25]">
                IDEA?
              </span>
              <br />
              LET&apos;S
              <br />
              <span className="text-cyan-300/80">
                BUILD.
              </span>
            </h2>

            <p className="mt-9 max-w-xl text-[15px] leading-7 text-white/45 sm:text-[16px] sm:leading-8">
              Interested in collaborating, participating in an event,
              joining the club, or working on a robotics project?
              Get in touch with the Robotics Club.
            </p>

            {/* Email CTA */}

            <a
              href="mailto:robotics@gcet.edu.in"
              className="group mt-9 inline-flex items-center gap-4 border-b border-white/15 pb-3 text-[15px] text-white/60 transition-colors duration-300 hover:border-cyan-300/40 hover:text-cyan-300"
            >

              <Mail
                size={17}
                strokeWidth={1.2}
              />

              <span>
                robotics@gcet.edu.in
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />

            </a>

          </motion.div>

          {/* ==========================================================
              RIGHT
          ========================================================== */}

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
              amount: 0.25,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col justify-end"
          >

            <div className="border-t border-white/[0.08]">

              {/* ======================================================
                  LOCATION
              ====================================================== */}

              <div className="flex gap-5 border-b border-white/[0.08] py-7 sm:py-8">

                <MapPin
                  size={18}
                  strokeWidth={1.2}
                  className="mt-1 shrink-0 text-cyan-300/50"
                />

                <div>

                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/25">
                    Location
                  </p>

                  <p className="mt-3 text-[15px] leading-7 text-white/55">
                    Geetanjali College of Engineering
                    <br />
                    &amp; Technology
                  </p>

                </div>

              </div>

              {/* ======================================================
                  EMAIL
              ====================================================== */}

              <div className="flex gap-5 border-b border-white/[0.08] py-7 sm:py-8">

                <Mail
                  size={18}
                  strokeWidth={1.2}
                  className="mt-1 shrink-0 text-cyan-300/50"
                />

                <div>

                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/25">
                    Email
                  </p>

                  <a
                    href="mailto:robotics@gcet.edu.in"
                    className="mt-3 block text-[15px] text-white/55 transition-colors duration-300 hover:text-cyan-300"
                  >
                    robotics@gcet.edu.in
                  </a>

                </div>

              </div>

              {/* ======================================================
                  SOCIAL
              ====================================================== */}

              <div className="flex gap-5 py-7 sm:py-8">

                <div className="mt-1 flex h-[18px] w-[18px] items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
                </div>

                <div>

                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/25">
                    Social
                  </p>

                  <div className="mt-4 flex gap-3">

                    {/* Instagram */}

                    <a
                      href="https://www.instagram.com/roboticsclub.gcet/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-11 w-11 items-center justify-center border border-white/[0.08] text-white/40 transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.05] hover:text-cyan-300"
                    >
                      <span className="text-[11px] font-bold tracking-tight">
                        IG
                      </span>
                    </a>

                    {/* LinkedIn */}

                    <a
                      href="https://www.linkedin.com/in/robotics-club-gcet-0974282a6/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="flex h-11 w-11 items-center justify-center border border-white/[0.08] text-white/40 transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.05] hover:text-cyan-300"
                    >
                      <span className="text-[12px] font-bold">
                        in
                      </span>
                    </a>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

        {/* ============================================================
            BOTTOM
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
          className="mt-20 border-t border-white/[0.07] pt-7"
        >

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/20">
              Robotics Club / GCET
            </span>

            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/15">
              Open For Collaboration
            </span>

          </div>

        </motion.div>

      </div>
    </section>
  );
}