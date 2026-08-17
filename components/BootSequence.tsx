"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface BootSequenceProps {
  onComplete?: () => void;
}

export default function BootSequence({
  onComplete,
}: BootSequenceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt autoplay (muted, so browsers always allow it)
    video.play().catch(() => {
      // If autoplay is blocked for any reason, skip the boot screen
      triggerExit();
    });

    const triggerExit = () => {
      setExiting(true);
      // Fade-out duration is 700 ms (matches the motion transition below)
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 700);
    };

    // Fire exit when the video naturally ends
    video.addEventListener("ended", triggerExit);

    // Safety fallback: if video hasn't ended after 12 s, exit anyway
    const fallback = setTimeout(triggerExit, 12000);

    return () => {
      video.removeEventListener("ended", triggerExit);
      clearTimeout(fallback);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <video
        ref={videoRef}
        src="/boot-animation.mp4"
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}