"use client";

import { useEffect, useRef } from "react";
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

// Extend HTMLVideoElement to include optional fastSeek
interface VideoWithFastSeek extends HTMLVideoElement {
  fastSeek?: (time: number) => void;
}

export default function GlobalBackground() {
  const videoRef = useRef<VideoWithFastSeek>(null);
  const rafRef = useRef<number | null>(null);

  // Scroll state
  const scrollProgressRef = useRef(0);   // 0 → 1, where we want to be
  const currentProgressRef = useRef(0);  // smoothed current position
  const lastScrollYRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Keep video paused; we control it via currentTime
    const onMeta = () => video.pause();
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    // ── Scroll listener ──────────────────────────────────────────────────────
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      scrollProgressRef.current =
        maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;

      lastScrollYRef.current = scrollY;
      isScrollingRef.current = true;

      // Mark scrolling as stopped after 120 ms of silence
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // ── rAF loop ─────────────────────────────────────────────────────────────
    // Strategy: smoothly lerp `currentProgressRef` toward `scrollProgressRef`,
    // then seek the video to the corresponding time using fastSeek() when
    // available (avoids full key-frame decode), otherwise currentTime.
    //
    // Lerp factor of 0.18 per frame (~60 fps) gives a ~3-frame lag which reads
    // as buttery smooth to the eye while still feeling responsive.

    const loop = () => {
      if (video.duration) {
        const target = scrollProgressRef.current;
        const current = currentProgressRef.current;
        const diff = target - current;

        // Adaptive lerp: faster when far away, slower when close
        // This avoids the "rubber band" snap at the end
        const lerpFactor = isScrollingRef.current
          ? 0.18   // responsive while scrolling
          : 0.10;  // gentle settle when stopped

        if (Math.abs(diff) > 0.0001) {
          currentProgressRef.current = current + diff * lerpFactor;

          const newTime = currentProgressRef.current * video.duration;

          // fastSeek() is optimised for non-precise seeks (skips to nearest
          // keyframe), making it much faster than setting currentTime directly.
          if (video.fastSeek) {
            video.fastSeek(newTime);
          } else {
            video.currentTime = newTime;
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030303]"
      aria-hidden="true"
    >
      {/* ── Scroll-driven video background ── */}
      <video
        ref={videoRef}
        src="/robot-bg.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: 0.2,
          // GPU-composite the video layer so seeking doesn't trigger layout
          willChange: "contents",
          transform: "translateZ(0)",
        }}
      />

      {/* Heavy gradient vignette — keeps video very dim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(3,3,3,0.45) 0%, rgba(3,3,3,0.82) 100%)",
        }}
      />

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