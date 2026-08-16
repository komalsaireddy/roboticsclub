"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import type { TeamMember } from "@/lib/data/team";

interface TeamSectionProps {
  team: TeamMember[];
}

export default function TeamSection({
  team,
}: TeamSectionProps) {
  return (
    <section
      id="team"
      className="relative border-t border-white/[0.06] px-5 py-28 sm:px-8 lg:px-12"
    >

      <div className="mx-auto max-w-7xl">

        <div className="mb-14">

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
            The People
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Our Team
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/35">
            Meet the students building, designing and leading
            the Robotics Club at GCET.
          </p>

        </div>

        {team.length === 0 ? (
          <div className="border border-white/[0.08] p-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
              Team profiles coming soon
            </p>
          </div>
        ) : (

          <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {team.map((member, index) => (

              <motion.article
                key={member.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-60px",
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.04,
                }}
                className="group bg-[#050505]"
              >

                <div className="aspect-[4/5] overflow-hidden bg-white/[0.025]">

                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/15">
                        Photo
                      </span>
                    </div>
                  )}

                </div>

                <div className="p-5">

                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-400/50">
                    {member.category ?? "Student"}
                  </p>

                  <h3 className="mt-3 text-lg font-medium text-white/85">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm text-white/35">
                    {member.position}
                  </p>

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:text-cyan-300"
                    >
                      LinkedIn
                      <ArrowUpRight size={13} />
                    </a>
                  )}

                </div>

              </motion.article>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}
