"use client";

import { useState } from "react";

import type { Project } from "@/lib/data/projects";
import type { EventItem } from "@/lib/data/events";
import type { GalleryItem } from "@/lib/data/gallery";
import type { UpdateItem } from "@/lib/data/updates";
import type { TeamMember } from "@/lib/data/team";

import BootSequence from "@/components/BootSequence";
import GlobalBackground from "@/components/GlobalBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import JoinStepperSection from "@/components/JoinStepperSection";
import ProjectsSection from "@/components/ProjectsSection";
import EventsSection from "@/components/EventsSection";
import TeamSection from "@/components/TeamSection";
import GallerySection from "@/components/GallerySection";
import UpdatesSection from "@/components/UpdatesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

interface HomeClientProps {
  projects: Project[];
  events: EventItem[];
  gallery: GalleryItem[];
  updates: UpdateItem[];
  team: TeamMember[];
}

export default function HomeClient({
  projects,
  events,
  gallery,
  updates,
  team,
}: HomeClientProps) {
  const [
    bootComplete,
    setBootComplete,
  ] = useState(false);

  return (
    <main
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#030303] text-white"
    >

      {!bootComplete && (
        <BootSequence
          onComplete={() =>
            setBootComplete(true)
          }
        />
      )}

      <GlobalBackground />

      <Navbar />

      <Hero />

      <AboutSection />

      <JoinStepperSection />

      <ProjectsSection
        projects={projects}
      />

      <EventsSection
        events={events}
      />

      <TeamSection
        team={team}
      />

      <GallerySection
        gallery={gallery}
      />

      <UpdatesSection
        updates={updates}
      />

      <ContactSection />

      <Footer />

    </main>
  );
}
