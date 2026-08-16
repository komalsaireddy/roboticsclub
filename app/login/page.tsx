"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowUpRight,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const supabase =
      createSupabaseBrowserClient();

    /* ============================================================
       LOGIN
    ============================================================ */

    const {
      error: loginError,
    } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError) {
      setError(
        "Invalid email or password."
      );

      setLoading(false);
      return;
    }

    /* ============================================================
       CHECK ACCOUNT STATUS
    ============================================================ */

    try {
      const response =
        await fetch(
          "/auth/login-status",
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const result =
        await response.json();

      /* ==========================================================
         STATUS API ERROR
      ========================================================== */

      if (!response.ok) {
        await supabase.auth.signOut();

        setError(
          "Unable to verify your account status. Please try again."
        );

        setLoading(false);
        return;
      }

      /* ==========================================================
         PENDING
      ========================================================== */

      if (
        result.status ===
        "pending"
      ) {
        await supabase.auth.signOut();

        setError(
          "Your membership request is still pending approval. Please wait for a Robotics Club administrator to approve your account."
        );

        setLoading(false);
        return;
      }

      /* ==========================================================
         REJECTED
      ========================================================== */

      if (
        result.status ===
        "rejected"
      ) {
        await supabase.auth.signOut();

        setError(
          "Your membership request was not approved. Please contact the Robotics Club administration."
        );

        setLoading(false);
        return;
      }

      /* ==========================================================
         APPROVED
      ========================================================== */

      if (
        result.status ===
          "approved" &&
        result.destination
      ) {
        router.push(
          result.destination
        );

        router.refresh();

        return;
      }

      /* ==========================================================
         UNKNOWN / NO ACCESS
      ========================================================== */

      await supabase.auth.signOut();

      setError(
        "Your account does not currently have club access."
      );

      setLoading(false);

    } catch (statusError) {
      console.error(
        "Login status check failed:",
        statusError
      );

      await supabase.auth.signOut();

      setError(
        "Unable to verify your account. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030303] px-6 text-white">

      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      </div>

      {/* ============================================================
          CONTAINER
      ============================================================ */}

      <div className="relative z-10 w-full max-w-md">

        {/* ========================================================
            LOGO
        ======================================================== */}

        <div className="mb-10 flex flex-col items-center">

          <div className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.025]">

            <img
              src="/robotics-club-logo.jpg"
              alt="Robotics Club GCET"
              className="h-full w-full object-cover"
            />

          </div>

          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-cyan-400/70">
            Robotics Club
          </p>

          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
            GCET / MEMBER ACCESS
          </p>

        </div>

        {/* ========================================================
            CARD
        ======================================================== */}

        <div className="border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl sm:p-9">

          <div className="mb-8">

            <h1 className="text-3xl font-medium tracking-[-0.03em] text-white">
              Sign in
            </h1>

            <p className="mt-3 text-[16px] leading-7 text-white/40">
              Access your Robotics Club account.
            </p>

          </div>

          {/* ======================================================
              FORM
          ====================================================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/35"
              >
                Email
              </label>

              <div className="relative">

                <Mail
                  size={16}
                  strokeWidth={1.3}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="h-13 w-full border border-white/[0.09] bg-black/30 pl-11 pr-4 text-[16px] text-white outline-none transition-colors placeholder:text-white/20 focus:border-cyan-400/40"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/35"
              >
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={16}
                  strokeWidth={1.3}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="••••••••"
                  className="h-13 w-full border border-white/[0.09] bg-black/30 pl-11 pr-4 text-[16px] text-white outline-none transition-colors placeholder:text-white/20 focus:border-cyan-400/40"
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (

              <div className="border border-red-400/20 bg-red-400/[0.04] px-4 py-4 text-[14px] leading-6 text-red-300/80">
                {error}
              </div>

            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-13 w-full items-center justify-center gap-3 bg-white font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (

                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Checking access
                </>

              ) : (

                <>
                  Sign in

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </>

              )}

            </button>

          </form>

        </div>

        {/* ========================================================
            REGISTER
        ======================================================== */}

        <p className="mt-7 text-center text-[15px] text-white/30">

          Don't have an account?{" "}

          <a
            href="/register"
            className="text-cyan-300/70 transition-colors hover:text-cyan-200"
          >
            Register
          </a>

        </p>

        {/* ========================================================
            BACK
        ======================================================== */}

        <div className="mt-5 text-center">

          <a
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-cyan-300"
          >
            ← Back to website
          </a>

        </div>

      </div>

    </main>
  );
}