"use client";

import { useState } from "react";

import { deleteEvent } from "@/app/admin/events/actions";

interface DeleteEventButtonProps {
  eventId: string;
}

export default function DeleteEventButton({
  eventId,
}: DeleteEventButtonProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this event permanently?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const formData = new FormData();

      formData.append("id", eventId);

      await deleteEvent(formData);
    } catch (error) {
      console.error(
        "Delete event failed:",
        error
      );

      setDeleting(false);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete event."
      );
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="border border-red-400/10 px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/40 transition-all hover:border-red-400/30 hover:bg-red-400/[0.04] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
