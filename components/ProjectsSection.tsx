"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  ExternalLink,
  FileText,
  Search,
  X,
  Eye,
  Layers,
} from "lucide-react";

import type { Project } from "@/lib/data/projects";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({
  projects,
}: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Extract unique categories
  const categories = ["ALL", ...Array.from(new Set(projects.map((p) => (p.category ?? "Robotics").toUpperCase())))];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" ||
      (project.category ?? "").toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

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
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            INTRO & FILTERS
        ============================================================ */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end"
        >
          <h2 className="text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
            ENGINEERED
            <br />
            <span className="text-white/[0.25]">TO WORK.</span>
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

        {/* SEARCH & CATEGORY BAR */}

        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/[0.08] pb-8">

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    : "border border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xs">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-white/10 bg-white/[0.02] pl-10 pr-4 text-xs text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
            />
          </div>

        </div>

        {/* ============================================================
            PROJECT ARCHIVE
        ============================================================ */}

        <div className="border-t border-white/[0.08]">

          {filteredProjects.length === 0 ? (
            <div className="border-b border-white/[0.08] py-16 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">
                No matching projects found
              </p>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.65, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="group relative grid border-b border-white/[0.08] py-9 transition-colors duration-500 hover:bg-white/[0.018] sm:py-11 lg:grid-cols-[70px_1.2fr_1fr_220px] lg:items-center lg:gap-8"
              >

                {/* NUMBER */}

                <div className="mb-5 lg:mb-0">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">
                    {project.number ?? String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* TITLE & CATEGORY */}

                <div className="mb-5 lg:mb-0 cursor-pointer" onClick={() => setSelectedProject(project)}>
                  <div className="mb-2.5 flex items-center gap-3">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400/55">
                      {project.category ?? "Robotics"}
                    </span>
                  </div>

                  <h3 className="text-[21px] font-medium leading-tight tracking-[-0.025em] text-white/80 transition-colors duration-300 group-hover:text-cyan-300 sm:text-2xl flex items-center gap-2">
                    {project.title}
                  </h3>
                </div>

                {/* DESCRIPTION */}

                <div className="mb-6 lg:mb-0">
                  <p className="max-w-lg text-[14px] leading-7 text-white/40 transition-colors duration-300 group-hover:text-white/55 sm:text-[15px] line-clamp-2">
                    {project.description ?? "Project description unavailable."}
                  </p>
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2 justify-start lg:justify-end">

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/60 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>

                  {project.document && (
                    <a
                      href={project.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/60 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                    >
                      <FileText size={14} />
                      <span>PDF</span>
                    </a>
                  )}

                </div>

              </motion.article>
            ))
          )}

        </div>

        {/* ============================================================
            PROJECT DETAIL MODAL
        ============================================================ */}

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
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
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-6 top-6 rounded-full border border-white/10 p-2 text-white/40 hover:border-white/30 hover:text-white"
                >
                  <X size={18} />
                </button>

                {selectedProject.image && (
                  <div className="mb-6 h-56 w-full overflow-hidden border border-white/10 bg-black">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                    {selectedProject.category ?? "Robotics"}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">
                    ID: {selectedProject.number ?? selectedProject.id.slice(0, 8)}
                  </span>
                </div>

                <h3 className="text-3xl font-medium tracking-[-0.03em] text-white">
                  {selectedProject.title}
                </h3>

                <p className="mt-4 text-[15px] leading-8 text-white/60">
                  {selectedProject.description ?? "Detailed description for this project."}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                    Robotics Club GCET
                  </span>

                  {selectedProject.document && (
                    <a
                      href={selectedProject.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black hover:bg-cyan-300"
                    >
                      <FileText size={15} />
                      Download Documentation
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
            Robotics Club / Project Archive ({filteredProjects.length} items)
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