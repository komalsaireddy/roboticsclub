"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  const rotateX = useTransform(smoothY, [-500, 500], [6, -6]);
  const rotateY = useTransform(smoothX, [-500, 500], [-6, 6]);

  const coreX = useTransform(smoothX, [-500, 500], [-12, 12]);
  const coreY = useTransform(smoothY, [-500, 500], [-12, 12]);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX - window.innerWidth / 2);
      mouseY.set(event.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!mounted) {
    return (
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center px-6"
      />
    );
  }

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24"
    >
      {/* ========================================================
          HERO ATMOSPHERE
      ======================================================== */}

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[46%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,255,0.08), rgba(0,120,180,0.025) 40%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl">

        {/* ======================================================
            TECHNICAL LABEL
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-7 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-cyan-400/70" />

          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400/80">
            Robotics Club · GCET
          </span>

          <span className="hidden h-px w-8 bg-cyan-400/30 sm:block" />
        </motion.div>

        {/* ======================================================
            HERO TITLE
        ====================================================== */}

        <div className="relative max-w-6xl">
          <motion.h1
            initial={{
              opacity: 0,
              y: 50,
              filter: "blur(12px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1.1,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-semibold leading-[0.87] tracking-[-0.055em]"
          >
            <span className="block text-[clamp(4rem,11vw,10rem)] text-white">
              ENGINEERING
            </span>

            <span className="mt-2 block text-[clamp(4rem,11vw,10rem)] text-white/[0.28]">
              THE FUTURE.
            </span>
          </motion.h1>

          {/* Accent line */}

          <motion.div
            initial={{
              width: 0,
              opacity: 0,
            }}
            animate={{
              width: "clamp(100px, 15vw, 220px)",
              opacity: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-7 h-px bg-gradient-to-r from-cyan-400/70 to-transparent"
          />
        </div>

        {/* ======================================================
            DESCRIPTION + ACTIONS
        ====================================================== */}

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
            delay: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-sm leading-7 text-white/45 sm:text-base">
            Building intelligent machines, autonomous systems, and the next
            generation of engineers through experimentation, competition and
            collaboration.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#about"
              className="group flex items-center gap-3 rounded-full bg-white px-6 py-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-cyan-300"
            >
              Explore Club

              <ArrowUpRight
                size={14}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <a
              href="#projects"
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Our Projects
            </a>
          </div>
        </motion.div>

        {/* ======================================================
            ROBOTICS CORE
        ====================================================== */}

        <motion.div
          className="pointer-events-none absolute right-[-2%] top-[28%] hidden h-[460px] w-[460px] lg:block"
          style={{
            rotateX,
            rotateY,
          }}
        >
          {/* Outer orbital ring */}

          <motion.div
            className="absolute inset-[8%] rounded-full border border-cyan-400/[0.10]"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Second ring */}

          <motion.div
            className="absolute inset-[18%] rounded-full border border-white/[0.07]"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Third ring */}

          <motion.div
            className="absolute inset-[28%] rounded-full border border-cyan-400/[0.12]"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Orbital accent 01 */}

          <motion.div
            className="absolute left-[13%] top-[38%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.8)]"
            animate={{
              scale: [0.7, 1.2, 0.7],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Orbital accent 02 */}

          <motion.div
            className="absolute right-[18%] top-[22%] h-1.5 w-1.5 rounded-full bg-white/70"
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          {/* ====================================================
              CENTRAL CORE
          ==================================================== */}

          <motion.div
            className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2"
            style={{
              x: coreX,
              y: coreY,
            }}
          >
            {/* Core glow */}

            <motion.div
              className="absolute inset-[-35%] rounded-full"
              animate={{
                scale: [0.9, 1.1, 0.9],
                opacity: [0.25, 0.5, 0.25],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(0,210,255,0.22), transparent 68%)",
                filter: "blur(25px)",
              }}
            />

            {/* Core body */}

            <motion.div
              className="absolute inset-[18%] rounded-full border border-cyan-300/20 bg-black/70 backdrop-blur-sm"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="absolute inset-[18%] rounded-full border border-white/[0.08]" />

              <div className="absolute inset-[31%] rounded-full border border-cyan-300/20" />
            </motion.div>

            {/* Core center */}

            <motion.div
              className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
              animate={{
                scale: [0.75, 1, 0.75],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                boxShadow:
                  "0 0 12px rgba(103,232,249,0.8), 0 0 45px rgba(0,180,255,0.35)",
              }}
            />

            {/* Vertical crosshair */}

            <div className="absolute left-1/2 top-[-12%] h-[124%] w-px -translate-x-1/2 bg-white/[0.08]" />

            {/* Horizontal crosshair */}

            <div className="absolute left-[-12%] top-1/2 h-px w-[124%] -translate-y-1/2 bg-white/[0.08]" />
          </motion.div>

          {/* Technical coordinates */}

          <div className="absolute bottom-[8%] right-[4%] font-mono text-[8px] uppercase tracking-[0.22em] text-white/20">
            X 07.421
            <br />
            Y 19.884
            <br />
            Z 04.112
          </div>

          {/* Scanning line */}

          <motion.div
            className="absolute left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"
            animate={{
              top: ["20%", "80%", "20%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* ========================================================
          SCROLL INDICATOR
      ======================================================== */}

      <motion.a
        href="#about"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 1,
          delay: 1.7,
        }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-white/25 transition-colors duration-300 hover:text-white/60"
      >
        <span className="font-mono text-[8px] uppercase tracking-[0.35em]">
          Scroll
        </span>

        <motion.div
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDown size={15} strokeWidth={1} />
        </motion.div>
      </motion.a>

      {/* ========================================================
          SIDE TECHNICAL MARKER
      ======================================================== */}

      <div className="absolute bottom-8 right-8 hidden font-mono text-[8px] uppercase tracking-[0.3em] text-white/15 lg:block">
        RC / 001
      </div>
    </section>
  );
}