"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  updateGalleryImage,
} from "@/app/admin/gallery/actions";

import GalleryImageUploader from "./GalleryImageUploader";

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

interface EventOption {
  id: string;
  number: string | null;
  title: string;
}

interface EditGalleryImageModalProps {
  image: GalleryImage;
  events: EventOption[];
  onClose: () => void;
}

export default function EditGalleryImageModal({
  image,
  events,
  onClose,
}: EditGalleryImageModalProps) {
  const [dirty, setDirty] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [imageUrl, setImageUrl] =
    useState(image.image_url);

  const [storagePath, setStoragePath] =
    useState("");

  const formRef =
    useRef<HTMLFormElement>(null);

  /* ==========================================================
     BROWSER CLOSE / REFRESH WARNING
  ========================================================== */

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const handleBeforeUnload = (
      event: BeforeUnloadEvent
    ) => {
      event.preventDefault();
      event.returnValue = "";
    };

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

  /* ==========================================================
     CLOSE
  ========================================================== */

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

    onClose();
  }

  /* ==========================================================
     BACKDROP
  ========================================================== */

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (
      event.target ===
      event.currentTarget
    ) {
      closeModal();
    }
  }

  /* ==========================================================
     FORM CHANGE
  ========================================================== */

  function handleFormChange() {
    if (!dirty) {
      setDirty(true);
    }
  }

  /* ==========================================================
     IMAGE UPLOAD
  ========================================================== */

  function handleImageUploaded(
    url: string,
    path: string
  ) {
    setImageUrl(url);
    setStoragePath(path);
    setDirty(true);
  }

  /* ==========================================================
     SUBMIT
  ========================================================== */

  function handleSubmit() {
    setSaving(true);
    setDirty(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-md"
      onMouseDown={
        handleBackdropClick
      }
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-white/[0.1] bg-[#070707] shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#070707] px-6 py-5">

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
              Edit Gallery Image
            </p>

            <h2 className="mt-1 text-lg font-medium text-white/85">
              {image.caption ||
                "Gallery Image"}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center border border-white/[0.1] text-lg text-white/40 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Close"
          >
            ×
          </button>

        </div>

        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          ref={formRef}
          action={updateGalleryImage}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          className="grid gap-6 p-6"
        >

          <input
            type="hidden"
            name="id"
            value={image.id}
          />

          <input
            type="hidden"
            name="image_url"
            value={imageUrl}
          />

          <input
            type="hidden"
            name="storage_path"
            value={storagePath}
          />

          <input
            type="hidden"
            name="old_storage_path"
            value={
              image.storage_path ??
              ""
            }
          />

          {/* ==================================================
              IMAGE
          ================================================== */}

          <div>
            <label className="mb-3 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              Image
            </label>

            <GalleryImageUploader
              currentImageUrl={
                image.image_url
              }
              currentStoragePath={
                image.storage_path
              }
              onUploaded={
                handleImageUploaded
              }
            />
          </div>

          {/* ==================================================
              DETAILS
          ================================================== */}

          <div className="grid gap-5 md:grid-cols-2">

            <Field
              label="Caption"
              name="caption"
              defaultValue={
                image.caption ?? ""
              }
              placeholder="Gallery caption..."
            />

            <Field
              label="Alt Text"
              name="alt_text"
              defaultValue={
                image.alt_text ?? ""
              }
              placeholder="Describe the image"
            />

            <Field
              label="Sort Order"
              name="sort_order"
              defaultValue={String(
                image.sort_order
              )}
              type="number"
            />

            {/* EVENT */}

            <div>
              <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Event
              </label>

              <select
                name="event_id"
                defaultValue={
                  image.event_id ?? ""
                }
                className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
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

          </div>

          {/* ==================================================
              PREVIEW
          ================================================== */}

          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              Preview
            </p>

            <div className="overflow-hidden border border-white/[0.08] bg-black">
              <img
                src={imageUrl}
                alt={
                  image.alt_text ??
                  "Gallery preview"
                }
                className="max-h-[350px] w-full object-contain"
              />
            </div>
          </div>

          {/* ==================================================
              PUBLISHED
          ================================================== */}

          <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

            <input
              type="checkbox"
              name="is_published"
              defaultChecked={
                image.is_published
              }
              className="h-4 w-4 accent-cyan-400"
            />

            Published on website

          </label>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] pt-5">

            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="border border-white/[0.1] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 transition-all hover:border-white/20 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                !imageUrl
              }
              className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
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
        defaultValue={
          defaultValue
        }
        placeholder={
          placeholder
        }
        required={required}
        className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
      />
    </div>
  );
}