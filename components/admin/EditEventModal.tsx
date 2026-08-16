"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  updateEvent,
} from "@/app/admin/events/actions";

import EventImageUploader from "@/components/admin/EventImageUploader";

interface Event {
  id: string;
  number: string | null;
  title: string;
  type: string | null;
  description: string | null;
  cover_image_url: string | null;
  cover_storage_path: string | null;
  rules_url: string | null;
  register_url: string | null;
  event_date: string | null;
  event_end_date: string | null;
  chapter: string | null;
  featured: boolean;
  is_published: boolean;
}

interface Props {
  event?: Event | null;
}

export default function EditEventModal({
  event,
}: Props) {
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!event) {
    return null;
  }

  useEffect(() => {
    if (!dirty) {
      return;
    }

    function handleBeforeUnload(
      e: BeforeUnloadEvent
    ) {
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [dirty]);

  function closeModal() {
    if (saving) {
      return;
    }

    if (dirty) {
      const confirmed =
        window.confirm(
          "You have unsaved changes.\n\nAre you sure you want to discard them?"
        );

      if (!confirmed) {
        return;
      }
    }

    window.location.href =
      "/admin/events";
  }

  function handleBackdrop(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (
      e.target ===
      e.currentTarget
    ) {
      closeModal();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-md"
      onMouseDown={handleBackdrop}
    >

      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-white/[0.1] bg-[#070707] shadow-2xl"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#070707] px-6 py-5">

          <div>

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
              Edit Event
            </p>

            <h2 className="mt-1 text-lg font-medium text-white/85">
              {event.title}
            </h2>

          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center border border-white/[0.1] text-lg text-white/40 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            ×
          </button>

        </div>

        <form
          action={updateEvent}
          onChange={() => setDirty(true)}
          onSubmit={() => {
            setSaving(true);
            setDirty(false);
          }}
          className="grid gap-5 p-6 md:grid-cols-2"
        >

          <input
            type="hidden"
            name="id"
            value={event.id}
          />

          <input
            type="hidden"
            name="old_cover_storage_path"
            value={event.cover_storage_path ?? ""}
          />

          <Field
            label="Number"
            name="number"
            defaultValue={event.number ?? ""}
          />

          <Field
            label="Title"
            name="title"
            defaultValue={event.title}
            required
          />

          <Field
            label="Type"
            name="type"
            defaultValue={event.type ?? ""}
          />

          <Field
            label="Chapter"
            name="chapter"
            defaultValue={event.chapter ?? ""}
          />

          <DateField
            label="Event Date"
            name="event_date"
            defaultValue={event.event_date ?? ""}
          />

          <DateField
            label="End Date"
            name="event_end_date"
            defaultValue={event.event_end_date ?? ""}
          />

          <div className="md:col-span-2">

            <label className="mb-3 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              Cover Image
            </label>

            <EventImageUploader
              inputName="cover_image_url"
              pathInputName="cover_storage_path"
              currentImageUrl={event.cover_image_url}
              currentStoragePath={event.cover_storage_path}
            />

          </div>

          <Field
            label="Registration URL"
            name="register_url"
            defaultValue={event.register_url ?? ""}
          />

          <Field
            label="Rules URL"
            name="rules_url"
            defaultValue={event.rules_url ?? ""}
          />

          <div className="md:col-span-2">

            <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              Description
            </label>

            <textarea
              name="description"
              defaultValue={event.description ?? ""}
              rows={7}
              className="w-full resize-y border border-white/[0.1] bg-[#050505] px-3 py-3 text-sm leading-6 text-white/70 outline-none focus:border-cyan-400/40"
            />

          </div>

          <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

            <input
              type="checkbox"
              name="featured"
              defaultChecked={event.featured}
              className="h-4 w-4 accent-cyan-400"
            />

            Featured event

          </label>

          <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

            <input
              type="checkbox"
              name="is_published"
              defaultChecked={event.is_published}
              className="h-4 w-4 accent-cyan-400"
            />

            Published on website

          </label>

          <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] pt-5 md:col-span-2">

            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="border border-white/[0.1] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 hover:border-white/20 hover:text-white/70 disabled:opacity-30"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full border border-white/[0.1] bg-[#070707] px-3 text-sm text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
      />

    </div>
  );
}

function DateField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div>

      <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        type="date"
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full border border-white/[0.1] bg-[#070707] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
      />

    </div>
  );
}