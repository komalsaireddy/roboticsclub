"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface BootSequenceProps {
  onComplete?: () => void;
}

export default function BootSequence({
  onComplete,
}: BootSequenceProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 2600);

    const completeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3400);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: exiting ? 1.04 : 1,
      }}
      transition={{
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {/* ============================================================
          AMBIENT CENTER GLOW
      ============================================================ */}

      <motion.div
        className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{
          opacity: 0,
          scale: 0.3,
        }}
        animate={{
          opacity: [0, 0.12, 0.08],
          scale: [0.3, 1, 1.15],
        }}
        transition={{
          duration: 2.2,
          ease: "easeOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(0,220,255,0.35) 0%, rgba(0,220,255,0.08) 35%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* ============================================================
          CENTER CONTENT
      ============================================================ */}

      <div className="relative z-10 flex flex-col items-center">

        {/* ==========================================================
            LOGO
        ========================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.62,
            filter: "blur(14px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1.35,
            delay: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative"
        >

          {/* Logo glow */}

          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: [0, 0.45, 0.18],
              scale: [0.7, 1.25, 1.05],
            }}
            transition={{
              duration: 1.8,
              delay: 0.35,
              ease: "easeOut",
            }}
            style={{
              background:
                "radial-gradient(circle, rgba(0,220,255,0.35), transparent 65%)",
              filter: "blur(25px)",
            }}
          />

          {/* Floating logo */}

          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/robotics-club-logo.jpg"
              alt="Robotics Club GCET"
              width={200}
              height={200}
              priority
              className="relative h-40 w-40 object-contain md:h-48 md:w-48"
            />
          </motion.div>

        </motion.div>

        {/* ==========================================================
            CLUB NAME
        ========================================================== */}

        <motion.div
          className="mt-8 text-center"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 1.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        >

          <h1 className="font-mono text-sm font-medium uppercase tracking-[0.45em] text-white md:text-base">
            Robotics Club
          </h1>

          <motion.p
            className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 md:text-[10px]"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 1.55,
            }}
          >
            Geetanjali College of Engineering & Technology
          </motion.p>

        </motion.div>

      </div>

    </motion.div>
  );
}