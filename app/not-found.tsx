import Link from "next/link";
import { Bot, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030303] px-6 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.03] blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">

        {/* Robot Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.03] text-cyan-300">
          <Bot size={36} strokeWidth={1.2} />
        </div>

        {/* Status Code */}
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/70">
          ERROR 404 / PATH NOT FOUND
        </p>

        {/* Heading */}
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Robotic Trajectory Lost
        </h1>

        {/* Message */}
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-white/40">
          The requested page or resource could not be located in the Robotics Club matrix.
        </p>

        {/* Navigation Buttons */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300"
          >
            <Home size={15} />
            Back to Home
          </Link>

          <Link
            href="/#projects"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.02] px-7 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 transition-all hover:border-white/25 hover:text-white"
          >
            <ArrowLeft size={15} />
            View Projects
          </Link>
        </div>

      </div>

    </main>
  );
}
