"use client";

import { useState } from "react";

import BootSequence from "@/components/BootSequence";
import GlobalBackground from "@/components/GlobalBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import EventsSection from "@/components/EventsSection";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <main
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#030303] text-white"
    >
      {/* ======================================================
          BOOT
      ====================================================== */}

      {!bootComplete && (
        <BootSequence onComplete={() => setBootComplete(true)} />
      )}

      {/* ======================================================
          GLOBAL BACKGROUND
      ====================================================== */}

      <GlobalBackground />

      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <Hero />

      {/* ======================================================
          ABOUT
      ====================================================== */}

      <AboutSection />

      {/* ======================================================
          PROJECTS
      ====================================================== */}

      <ProjectsSection />

      {/* ======================================================
          EVENTS
      ====================================================== */}

      <EventsSection />
    </main>
  );
}