"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Cpu,
  CircuitBoard,
  Bot,
} from "lucide-react";

const focusAreas = [
  {
    number: "01",
    icon: Cpu,
    title: "Robotics",
    description:
      "Designing and building robotic systems that turn engineering concepts into working machines.",
  },
  {
    number: "02",
    icon: CircuitBoard,
    title: "Embedded Systems",
    description:
      "Working with electronics, sensors, controllers and intelligent hardware to create connected systems.",
  },
  {
    number: "03",
    icon: Bot,
    title: "Autonomous Systems",
    description:
      "Exploring automation, computer vision, artificial intelligence and systems capable of intelligent decisions.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 overflow-hidden border-t border-white/[0.06] px-6 py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section header */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-20 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/70">
              01
            </span>

            <span className="h-px w-12 bg-white/15" />

            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              About the Club
            </span>
          </div>

          <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-white/15 sm:block">
            GCET / ROBOTICS
          </span>
        </motion.div>

        {/* Main introduction */}

        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-400/60">
              Beyond the classroom
            </p>

            <h2 className="max-w-5xl text-[clamp(3.2rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
              WE DON'T JUST
              <br />
              <span className="text-white/25">BUILD ROBOTS.</span>
              <br />
              WE BUILD
              <br />
              <span className="text-cyan-300/80">ENGINEERS.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col justify-end lg:pb-3"
          >
            <div className="mb-8 h-px w-16 bg-cyan-400/60" />

            <p className="text-base leading-8 text-white/50 sm:text-lg">
              The Robotics Club at Geetanjali College of Engineering &
              Technology brings students together to explore robotics,
              electronics, automation and intelligent systems through
              hands-on engineering.
            </p>

            <p className="mt-6 text-sm leading-7 text-white/30">
              From building prototypes and participating in technical
              competitions to experimenting with emerging technologies,
              the club provides a space where ideas can move from concepts
              to working systems.
            </p>

            <a
              href="#projects"
              className="group mt-9 flex w-fit items-center gap-3 border-b border-white/15 pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 transition-colors duration-300 hover:border-cyan-400/50 hover:text-cyan-300"
            >
              Explore our work

              <ArrowUpRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>

        {/* Technical visual */}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 1,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mt-28 h-[420px] overflow-hidden border border-white/[0.07] bg-white/[0.015] sm:h-[500px] lg:mt-36"
        >
          {/* Grid */}

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "70px 70px",
            }}
          />

          {/* Glow */}

          <motion.div
            className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background:
                "radial-gradient(circle, rgba(0,200,255,0.12), transparent 68%)",
              filter: "blur(40px)",
            }}
          />

          {/* Orbital rings */}

          <motion.div
            className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10"
            animate={{ rotate: 360 }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]"
            animate={{ rotate: -360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15"
            animate={{ rotate: 360 }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Central CPU */}

          <motion.div
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/20 bg-black/70"
            animate={{
              boxShadow: [
                "0 0 20px rgba(0,200,255,0.05)",
                "0 0 50px rgba(0,200,255,0.14)",
                "0 0 20px rgba(0,200,255,0.05)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Cpu
              size={28}
              strokeWidth={1}
              className="text-cyan-300/70"
            />
          </motion.div>

          {/* Crosshair */}

          <div className="absolute left-1/2 top-[18%] h-[64%] w-px -translate-x-1/2 bg-white/[0.06]" />

          <div className="absolute left-[18%] top-1/2 h-px w-[64%] -translate-y-1/2 bg-white/[0.06]" />

          {/* Technical labels */}

          <div className="absolute left-6 top-6 font-mono text-[8px] uppercase tracking-[0.25em] text-white/20">
            SYSTEM / 01
          </div>

          <div className="absolute right-6 top-6 font-mono text-[8px] uppercase tracking-[0.25em] text-white/20">
            GCET / RC
          </div>

          <div className="absolute bottom-6 left-6 font-mono text-[8px] uppercase tracking-[0.25em] text-white/20">
            ENGINEERING
          </div>

          <div className="absolute bottom-6 right-6 font-mono text-[8px] uppercase tracking-[0.25em] text-cyan-300/30">
            ACTIVE
          </div>

          {/* Scan line */}

          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent"
            animate={{
              top: ["10%", "90%", "10%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Focus areas */}

        <div className="mt-28 grid border-t border-white/[0.07] md:grid-cols-3">
          {focusAreas.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative border-b border-white/[0.07] py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-white/20">
                    {item.number}
                  </span>

                  <Icon
                    size={20}
                    strokeWidth={1}
                    className="text-white/20 transition-colors duration-300 group-hover:text-cyan-300/70"
                  />
                </div>

                <h3 className="text-xl font-medium tracking-tight text-white/80 transition-colors duration-300 group-hover:text-white">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-white/35">
                  {item.description}
                </p>

                <div className="mt-8 h-px w-0 bg-cyan-400/50 transition-all duration-500 group-hover:w-12" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
