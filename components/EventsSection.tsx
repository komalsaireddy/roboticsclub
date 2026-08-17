"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  FileText,
  Search,
  X,
  Eye,
  Trophy,
} from "lucide-react";

import type { EventItem } from "@/lib/data/events";

interface EventsSectionProps {
  events: EventItem[];
}

export default function EventsSection({
  events,
}: EventsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filters = ["ALL", "ROBOTICA", "COMPETITIONS", "WORKSHOPS"];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.chapter ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (selectedFilter === "ROBOTICA") {
      matchesFilter = (event.chapter ?? "").toUpperCase().includes("ROBOTICA") || (event.type ?? "").toUpperCase().includes("ROBOTICA");
    } else if (selectedFilter === "COMPETITIONS") {
      matchesFilter = (event.type ?? "").toUpperCase().includes("COMPETITION") || (event.type ?? "").toUpperCase().includes("RACE") || (event.type ?? "").toUpperCase().includes("CHASE");
    } else if (selectedFilter === "WORKSHOPS") {
      matchesFilter = (event.type ?? "").toUpperCase().includes("WORKSHOP") || (event.type ?? "").toUpperCase().includes("IDEATHON");
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <section
      id="events"
      className="relative z-10 overflow-hidden border-t border-white/[0.06] px-6 py-28 sm:px-10 sm:py-36 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-7xl">

        {/* ============================================================
            HEADER
        ============================================================ */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex items-center justify-between sm:mb-20"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-cyan-400/70">
              03
            </span>
            <span className="h-px w-10 bg-white/15 sm:w-12" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
              Events
            </span>
          </div>

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/20 sm:block">
            COMPETE / CREATE / CONNECT
          </span>
        </motion.div>

        {/* INTRO */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end"
        >
          <h2 className="text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
            BUILT
            <br />
            <span className="text-white/[0.25]">FOR</span>
            <br />
            ACTION.
          </h2>

          <div>
            <div className="mb-6 h-px w-14 bg-cyan-400/60" />
            <p className="max-w-md text-[15px] leading-7 text-white/45 sm:text-[16px] sm:leading-8">
              From flagship robotics competitions to innovation challenges, our events bring
              students together to build, compete and experiment.
            </p>
          </div>
        </motion.div>

        {/* SEARCH & FILTERS BAR */}

        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/[0.08] pb-8">

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((flt) => (
              <button
                key={flt}
                onClick={() => setSelectedFilter(flt)}
                className={`rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  selectedFilter === flt
                    ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    : "border border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {flt}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xs">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-white/10 bg-white/[0.02] pl-10 pr-4 text-xs text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
            />
          </div>

        </div>

        {/* EVENT ARCHIVE */}

        <div className="border-t border-white/[0.08]">

          {filteredEvents.length === 0 ? (
            <div className="border-b border-white/[0.08] py-16 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">
                No events match your criteria
              </p>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.65, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="group relative grid border-b border-white/[0.08] py-9 transition-colors duration-500 hover:bg-white/[0.018] sm:py-11 lg:grid-cols-[70px_1.2fr_1fr_220px] lg:items-center lg:gap-8"
              >

                {/* NUMBER */}

                <div className="mb-5 lg:mb-0">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">
                    {event.number ?? String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* TITLE & CHAPTER */}

                <div className="mb-5 lg:mb-0 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                  <div className="mb-2.5 flex items-center gap-3">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400/55">
                      {event.type ?? "Robotics Event"}
                    </span>
                  </div>

                  <h3 className="text-[21px] font-medium leading-tight tracking-[-0.025em] text-white/80 transition-colors duration-300 group-hover:text-cyan-300 sm:text-2xl">
                    {event.title}
                  </h3>

                  {event.chapter && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                      {event.chapter}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION & DATE */}

                <div className="mb-6 lg:mb-0">
                  <p className="max-w-lg text-[14px] leading-7 text-white/40 transition-colors duration-300 group-hover:text-white/55 sm:text-[15px] line-clamp-2">
                    {event.description ?? "Event information unavailable."}
                  </p>

                  {event.date && (
                    <div className="mt-4 flex items-center gap-2">
                      <CalendarDays size={14} className="text-cyan-400/50" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                        {event.date}
                      </span>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2 justify-start lg:justify-end">

                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/60 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                  >
                    <Eye size={14} />
                    <span>Details</span>
                  </button>

                  {event.rules && (
                    <a
                      href={event.rules}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/60 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                    >
                      <FileText size={14} />
                      <span>Rules</span>
                    </a>
                  )}

                </div>

              </motion.article>
            ))
          )}

        </div>

        {/* EVENT DETAIL MODAL */}

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl border border-white/[0.12] bg-[#070707] p-8 shadow-2xl"
              >
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute right-6 top-6 rounded-full border border-white/10 p-2 text-white/40 hover:border-white/30 hover:text-white"
                >
                  <X size={18} />
                </button>

                {selectedEvent.image && (
                  <div className="mb-6 h-56 w-full overflow-hidden border border-white/10 bg-black">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                    {selectedEvent.type ?? "Robotics Competition"}
                  </span>
                  {selectedEvent.chapter && (
                    <span className="font-mono text-[10px] text-white/40">
                      {selectedEvent.chapter}
                    </span>
                  )}
                </div>

                <h3 className="text-3xl font-medium tracking-[-0.03em] text-white">
                  {selectedEvent.title}
                </h3>

                {selectedEvent.date && (
                  <div className="mt-3 flex items-center gap-2 text-cyan-300/80">
                    <CalendarDays size={16} />
                    <span className="font-mono text-xs uppercase tracking-[0.16em]">
                      {selectedEvent.date}
                    </span>
                  </div>
                )}

                <p className="mt-4 text-[15px] leading-8 text-white/60">
                  {selectedEvent.description ?? "Event details and competition guidelines."}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                    GCET Robotics Club
                  </span>

                  {selectedEvent.rules && (
                    <a
                      href={selectedEvent.rules}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black hover:bg-cyan-300"
                    >
                      <FileText size={15} />
                      Download Event Rules
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ARCHIVE FOOTER */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/20">
            Robotics Club / Events ({filteredEvents.length} items)
          </p>

          <a
            href="#contact"
            className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 hover:text-cyan-300"
          >
            Want to host an event?
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