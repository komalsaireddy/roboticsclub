"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Award,
  ChevronDown,
  Cpu,
  HelpCircle,
  Lightbulb,
  Users,
  Wrench,
} from "lucide-react";

const focusAreas = [
  {
    number: "01",
    icon: Cpu,
    title: "BUILD",
    description:
      "Turn ideas into working machines through hands-on robotics, electronics, automation and embedded systems.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "EXPERIMENT",
    description:
      "Explore new technologies, test unconventional ideas and learn through practical experimentation.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "ENGINEER",
    description:
      "Design, prototype and refine systems with a focus on solving real engineering problems.",
  },
  {
    number: "04",
    icon: Users,
    title: "COLLABORATE",
    description:
      "Work together across disciplines, share knowledge and build projects as a team.",
  },
];

export default function AboutSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-white/[0.06] px-6 py-28 sm:px-10 sm:py-36 lg:px-16 lg:py-44"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-20"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-300/75">
              01
            </span>

            <span className="h-px w-10 bg-cyan-400/50" />

            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-white/35">
              About The Club
            </span>
          </div>

          <h2 className="max-w-5xl text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
            WE BUILD
            <br />
            <span className="text-white/[0.25]">
              WHAT COMES NEXT.
            </span>
          </h2>
        </motion.div>

        {/* Introduction */}

        <div className="grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="mb-8 h-px w-20 bg-cyan-400/60" />

            <p className="max-w-2xl text-[17px] leading-8 text-white/65 sm:text-[18px] sm:leading-9">
              The Robotics Club of Geetanjali College of Engineering and
              Technology is a space for students to explore robotics,
              technology and engineering through practical work.
            </p>

            <p className="mt-7 max-w-2xl text-[15px] leading-8 text-white/40 sm:text-[16px]">
              From autonomous vehicles and humanoid systems to aerial
              robotics and experimental prototypes, the club encourages
              students to move beyond theory and build things that work.
            </p>

            <a
              href="#projects"
              className="group mt-10 inline-flex items-center gap-3 border-b border-white/[0.12] pb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 transition-all duration-300 hover:border-cyan-300/40 hover:text-cyan-300"
            >
              Explore our projects

              <ArrowUpRight
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>

          {/* Right profile block */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
          >
            <div className="relative overflow-hidden border border-white/[0.08] bg-white/[0.015] p-8 sm:p-10">

              <div className="absolute left-0 top-0 h-px w-16 bg-cyan-400/60" />
              <div className="absolute left-0 top-0 h-16 w-px bg-cyan-400/60" />

              <div className="absolute bottom-0 right-0 h-px w-16 bg-white/[0.12]" />
              <div className="absolute bottom-0 right-0 h-16 w-px bg-white/[0.12]" />

              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/35">
                  Club / Profile
                </span>

                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/60">
                  GCET / RC
                </span>
              </div>

              <div className="mt-16">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/30">
                  Projects developed
                </span>

                <div className="mt-3 text-[clamp(4rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.07em] text-white">
                  20<span className="text-cyan-300/60">+</span>
                </div>
              </div>

              <div className="mt-14 grid grid-cols-2 gap-8 border-t border-white/[0.07] pt-7">

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Focus
                  </p>

                  <p className="mt-2 text-[14px] font-medium text-white/65">
                    Robotics &amp; Technology
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Approach
                  </p>

                  <p className="mt-2 text-[14px] font-medium text-white/65">
                    Build · Test · Learn
                  </p>
                </div>

              </div>

              <div className="mt-10 font-mono text-[10px] leading-5 tracking-[0.18em] text-white/[0.18]">
                RC / GCET
                <br />
                SYSTEM / ACTIVE
                <br />
                MODE / BUILD
              </div>

            </div>
          </motion.div>

        </div>

        {/* Focus areas */}

        <div className="mt-28 sm:mt-36">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300/60">
                What We Do
              </p>

              <h3 className="mt-4 text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
                From idea to prototype.
              </h3>
            </div>

            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 sm:block">
              04 / Focus Areas
            </span>
          </motion.div>

          <div className="grid border-l border-t border-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">

            {focusAreas.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative min-h-[290px] border-b border-r border-white/[0.07] p-7 transition-colors duration-500 hover:bg-white/[0.025] sm:p-8"
                >
                  <div className="flex items-center justify-between">

                    <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">
                      {item.number}
                    </span>

                    <Icon
                      size={19}
                      strokeWidth={1.2}
                      className="text-white/25 transition-colors duration-300 group-hover:text-cyan-300"
                    />

                  </div>

                  <h4 className="mt-20 text-xl font-medium tracking-[-0.02em] text-white/80 transition-colors duration-300 group-hover:text-white">
                    {item.title}
                  </h4>

                  <p className="mt-4 text-[14px] leading-7 text-white/38">
                    {item.description}
                  </p>

                  <div className="absolute bottom-0 left-0 h-px w-0 bg-cyan-300/60 transition-all duration-500 group-hover:w-full" />
                </motion.div>
              );
            })}

          </div>
        </div>

        {/* FAQ Accordion Section */}

        <div className="mt-28 sm:mt-36">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-cyan-400/70" />
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300/60">
                  Got Questions?
                </p>
              </div>

              <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
                Frequently Asked Questions
              </h3>
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
              05 / FAQ & Info
            </span>
          </motion.div>

          <div className="divide-y divide-white/[0.08] border-b border-t border-white/[0.08]">

            {[
              {
                q: "Who can join the Robotics Club?",
                a: "Any enrolled student at Geetanjali College of Engineering and Technology (GCET), regardless of branch or academic year, is welcome to register and join the club."
              },
              {
                q: "Is prior experience in robotics or programming required?",
                a: "No! We regularly host hands-on beginner workshops covering Arduino programming, Raspberry Pi, 3D printing, CAD modeling, sensor interfacing, and PCB design."
              },
              {
                q: "How can I participate in club projects and competitions?",
                a: "Members can join active project teams, register for internal hackathons like Robotica, or pitch original project ideas to receive component funding and faculty mentorship."
              },
              {
                q: "What equipment and lab tools does the club provide?",
                a: "Our dedicated innovation lab is equipped with 3D printers, soldering stations, digital oscilloscopes, microcontrollers, motor drivers, sensor modules, and CAD workstations."
              },
              {
                q: "How long does it take for a membership request to be approved?",
                a: "After submitting your registration on the website, a Robotics Club administrator will review and approve your account within 24 to 48 hours."
              }
            ].map((faq, index) => (
              <div key={index} className="py-6 sm:py-7">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between text-left transition-colors hover:text-cyan-300"
                >
                  <span className="text-lg font-medium text-white/85 sm:text-xl">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-white/40 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180 text-cyan-300" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/45 sm:text-[16px]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

          </div>

        </div>

        {/* Bottom statement */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mt-24 border-t border-white/[0.07] pt-8 sm:mt-32 sm:pt-10"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/25">
              Robotics Club / GCET
            </span>

            <p className="max-w-2xl text-[15px] leading-7 text-white/38 sm:text-right sm:text-[16px]">
              We believe the best way to understand technology is to build
              with it, break it, improve it and build again.
            </p>

          </div>
        </motion.div>

      </div>
    </section>
  );
}