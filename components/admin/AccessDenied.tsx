"use client";

import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-white">

      <div className="w-full max-w-lg text-center">

        {/* Icon */}

        <div className="mx-auto flex h-20 w-20 items-center justify-center border border-red-400/20 bg-red-400/[0.04]">
          <ShieldX
            size={32}
            strokeWidth={1.2}
            className="text-red-300/70"
          />
        </div>

        {/* Code */}

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-red-300/60">
          ERROR 403
        </p>

        {/* Heading */}

        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Access Denied
        </h1>

        {/* Description */}

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/35">
          You don't have permission to access this section
          of the Robotics Club management portal.
        </p>

        {/* Actions */}

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

          <a
            href="/admin"
            className="inline-flex h-11 items-center justify-center gap-2 bg-white px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-cyan-300"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </a>

          <a
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 border border-white/[0.1] px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:border-white/20 hover:text-white"
          >
            <Home size={14} />
            Website
          </a>

        </div>

      </div>

    </main>
  );
}
