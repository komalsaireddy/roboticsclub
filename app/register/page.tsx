import Link from "next/link";

import { registerMember } from "./actions";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white">

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-16">

        <div className="w-full max-w-xl">

          {/* ========================================================
              BRAND
          ======================================================== */}

          <div className="mb-10 flex items-center gap-4">

            <Link
              href="/"
              className="group flex h-12 w-12 overflow-hidden rounded-full border border-white/[0.12] transition-colors hover:border-cyan-300/40"
            >
              <img
                src="/robotics-club-logo.jpg"
                alt="Robotics Club GCET"
                className="h-full w-full object-cover"
              />
            </Link>

            <div>

              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-white/80">
                Robotics Club
              </p>

              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
                GCET / Membership
              </p>

            </div>

          </div>

          {/* ========================================================
              HEADER
          ======================================================== */}

          <div className="mb-8">

            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300/70">
              Club Access
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Register
            </h1>

            <p className="mt-4 text-[17px] leading-8 text-white/50">
              Create your Robotics Club account.
              Your membership request will be reviewed
              by an authorized club administrator.
            </p>

          </div>

          {/* ========================================================
              REGISTRATION FORM
          ======================================================== */}

          <form
            action={registerMember}
            className="border border-white/[0.08] bg-white/[0.015] p-6 sm:p-8"
          >

            <div className="space-y-6">

              <Field
                label="Full Name"
                name="full_name"
                type="text"
                placeholder="Your full name"
                required
              />

              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />

              <Field
                label="Password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                required
              />

              <Field
                label="Confirm Password"
                name="confirm_password"
                type="password"
                placeholder="Repeat your password"
                required
              />

            </div>

            {/* ======================================================
                APPROVAL NOTICE
            ====================================================== */}

            <div className="mt-8 border border-cyan-300/10 bg-cyan-300/[0.025] p-4">

              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300/70">
                Approval Required
              </p>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Creating an account does not immediately
                grant club access. Your membership request
                must be approved by an authorized Robotics
                Club administrator.
              </p>

            </div>

            {/* ======================================================
                SUBMIT
            ====================================================== */}

            <button
              type="submit"
              className="mt-7 flex h-12 w-full items-center justify-center bg-white font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-cyan-300"
            >
              Submit Registration
            </button>

          </form>

          {/* ========================================================
              LOGIN
          ======================================================== */}

          <p className="mt-6 text-center text-sm text-white/30">

            Already have an account?{" "}

            <Link
              href="/login"
              className="text-cyan-300/70 transition-colors hover:text-cyan-200"
            >
              Login
            </Link>

          </p>

          {/* ========================================================
              HOME
          ======================================================== */}

          <div className="mt-5 text-center">

            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/20 transition-colors hover:text-white/50"
            >
              ← Back to website
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

/* ================================================================
   FIELD
================================================================ */

function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/35"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full border border-white/[0.1] bg-[#070707] px-4 text-[16px] text-white/80 outline-none placeholder:text-white/15 focus:border-cyan-400/50"
      />

    </div>
  );
}