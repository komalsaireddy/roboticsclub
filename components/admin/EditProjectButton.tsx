"use client";

import { Pencil } from "lucide-react";

interface EditProjectButtonProps {
  targetId: string;
}

export default function EditProjectButton({
  targetId,
}: EditProjectButtonProps) {
  function handleEdit() {
    const details = document.getElementById(
      targetId
    ) as HTMLDetailsElement | null;

    if (!details) {
      console.error(`Edit form not found: ${targetId}`);
      return;
    }

    details.open = true;

    requestAnimationFrame(() => {
      details.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleEdit}
      className="inline-flex items-center gap-2 border border-white/[0.1] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-300"
    >
      <Pencil size={13} strokeWidth={1.4} />
      Edit
    </button>
  );
}
