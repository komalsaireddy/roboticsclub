"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">

        {/* ============================================================
            HERO CONTENT
        ============================================================ */}

        <div className="relative z-20">

          {/* Eyebrow */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-8 flex items-center gap-3 sm:mb-10"
          >
            <span className="h-px w-8 bg-cyan-400/70 sm:w-12" />

            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-300/80">
              Robotics Club
            </span>

            <span className="text-sm text-cyan-300/30">
              ·
            </span>

            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-300/70">
              GCET
            </span>

            <span className="h-px w-8 bg-cyan-400/30 sm:w-12" />
          </motion.div>

          {/* ============================================================
              MAIN TITLE
          ============================================================ */}

          <div className="relative">

            <motion.h1
              initial={{
                opacity: 0,
                y: 70,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="whitespace-nowrap text-[clamp(3rem,7.2vw,7rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-white"
            >
              ENGINEERING
            </motion.h1>

            <motion.h2
              initial={{
                opacity: 0,
                y: 70,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                delay: 0.48,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="whitespace-nowrap text-[clamp(3rem,7.2vw,7rem)] font-semibold leading-[0.90] tracking-[-0.065em] text-white/[0.27]"
            >
              THE FUTURE.
            </motion.h2>

            {/* Soft title glow */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 2,
                delay: 0.8,
              }}
              className="pointer-events-none absolute left-[35%] top-[35%] -z-10 h-48 w-48 rounded-full bg-cyan-400/[0.035] blur-[100px] sm:h-72 sm:w-72"
            />
          </div>

          {/* ============================================================
              LOWER CONTENT
          ============================================================ */}

          <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-[1fr_auto] lg:items-end">

            {/* Description */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="max-w-2xl"
            >
              <div className="mb-7 h-px w-16 bg-cyan-400/60" />

              <p className="text-[15px] leading-7 text-white/50 sm:text-[16px] sm:leading-8">
                Building intelligent machines, autonomous systems, and the
                next generation of engineers through experimentation,
                competition and collaboration.
              </p>
            </motion.div>

            {/* ============================================================
                BUTTONS
            ============================================================ */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-30 flex flex-wrap gap-3"
            >

              {/* Explore Club */}

              <a
                href="#about"
                aria-label="Explore Robotics Club"
                className="group relative z-30 inline-flex h-12 min-w-[175px] items-center justify-center gap-3 rounded-full bg-white px-7 font-mono text-[11px] font-semibold uppercase tracking-[0.20em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(103,232,249,0.18)]"
              >
                <span className="text-black">
                  Explore Club
                </span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="text-black transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              {/* Our Projects */}

              <a
                href="#projects"
                aria-label="View Robotics Club Projects"
                className="group relative z-30 inline-flex h-12 min-w-[175px] items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.025] px-7 font-mono text-[11px] font-medium uppercase tracking-[0.20em] text-white/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.05] hover:text-white"
              >
                <span>
                  Our Projects
                </span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.4}
                  className="text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300"
                />
              </a>

            </motion.div>
          </div>
        </div>

        {/* ============================================================
            RADAR
        ============================================================ */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.4,
            delay: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="pointer-events-none absolute bottom-[6%] right-[-3%] z-0 hidden h-[420px] w-[420px] lg:block xl:h-[500px] xl:w-[500px]"
          aria-hidden="true"
        >

          {/* Rings */}

          <div className="absolute inset-0 rounded-full border border-cyan-300/[0.08]" />

          <div className="absolute inset-[10%] rounded-full border border-cyan-300/[0.08]" />

          <div className="absolute inset-[20%] rounded-full border border-cyan-300/[0.1]" />

          <div className="absolute inset-[30%] rounded-full border border-cyan-300/[0.12]" />

          <div className="absolute inset-[40%] rounded-full border border-cyan-300/[0.13]" />

          {/* Crosshair */}

          <div className="absolute left-1/2 top-[12%] h-[76%] w-px -translate-x-1/2 bg-cyan-300/[0.07]" />

          <div className="absolute left-[12%] top-1/2 h-px w-[76%] -translate-y-1/2 bg-cyan-300/[0.07]" />

          {/* Center */}

          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/[0.16]" />

          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />

          <motion.div
            animate={{
              scale: [0.8, 1.15, 0.8],
              opacity: [0.55, 1, 0.55],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/80 shadow-[0_0_25px_rgba(103,232,249,0.55)]"
          />

          {/* Radar sweep */}

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-1/2 w-px origin-bottom bg-gradient-to-t from-cyan-300/60 to-transparent"
          />

          {/* Radar points */}

          <motion.div
            animate={{
              opacity: [0.25, 1, 0.25],
              scale: [0.8, 1.15, 0.8],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[15%] top-[18%] h-2 w-2 rounded-full bg-white"
          />

          <motion.div
            animate={{
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[20%] top-[45%] h-2 w-2 rounded-full bg-cyan-300"
          />

          {/* Coordinates */}

          <div className="absolute bottom-[2%] right-[4%] font-mono text-[10px] leading-5 tracking-[0.16em] text-white/[0.18]">
            X 07.421
            <br />
            Y 19.884
            <br />
            Z 04.112
            <br />
            RC / 001
          </div>
        </motion.div>

        {/* ============================================================
            SCROLL
        ============================================================ */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 1.4,
          }}
          className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
        >
          <a
            href="#about"
            className="group flex flex-col items-center gap-3"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 transition-colors duration-300 group-hover:text-cyan-300/70">
              Scroll
            </span>

            <motion.span
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-white/30 transition-colors group-hover:text-cyan-300"
            >
              <ArrowDown
                size={15}
                strokeWidth={1.1}
              />
            </motion.span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}