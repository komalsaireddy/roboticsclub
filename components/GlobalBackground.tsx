"use client";

import { motion } from "motion/react";

const particles = [
  { left: "8%", top: "18%", delay: 0 },
  { left: "21%", top: "72%", delay: 1.4 },
  { left: "36%", top: "31%", delay: 2.2 },
  { left: "54%", top: "82%", delay: 0.8 },
  { left: "68%", top: "22%", delay: 1.8 },
  { left: "81%", top: "61%", delay: 3 },
  { left: "91%", top: "35%", delay: 0.4 },
  { left: "47%", top: "12%", delay: 2.8 },
];

export default function GlobalBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030303]"
      aria-hidden="true"
    >
      {/* Technical grid */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 80%)",
        }}
      />

      {/* Center atmosphere */}
      <motion.div
        className="absolute left-1/2 top-[35%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,190,255,0.075) 0%, rgba(0,120,180,0.025) 35%, transparent 70%)",
          filter: "blur(35px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Moving atmospheric light */}
      <motion.div
        className="absolute -left-[15%] top-[15%] h-[500px] w-[900px] rotate-[-18deg]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,210,255,0.035), transparent 65%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: ["0%", "45%", "0%"],
          y: ["0%", "20%", "0%"],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Particles */}
      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute h-[2px] w-[2px] rounded-full bg-white/40"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [0.7, 1.3, 0.7],
            y: [0, -12, 0],
          }}
          transition={{
            duration: 4 + index * 0.35,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle scanline */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-white/[0.025]"
        animate={{
          top: ["-5%", "105%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}