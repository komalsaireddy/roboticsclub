"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  updateProject,
} from "@/app/admin/projects/actions";

import ProjectImageUploader from "@/components/admin/ProjectImageUploader";

interface Project {
  id: string;
  number: string | null;
  title: string;
  description: string | null;
  category: string | null;

  image_url: string | null;
  image_storage_path: string | null;

  document_url: string | null;
  document_status: string | null;
  is_published: boolean;
}

interface EditProjectModalProps {
  project: Project;
}

export default function EditProjectModal({
  project,
}: EditProjectModalProps) {
  const [
    dirty,
    setDirty,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploadedImageUrl,
    setUploadedImageUrl,
  ] = useState(
    project.image_url ?? ""
  );

  const [
    uploadedStoragePath,
    setUploadedStoragePath,
  ] = useState(
    project.image_storage_path ?? ""
  );

  /* ==========================================================
     UNSAVED CHANGES
  ========================================================== */

  useEffect(() => {
    if (!dirty) {
      return;
    }

    function handleBeforeUnload(
      event: BeforeUnloadEvent
    ) {
      event.preventDefault();
      event.returnValue = "";
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

    window.location.href =
      "/admin/projects";
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
    setDirty(true);
  }

  /* ==========================================================
     IMAGE UPLOAD
  ========================================================== */

  function handleImageUploaded(
    url: string,
    path: string
  ) {
    setUploadedImageUrl(
      url
    );

    setUploadedStoragePath(
      path
    );

    setDirty(true);
  }

  /* ==========================================================
     SUBMIT
  ========================================================== */

  function handleSubmit() {
    setSaving(true);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-md"
      onMouseDown={
        handleBackdropClick
      }
    >

      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-white/[0.1] bg-[#070707] shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#070707] px-6 py-5">

          <div>

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
              Edit Project
            </p>

            <h2 className="mt-1 text-lg font-medium text-white/85">
              {project.title}
            </h2>

          </div>

          <button
            type="button"
            onClick={
              closeModal
            }
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center border border-white/[0.1] text-lg text-white/40 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Close"
          >
            ×
          </button>

        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          action={
            updateProject
          }
          onChange={
            handleFormChange
          }
          onSubmit={
            handleSubmit
          }
          className="grid gap-5 p-6 md:grid-cols-2"
        >

          <input
            type="hidden"
            name="id"
            value={project.id}
          />

          <input
            type="hidden"
            name="old_image_storage_path"
            value={
              project.image_storage_path ??
              ""
            }
          />

          <input
            type="hidden"
            name="image_url"
            value={
              uploadedImageUrl
            }
          />

          <input
            type="hidden"
            name="image_storage_path"
            value={
              uploadedStoragePath
            }
          />

          {/* NUMBER */}

          <Field
            label="Number"
            name="number"
            defaultValue={
              project.number ?? ""
            }
          />

          {/* TITLE */}

          <Field
            label="Title"
            name="title"
            defaultValue={
              project.title
            }
            required
          />

          {/* CATEGORY */}

          <Field
            label="Category"
            name="category"
            defaultValue={
              project.category ?? ""
            }
          />

          {/* ==================================================
              IMAGE
          ================================================== */}

          <div className="md:col-span-2">

            <label className="mb-3 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              Project Image
            </label>

            <ProjectImageUploader
              currentImageUrl={
                project.image_url
              }
              onUploaded={
                handleImageUploaded
              }
            />

          </div>

          {/* DOCUMENT */}

          <Field
            label="Documentation URL"
            name="document_url"
            defaultValue={
              project.document_url ??
              ""
            }
          />

          {/* DOCUMENT STATUS */}

          <div>

            <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              Document Status
            </label>

            <select
              name="document_status"
              defaultValue={
                project.document_status ??
                "available"
              }
              className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
            >

              <option value="available">
                Available
              </option>

              <option value="document-missing">
                Document Missing
              </option>

            </select>

          </div>

          {/* DESCRIPTION */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              Description
            </label>

            <textarea
              name="description"
              defaultValue={
                project.description ??
                ""
              }
              rows={7}
              className="w-full resize-y border border-white/[0.1] bg-[#050505] px-3 py-3 text-sm leading-6 text-white/70 outline-none focus:border-cyan-400/40"
            />

          </div>

          {/* PUBLISHED */}

          <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

            <input
              type="checkbox"
              name="is_published"
              defaultChecked={
                project.is_published
              }
              className="h-4 w-4 accent-cyan-400"
            />

            Published on website

          </label>

          {/* ACTIONS */}

          <div className="flex items-center justify-end gap-3">

            <button
              type="button"
              onClick={
                closeModal
              }
              disabled={saving}
              className="border border-white/[0.1] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:border-white/20 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving
              }
              className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
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
        defaultValue={
          defaultValue
        }
        placeholder={
          placeholder
        }
        required={
          required
        }
        className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
      />

    </div>
  );
}