"use client";

import { useState } from "react";

import {
  createGalleryImage,
  deleteGalleryImage,
} from "@/app/admin/gallery/actions";

import GalleryImageUploader from "./GalleryImageUploader";
import EditGalleryImageModal from "./EditGalleryImageModal";

interface GalleryImage {
  id: string;
  image_url: string;
  storage_path: string | null;
  caption: string | null;
  alt_text: string | null;
  event_id: string | null;
  sort_order: number;
  is_published: boolean;
}

interface EventItem {
  id: string;
  number: string | null;
  title: string;
}

interface Props {
  gallery: GalleryImage[];
  events: EventItem[];
  galleryError: string | null;
}

export default function GalleryAdminClient({
  gallery,
  events,
  galleryError,
}: Props) {
  const [editing, setEditing] =
    useState<GalleryImage | null>(null);

  const [addImageUrl, setAddImageUrl] =
    useState("");

  const [addStoragePath, setAddStoragePath] =
    useState("");

  return (
    <main className="min-h-screen bg-[#030303] text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-10">

          <div className="flex items-center gap-4">

            <a
              href="/admin"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/[0.12]"
            >
              <img
                src="/robotics-club-logo.jpg"
                alt="Robotics Club GCET"
                className="h-full w-full object-cover"
              />
            </a>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
                Robotics Club
              </p>

              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                Gallery / Management
              </p>
            </div>

          </div>

          <a
            href="/admin"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 transition-colors hover:text-cyan-300"
          >
            ← Dashboard
          </a>

        </div>
      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10 lg:py-14">

        {/* TITLE */}

        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
              Content Management
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Gallery
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
              Manage images displayed in
              the Robotics Club gallery.
            </p>

          </div>

          <a
            href="#add-gallery-image"
            className="inline-flex h-11 items-center justify-center border border-white/[0.1] bg-white px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300"
          >
            + Add Image
          </a>

        </div>

        {/* ERROR */}

        {galleryError && (
          <div className="mb-8 border border-red-400/20 bg-red-400/[0.04] p-4">

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-300/60">
              Gallery Database Error
            </p>

            <p className="mt-2 text-sm text-red-300">
              {galleryError}
            </p>

          </div>
        )}

        {/* ====================================================
            GALLERY LIST
        ==================================================== */}

        <section className="border-t border-white/[0.08]">

          {gallery.length === 0 ? (

            <div className="border-b border-white/[0.08] py-20 text-center">

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                Gallery empty
              </p>

              <p className="mt-3 text-sm text-white/30">
                Add your first image below.
              </p>

            </div>

          ) : (

            gallery.map((image) => (

              <article
                key={image.id}
                className="border-b border-white/[0.08] py-7"
              >

                <div className="grid gap-6 lg:grid-cols-[150px_1fr_220px_auto] lg:items-center lg:gap-8">

                  {/* IMAGE */}

                  <div className="aspect-video overflow-hidden border border-white/[0.08] bg-[#050505]">

                    <img
                      src={image.image_url}
                      alt={
                        image.alt_text ??
                        image.caption ??
                        "Gallery image"
                      }
                      className="h-full w-full object-cover"
                    />

                  </div>

                  {/* INFO */}

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-400/60">
                        #{image.sort_order}
                      </span>

                      {image.is_published ? (

                        <span className="border border-cyan-400/20 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-cyan-300/60">
                          Published
                        </span>

                      ) : (

                        <span className="border border-white/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/25">
                          Draft
                        </span>

                      )}

                    </div>

                    <h2 className="mt-2 text-lg font-medium text-white/80">
                      {image.caption ||
                        "Untitled image"}
                    </h2>

                    <p className="mt-2 break-all text-xs leading-5 text-white/25">
                      {image.image_url}
                    </p>

                  </div>

                  {/* META */}

                  <div className="space-y-3">

                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                        Alt Text
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-white/35">
                        {image.alt_text ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                        Event
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {image.event_id
                          ? events.find(
                              (event) =>
                                event.id ===
                                image.event_id
                            )?.title ??
                            "Unknown event"
                          : "No event"}
                      </p>
                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2 lg:justify-end">

                    <button
                      type="button"
                      onClick={() =>
                        setEditing(image)
                      }
                      className="inline-flex items-center gap-2 border border-white/[0.1] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-300"
                    >
                      ✎ Edit
                    </button>

                    <form
                      action={
                        deleteGalleryImage
                      }
                      onSubmit={(event) => {
                        if (
                          !window.confirm(
                            "Delete this image permanently?"
                          )
                        ) {
                          event.preventDefault();
                        }
                      }}
                    >

                      <input
                        type="hidden"
                        name="id"
                        value={image.id}
                      />

                      <button
                        type="submit"
                        className="border border-red-400/10 px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/40 transition-all hover:border-red-400/30 hover:bg-red-400/[0.04] hover:text-red-300"
                      >
                        Delete
                      </button>

                    </form>

                  </div>

                </div>

              </article>

            ))

          )}

        </section>

        {/* ====================================================
            ADD IMAGE
        ==================================================== */}

        <section
          id="add-gallery-image"
          className="mt-16 border border-white/[0.08] bg-white/[0.015]"
        >

          <div className="border-b border-white/[0.07] px-6 py-5">

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
              New Gallery Image
            </p>

            <h2 className="mt-2 text-xl font-medium text-white/80">
              Add image
            </h2>

          </div>

          <form
            action={createGalleryImage}
            className="grid gap-5 p-6 md:grid-cols-2"
          >

            {/* IMAGE */}

            <div className="md:col-span-2">

              <label className="mb-3 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Image
              </label>

              <GalleryImageUploader
                onUploaded={(
                  url,
                  path
                ) => {
                  setAddImageUrl(url);
                  setAddStoragePath(path);
                }}
              />

              <input
                type="hidden"
                name="image_url"
                value={addImageUrl}
              />

              <input
                type="hidden"
                name="storage_path"
                value={addStoragePath}
              />

            </div>

            {/* SORT */}

            <Field
              label="Sort Order"
              name="sort_order"
              defaultValue="0"
              type="number"
            />

            {/* ALT */}

            <Field
              label="Alt Text"
              name="alt_text"
              placeholder="Describe the image"
            />

            {/* EVENT */}

            <div>

              <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Event
              </label>

              <select
                name="event_id"
                defaultValue=""
                className="h-11 w-full border border-white/[0.1] bg-[#070707] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
              >

                <option value="">
                  No event
                </option>

                {events.map(
                  (event) => (
                    <option
                      key={event.id}
                      value={event.id}
                    >
                      {event.number
                        ? `${event.number} — `
                        : ""}
                      {event.title}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* CAPTION */}

            <div className="md:col-span-2">

              <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Caption
              </label>

              <textarea
                name="caption"
                rows={4}
                placeholder="Gallery caption..."
                className="w-full resize-y border border-white/[0.1] bg-[#070707] px-3 py-3 text-sm leading-6 text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
              />

            </div>

            {/* PUBLISHED */}

            <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

              <input
                type="checkbox"
                name="is_published"
                defaultChecked
                className="h-4 w-4 accent-cyan-400"
              />

              Publish immediately

            </label>

            {/* CREATE */}

            <div className="flex justify-end">

              <button
                type="submit"
                disabled={!addImageUrl}
                className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Add Image
              </button>

            </div>

          </form>

        </section>

      </div>

      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {editing && (
        <EditGalleryImageModal
          image={editing}
          events={events}
          onClose={() =>
            setEditing(null)
          }
        />
      )}

    </main>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full border border-white/[0.1] bg-[#070707] px-3 text-sm text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
      />

    </div>
  );
}