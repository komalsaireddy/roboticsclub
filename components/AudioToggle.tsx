"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioToggle() {
  const [muted, setMuted] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rc_audio_muted");
      if (saved !== null) {
        return saved === "true";
      }
    }
    return true;
  });

  const toggleAudio = () => {
    const next = !muted;
    setMuted(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("rc_audio_muted", String(next));
    }
  };

  return (
    <button
      onClick={toggleAudio}
      title={muted ? "Enable UI sound effects" : "Mute UI sound effects"}
      aria-label={muted ? "Enable UI sound effects" : "Mute UI sound effects"}
      className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#070707]/90 text-white/50 backdrop-blur-md transition-all hover:border-cyan-400/40 hover:text-cyan-300 shadow-lg"
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-cyan-300" />}
    </button>
  );
}
