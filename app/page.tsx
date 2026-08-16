"use client";

import { useState } from "react";

import Atmosphere from "@/components/Atmosphere";
import BootSequence from "@/components/BootSequence";
import GlobalBackground from "@/components/GlobalBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import EventsSection from "@/components/EventsSection";
import GallerySection from "@/components/GallerySection";
import UpdatesSection from "@/components/UpdatesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <main
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#030303] text-white"
    >
      {/* Boot animation */}

      {!bootComplete && (
        <BootSequence onComplete={() => setBootComplete(true)} />
      )}

      {/* Global visual layers */}

      <GlobalBackground />
      <Atmosphere />

      {/* Public website */}

      <Navbar />

      <Hero />

      <AboutSection />

      <ProjectsSection />

      <EventsSection />

      <GallerySection />

      <UpdatesSection />

      <ContactSection />

      <Footer />
    </main>
  );
}