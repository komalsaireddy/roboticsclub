"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
} from "lucide-react";

import events from "@/lib/data/events";

export default function EventsSection() {
  const featuredEvents = events.filter((event) => event.featured);
  const regularEvents = events.filter((event) => !event.featured);

  return (
    <section
      id="events"
      className="relative z-10 overflow-hidden border-t border-white/[0.06] px-6 py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
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
              03
            </span>

            <span className="h-px w-12 bg-white/15" />

            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              Events
            </span>
          </div>

          <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-white/15 sm:block">
            COMPETE / CREATE / CONNECT
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
            WHERE IDEAS
            <br />
            <span className="text-white/25">BECOME</span>
            <br />
            ACTION.
          </h2>

          <div className="flex items-end">
            <p className="max-w-md text-sm leading-7 text-white/40 sm:text-base">
              From robotics competitions to innovation challenges, the club's
              events create an environment where engineering meets
              competition, creativity and collaboration.
            </p>
          </div>
        </motion.div>

        {/* ======================================================
            FEATURED ROBOTICA
        ====================================================== */}

        <div className="space-y-8">
          {featuredEvents.map((event, index) => (
            <motion.article
              key={event.id}
              initial={{
                opacity: 0,
                y: 50,
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
                duration: 0.9,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative overflow-hidden border border-white/[0.08] bg-white/[0.015]"
            >
              {/* Image */}

              <div className="relative h-[420px] overflow-hidden sm:h-[520px] lg:h-[600px]">
                {event.image ? (
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{
                      scale: 1.04,
                    }}
                    whileInView={{
                      scale: 1,
                    }}
                    transition={{
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/15">
                      Event Poster Unavailable
                    </span>
                  </div>
                )}

                {/* Image overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Technical grid */}

                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: "70px 70px",
                  }}
                />

                {/* Top labels */}

                <div className="absolute left-6 top-6 flex items-center gap-3 sm:left-8 sm:top-8">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-cyan-300/70">
                    {event.number}
                  </span>

                  <span className="h-px w-8 bg-white/20" />

                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                    {event.type}
                  </span>
                </div>

                {/* Content */}

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
                  <div className="max-w-4xl">
                    <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-cyan-300/60">
                      {event.chapter}
                    </p>

                    <h3 className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.85] tracking-[-0.055em] text-white">
                      {event.title}
                    </h3>

                    <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                      <p className="max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                        {event.description}
                      </p>

                      {event.date && (
                        <div className="flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                          <CalendarDays size={13} strokeWidth={1.2} />
                          {event.date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ======================================================
            OTHER EVENTS
        ====================================================== */}

        <div className="mt-32">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mb-10 flex items-center gap-4"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
              Robotica Events
            </span>

            <span className="h-px flex-1 bg-white/[0.07]" />
          </motion.div>

          <div className="grid border-t border-white/[0.08] md:grid-cols-2">
            {regularEvents.map((event, index) => (
              <motion.article
                key={event.id}
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
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group border-b border-white/[0.08] md:nth-[odd]:border-r"
              >
                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[150px_1fr] lg:p-10">

                  {/* Image */}

                  <div className="relative h-36 overflow-hidden border border-white/[0.07] bg-white/[0.02] sm:h-40">
                    {event.image ? (
                      <motion.img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/15">
                          No Image
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/0" />
                  </div>

                  {/* Content */}

                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-cyan-400/50">
                          {event.number} / {event.type}
                        </span>

                        <h3 className="mt-3 text-2xl font-medium tracking-[-0.025em] text-white/80 transition-colors duration-300 group-hover:text-white sm:text-3xl">
                          {event.title}
                        </h3>
                      </div>

                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.2}
                        className="shrink-0 text-white/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300/70"
                      />
                    </div>

                    <p className="mt-5 text-sm leading-7 text-white/35">
                      {event.description}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-5 pt-7">

                      {event.rules && (
                        <a
                          href={event.rules}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/35 transition-colors duration-300 hover:text-cyan-300"
                        >
                          <FileText
                            size={13}
                            strokeWidth={1.2}
                          />
                          Rules
                        </a>
                      )}

                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/15">
                        Robotics Club
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* ======================================================
            FOOTER LINE
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
          className="mt-10 flex justify-between"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/15">
            Event Archive
          </span>

          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/15">
            GCET / RC
          </span>
        </motion.div>
      </div>
    </section>
  );
}
