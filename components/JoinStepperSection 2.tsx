"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, ShieldCheck, Sparkles, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "REGISTER ACCOUNT",
    subtitle: "Submit Membership Request",
    description: "Fill out the registration form with your name, email, and password. Your access request is immediately logged for administrator review.",
    badge: "Step 1",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "ADMIN VERIFICATION",
    subtitle: "Verification & Role Assignment",
    description: "A Robotics Club administrator verifies your college credentials within 24-48 hours and assigns your initial Member role.",
    badge: "Step 2",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "WELCOME ORIENTATION",
    subtitle: "Access Member Portal",
    description: "Sign in to access your personal Member Portal. Complete your member profile, upload your avatar, and get introduced to team channels.",
    badge: "Step 3",
  },
  {
    number: "04",
    icon: Rocket,
    title: "BUILD & COMPETE",
    subtitle: "Join Projects & Competitions",
    description: "Join active project teams, participate in flagship competitions like Robotica, access lab equipment, and pitch your own project ideas.",
    badge: "Step 4",
  },
];

export default function JoinStepperSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative z-10 overflow-hidden border-t border-white/[0.06] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mb-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-cyan-400/70">
                MEMBERSHIP GUIDE
              </span>
              <span className="h-px w-10 bg-cyan-400/40" />
            </div>

            <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              How To Join The Club
            </h2>
          </div>

          <p className="max-w-md font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            Four simple steps to unlock hardware, workshops & competitions
          </p>
        </div>

        {/* Stepper Tabs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;

            return (
              <motion.div
                key={step.number}
                onClick={() => setActiveStep(index)}
                whileHover={{ y: -4 }}
                className={`cursor-pointer border p-6 transition-all duration-300 ${
                  isActive
                    ? "border-cyan-400/60 bg-cyan-400/[0.04] shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                    : "border-white/[0.08] bg-white/[0.015] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${isActive ? "text-cyan-300" : "text-white/30"}`}>
                    {step.badge}
                  </span>

                  <Icon size={20} className={isActive ? "text-cyan-300" : "text-white/30"} />
                </div>

                <p className="mt-8 font-mono text-2xl font-bold tracking-tight text-white">
                  {step.number}
                </p>

                <h3 className="mt-2 text-lg font-medium text-white/90">
                  {step.title}
                </h3>

                <p className="mt-1 font-mono text-[11px] text-white/40">
                  {step.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Step Detail Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 border border-white/[0.1] bg-white/[0.02] p-8 sm:p-10"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                {steps[activeStep].badge} Detail
              </span>

              <h4 className="mt-2 text-2xl font-medium text-white">
                {steps[activeStep].title} — {steps[activeStep].subtitle}
              </h4>

              <p className="mt-4 text-[15px] leading-8 text-white/60">
                {steps[activeStep].description}
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-cyan-400 px-7 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300"
            >
              <span>Get Started</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
