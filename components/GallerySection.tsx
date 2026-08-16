"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
} from "lucide-react";

import gallery from "@/lib/data/gallery";

export default function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedImage =
    selectedIndex !== null ? gallery[selectedIndex] : null;

  const closeViewer = () => {
    setSelectedIndex(null);
  };

  const showPrevious = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0
        ? gallery.length - 1
        : selectedIndex - 1
    );
  };

  const showNext = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === gallery.length - 1
        ? 0
        : selectedIndex + 1
    );
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <>
      {/* ============================================================
          GALLERY SECTION
      ============================================================ */}

      <section
        id="gallery"
        className="relative z-10 overflow-hidden border-t border-white/[0.06] px-6 py-28 sm:px-10 sm:py-36 lg:px-16 lg:py-40"
      >
        <div className="mx-auto max-w-7xl">

          {/* ========================================================
              HEADER
          ======================================================== */}

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
              Moments / Archive
            </span>
          </motion.div>

          {/* ========================================================
              TITLE
          ======================================================== */}

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
            className="mb-20 grid gap-10 lg:grid-cols-[1fr_0.5fr] lg:items-end"
          >

            <h2 className="text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
              MOMENTS
              <br />
              <span className="text-white/[0.25]">
                IN
              </span>
              <br />
              MOTION.
            </h2>

            <div>

              <div className="mb-6 h-px w-14 bg-cyan-400/60" />

              <p className="max-w-md text-[15px] leading-7 text-white/45 sm:text-[16px] sm:leading-8">
                A visual archive of the people, machines, competitions and
                moments that have shaped the Robotics Club.
              </p>

            </div>

          </motion.div>

          {/* ========================================================
              GALLERY GRID
          ======================================================== */}

          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12">

            {gallery.map((item, index) => {

              const layoutClasses = [
                "col-span-2 lg:col-span-7 lg:row-span-2",
                "col-span-1 lg:col-span-5",
                "col-span-1 lg:col-span-5",
                "col-span-2 lg:col-span-4",
                "col-span-2 lg:col-span-4",
                "col-span-2 lg:col-span-4",
                "col-span-2 lg:col-span-7",
                "col-span-2 lg:col-span-5",
              ];

              const layout =
                layoutClasses[index % layoutClasses.length];

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
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
                    amount: 0.1,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: (index % 4) * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`group relative overflow-hidden bg-white/[0.02] text-left ${layout}`}
                >

                  <div className="relative aspect-[4/3] min-h-[190px] w-full sm:min-h-[250px] lg:min-h-[280px]">

                    {/* Image */}

                    <motion.img
                      src={item.src}
                      alt={item.alt}
                      loading={index < 4 ? "eager" : "lazy"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.045]"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-black/15 transition-all duration-500 group-hover:bg-black/0" />

                    {/* Cyan hover wash */}

                    <div className="absolute inset-0 bg-cyan-300/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Scan line */}

                    <motion.div
                      className="absolute left-0 right-0 h-px bg-cyan-300/40 opacity-0"
                      initial={{
                        top: "0%",
                      }}
                      whileHover={{
                        top: "100%",
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                    />

                    {/* Image number */}

                    <div className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Expand button */}

                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/35 text-white/65 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                      <Maximize2
                        size={15}
                        strokeWidth={1.2}
                      />
                    </div>

                  </div>

                </motion.button>
              );
            })}

          </div>

          {/* ========================================================
              FOOTER
          ======================================================== */}

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
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >

            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/20">
              {gallery.length} Archived Moments
            </span>

            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/20">
              GCET / Robotics Club
            </span>

          </motion.div>

        </div>
      </section>

      {/* ==============================================================
          FULLSCREEN IMAGE VIEWER
      ============================================================== */}

      <AnimatePresence>

        {selectedImage && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl sm:p-8"
            onClick={closeViewer}
          >

            {/* ========================================================
                CLOSE
            ======================================================== */}

            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close image viewer"
              className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.03] text-white/60 transition-all duration-300 hover:border-cyan-300/30 hover:text-cyan-300 sm:right-8 sm:top-8"
            >
              <X
                size={19}
                strokeWidth={1.2}
              />
            </button>

            {/* ========================================================
                COUNTER
            ======================================================== */}

            <div className="absolute left-5 top-6 font-mono text-[10px] tracking-[0.22em] text-white/35 sm:left-8 sm:top-9">
              {String((selectedIndex ?? 0) + 1).padStart(2, "0")}
              {" / "}
              {String(gallery.length).padStart(2, "0")}
            </div>

            {/* ========================================================
                PREVIOUS
            ======================================================== */}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/40 text-white/55 backdrop-blur-md transition-all duration-300 hover:border-cyan-300/30 hover:text-cyan-300 sm:left-8"
            >
              <ArrowLeft
                size={19}
                strokeWidth={1.2}
              />
            </button>

            {/* ========================================================
                NEXT
            ======================================================== */}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/40 text-white/55 backdrop-blur-md transition-all duration-300 hover:border-cyan-300/30 hover:text-cyan-300 sm:right-8"
            >
              <ArrowRight
                size={19}
                strokeWidth={1.2}
              />
            </button>

            {/* ========================================================
                IMAGE
            ======================================================== */}

            <motion.div
              key={selectedImage.id}
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex h-[80vh] w-full max-w-6xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >

              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-full max-w-full object-contain"
              />

            </motion.div>

            {/* ========================================================
                KEYBOARD HINT
            ======================================================== */}

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 sm:bottom-8">
              ESC / CLOSE
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}