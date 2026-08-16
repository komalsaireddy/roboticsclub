"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import type { GalleryItem } from "@/lib/data/gallery";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({
  gallery,
}: GallerySectionProps) {
  return (
    <section
      id="gallery"
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
              04
            </span>

            <span className="h-px w-10 bg-white/15 sm:w-12" />

            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
              Gallery
            </span>
          </div>

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/20 sm:block">
            MOMENTS / MACHINES / PEOPLE
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
            INSIDE
            <br />
            <span className="text-white/[0.25]">
              THE
            </span>
            <br />
            CLUB.
          </h2>

          <div>
            <div className="mb-6 h-px w-14 bg-cyan-400/60" />

            <p className="max-w-md text-[15px] leading-7 text-white/45 sm:text-[16px] sm:leading-8">
              A visual archive of robotics projects, competitions,
              workshops and the people behind the work.
            </p>
          </div>
        </motion.div>

        {/* ============================================================
            GALLERY GRID
        ============================================================ */}

        {gallery.length === 0 ? (
          <div className="border-y border-white/[0.08] py-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">
              No gallery images available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) => (
              <motion.article
                key={item.id}
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
                className="group relative aspect-[4/3] overflow-hidden bg-[#050505]"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover opacity-75 grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    {item.caption && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                        {item.caption}
                      </p>
                    )}

                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center border border-white/15 bg-black/20 text-white/50 backdrop-blur-sm transition-all duration-300 group-hover:border-cyan-300/30 group-hover:text-cyan-300">
                    <ExternalLink
                      size={14}
                      strokeWidth={1.2}
                    />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* ============================================================
            FOOTER
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
            Robotics Club / Visual Archive
          </p>

          <a
            href="#contact"
            className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 hover:text-cyan-300"
          >
            Work with us

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