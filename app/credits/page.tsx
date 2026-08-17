import Link from "next/link";
import { ArrowLeft, Code2, Cpu, ExternalLink, Globe, Layers, Mail, ShieldCheck, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits & Tech Stack | Robotics Club GCET",
  description: "Developer credits, architecture, and technology stack powering the Robotics Club GCET platform.",
};

const techStack = [
  {
    name: "Next.js 16 (App Router)",
    role: "Core Web Framework",
    description: "Server-side rendering, Turbopack bundling, server actions, and route handlers.",
    category: "Frontend & Backend",
  },
  {
    name: "TypeScript 5",
    role: "Type System",
    description: "End-to-end static type safety across all database queries, props, and server actions.",
    category: "Language",
  },
  {
    name: "Supabase (PostgreSQL)",
    role: "Database & Authentication",
    description: "Row Level Security (RLS), Supabase SSR Auth, cookie management, and file storage.",
    category: "Database & Auth",
  },
  {
    name: "TailwindCSS v4",
    role: "Design System & Styling",
    description: "Custom glassmorphism utilities, dark mode tokens, and responsive layout grid.",
    category: "Styling",
  },
  {
    name: "Framer Motion",
    role: "Animations & Transitions",
    description: "Physics-based micro-interactions, hero animations, and smooth page transitions.",
    category: "UI Animations",
  },
  {
    name: "Vercel Edge Network",
    role: "Global Deployment",
    description: "Production serverless execution, global CDN caching, and automated CI/CD builds.",
    category: "Infrastructure",
  },
];

export default function CreditsPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white">

      {/* Header */}
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10">
              <img src="/robotics-club-logo.jpg" alt="Robotics Club GCET" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                Robotics Club
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">
                GCET / Credits
              </p>
            </div>
          </Link>

          <Link href="/" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 hover:text-cyan-300">
            <ArrowLeft size={14} />
            Back to Website
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* Title */}
        <div className="mb-16">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400">
            DEVELOPER & CREDITS
          </span>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Platform Architecture & Credits
          </h1>

          <p className="mt-4 max-w-2xl text-[16px] leading-8 text-white/50">
            The official web platform of the Robotics Club of Geetanjali College of Engineering and Technology, designed and engineered for modern performance, security, and scalability.
          </p>
        </div>

        {/* Lead Architect & Developer Card */}
        <div className="mb-20 border border-cyan-400/30 bg-cyan-400/[0.025] p-8 sm:p-10 shadow-[0_0_50px_rgba(34,211,238,0.05)]">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
              <Code2 size={16} />
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Lead Architect & Developer
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                K. Komal Sai Reddy
              </h2>

              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                Department of Computer Science & Engineering (CSE) · Tech Lead
              </p>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/60">
                Architected and developed the full-stack Robotics Club web application, including server-side rendering, RBAC authorization, custom UI components, responsive mobile layout, and Supabase integration.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:kothakomalsaireddy@gmail.com"
                className="inline-flex h-12 items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200 transition-all hover:bg-cyan-400/20"
              >
                <Mail size={15} />
                <span>Contact Tech Lead</span>
              </a>
            </div>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div>
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/30">
                TECHNOLOGY STACK
              </p>
              <h3 className="mt-1 text-2xl font-medium text-white">
                Engineering Stack & Tools
              </h3>
            </div>
            <Layers size={20} className="text-white/30" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => (
              <div key={tech.name} className="border border-white/[0.08] bg-white/[0.015] p-6 transition-all hover:border-white/20">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/70">
                  {tech.category}
                </span>

                <h4 className="mt-3 text-lg font-medium text-white">
                  {tech.name}
                </h4>

                <p className="mt-1 font-mono text-[11px] text-white/40">
                  {tech.role}
                </p>

                <p className="mt-3 text-xs leading-6 text-white/50">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 border-t border-white/10 pt-8 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
            Robotics Club GCET © 2026
          </p>
          <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 hover:underline">
            Return to Homepage →
          </Link>
        </div>

      </div>

    </main>
  );
}
