"use client";

import { useRef, useState } from "react";

import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/app/admin/team/actions";

interface TeamMember {
  id: string;
  year: string;
  name: string;
  position: string;
  category: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
  email: string | null;
  sort_order: number | null;
  is_published: boolean | null;
}

interface TeamAdminClientProps {
  members: TeamMember[];
  error?: string | null;
}

export default function TeamAdminClient({
  members,
  error,
}: TeamAdminClientProps) {
  const [showCreate, setShowCreate] =
    useState(false);

  return (
    <main className="min-h-screen bg-[#030303] text-white">

      {/* HEADER */}

      <header className="border-b border-white/[0.08]">

        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-10">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/[0.12]">

              <img
                src="/robotics-club-logo.jpg"
                alt="Robotics Club GCET"
                className="h-full w-full object-cover"
              />

            </div>

            <div>

              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
                Robotics Club
              </p>

              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                Team / Management
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

      {/* CONTENT */}

      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10 lg:py-12">

        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/60">
              People
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
              Team
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Add and manage Robotics Club team members.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreate((value) => !value)
            }
            className="bg-white px-6 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-cyan-300"
          >
            {showCreate
              ? "Close"
              : "+ Add Team Member"}
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 border border-red-400/20 bg-red-400/[0.04] px-5 py-4">

            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/60">
              Error
            </p>

            <p className="mt-1 text-sm text-red-300">
              {error}
            </p>

          </div>
        )}

        {/* CREATE */}

        {showCreate && (
          <section className="mb-8 border border-white/[0.08]">

            <div className="border-b border-white/[0.08] px-6 py-5">

              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
                New Member
              </p>

              <h2 className="mt-2 text-xl font-medium text-white/85">
                Add Team Member
              </h2>

            </div>

            <CreateTeamMember />

          </section>
        )}

        {/* MEMBERS */}

        <section className="border border-white/[0.08]">

          <div className="border-b border-white/[0.08] px-6 py-5">

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
              {members.length}{" "}
              {members.length === 1
                ? "Member"
                : "Members"}
            </p>

          </div>

          <div className="divide-y divide-white/[0.06]">

            {members.length === 0 ? (

              <div className="p-12 text-center">

                <p className="text-sm text-white/30">
                  No team members yet.
                </p>

                <p className="mt-2 text-xs text-white/15">
                  Add your first team member above.
                </p>

              </div>

            ) : (

              members.map((member) => (
                <TeamMemberEditor
                  key={member.id}
                  member={member}
                />
              ))

            )}

          </div>

        </section>

      </div>

    </main>
  );
}

/* ============================================================
   CREATE MEMBER
============================================================ */

function CreateTeamMember() {
  const [photoUrl, setPhotoUrl] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  return (
    <form
      action={createTeamMember}
      className="space-y-6 p-6"
    >

      <input
        type="hidden"
        name="photo_url"
        value={photoUrl}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

        <TeamImageUploader
          currentImageUrl=""
          uploading={uploading}
          setUploading={setUploading}
          onUploaded={setPhotoUrl}
        />

        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Name"
            name="name"
            placeholder="Full name"
            required
          />

          <Field
            label="Position"
            name="position"
            placeholder="Technical Lead"
            required
          />

          <Field
            label="Year"
            name="year"
            placeholder="2026"
            required
          />

          <Field
            label="Category"
            name="category"
            defaultValue="student"
          />

          <Field
            label="LinkedIn URL"
            name="linkedin_url"
            placeholder="https://linkedin.com/in/..."
          />

          <Field
            label="Instagram URL"
            name="instagram_url"
            placeholder="https://instagram.com/..."
          />

          <Field
            label="GitHub URL"
            name="github_url"
            placeholder="https://github.com/..."
          />

          <Field
            label="Email"
            name="email"
            type="email"
          />

          <Field
            label="Display Order"
            name="sort_order"
            type="number"
            defaultValue="0"
          />

          <label className="flex h-11 items-center gap-3 self-end font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

            <input
              type="checkbox"
              name="is_published"
              defaultChecked
              className="h-4 w-4 accent-cyan-400"
            />

            Published

          </label>

        </div>

      </div>

      <div className="flex justify-end border-t border-white/[0.08] pt-5">

        <button
          type="submit"
          disabled={uploading}
          className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black hover:bg-cyan-300 disabled:opacity-40"
        >
          Create Member
        </button>

      </div>

    </form>
  );
}

/* ============================================================
   EDIT MEMBER
============================================================ */

function TeamMemberEditor({
  member,
}: {
  member: TeamMember;
}) {
  const [photoUrl, setPhotoUrl] =
    useState(member.photo_url ?? "");

  const [uploading, setUploading] =
    useState(false);

  return (
    <div className="p-6">

      {/* UPDATE FORM */}

      <form
        action={updateTeamMember}
        className="space-y-6"
      >

        <input
          type="hidden"
          name="id"
          value={member.id}
        />

        <input
          type="hidden"
          name="photo_url"
          value={photoUrl}
        />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

          <TeamImageUploader
            currentImageUrl={
              member.photo_url
            }
            uploading={uploading}
            setUploading={setUploading}
            onUploaded={setPhotoUrl}
          />

          <div className="grid gap-5 md:grid-cols-2">

            <Field
              label="Name"
              name="name"
              defaultValue={member.name}
              required
            />

            <Field
              label="Position"
              name="position"
              defaultValue={member.position}
              required
            />

            <Field
              label="Year"
              name="year"
              defaultValue={member.year}
              required
            />

            <Field
              label="Category"
              name="category"
              defaultValue={
                member.category ?? "student"
              }
            />

            <Field
              label="LinkedIn URL"
              name="linkedin_url"
              defaultValue={
                member.linkedin_url ?? ""
              }
            />

            <Field
              label="Instagram URL"
              name="instagram_url"
              defaultValue={
                member.instagram_url ?? ""
              }
            />

            <Field
              label="GitHub URL"
              name="github_url"
              defaultValue={
                member.github_url ?? ""
              }
            />

            <Field
              label="Email"
              name="email"
              type="email"
              defaultValue={
                member.email ?? ""
              }
            />

            <Field
              label="Display Order"
              name="sort_order"
              type="number"
              defaultValue={String(
                member.sort_order ?? 0
              )}
            />

            <label className="flex h-11 items-center gap-3 self-end font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

              <input
                type="checkbox"
                name="is_published"
                defaultChecked={
                  member.is_published ?? true
                }
                className="h-4 w-4 accent-cyan-400"
              />

              Published

            </label>

          </div>

        </div>

        <div className="flex items-center justify-end border-t border-white/[0.08] pt-5">

          <button
            type="submit"
            disabled={uploading}
            className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black hover:bg-cyan-300 disabled:opacity-40"
          >
            Save Changes
          </button>

        </div>

      </form>

      {/* DELETE IS A SEPARATE FORM */}

      <div className="mt-4 flex justify-end">

        <form action={deleteTeamMember}>

          <input
            type="hidden"
            name="id"
            value={member.id}
          />

          <button
            type="submit"
            className="border border-red-400/20 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/60 hover:border-red-400/40 hover:text-red-300"
          >
            Delete Member
          </button>

        </form>

      </div>

    </div>
  );
}

/* ============================================================
   IMAGE UPLOADER
============================================================ */

function TeamImageUploader({
  currentImageUrl,
  onUploaded,
  uploading,
  setUploading,
}: {
  currentImageUrl?: string | null;
  onUploaded: (url: string) => void;
  uploading: boolean;
  setUploading: (value: boolean) => void;
}) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [preview, setPreview] =
    useState(currentImageUrl ?? "");

  const [error, setError] =
    useState("");

  async function handleFile(file: File) {
    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select JPG, PNG, WEBP or GIF."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Image must be smaller than 10 MB."
      );
      return;
    }

    const localPreview =
      URL.createObjectURL(file);

    setPreview(localPreview);
    setUploading(true);

    try {
      const {
        createSupabaseBrowserClient,
      } = await import(
        "@/lib/supabase/client"
      );

      const supabase =
        createSupabaseBrowserClient();

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const storagePath =
        `team/${new Date().getFullYear()}/${fileName}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("roboticsclub-media")
          .upload(
            storagePath,
            file,
            {
              cacheControl: "31536000",
              contentType: file.type,
              upsert: false,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const {
        data,
      } =
        supabase.storage
          .from("roboticsclub-media")
          .getPublicUrl(
            storagePath
          );

      if (!data.publicUrl) {
        throw new Error(
          "Could not generate image URL."
        );
      }

      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);

    } catch (uploadError) {

      console.error(
        "Team image upload failed:",
        uploadError
      );

      setPreview(
        currentImageUrl ?? ""
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed."
      );

    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-4">

      <label className="mb-3 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        Member Photo
      </label>

      <button
        type="button"
        disabled={uploading}
        onClick={() =>
          inputRef.current?.click()
        }
        className="flex min-h-36 w-full flex-col items-center justify-center border border-dashed border-white/[0.15] bg-white/[0.02] px-6 py-8 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/[0.03] disabled:opacity-50"
      >

        <span className="text-4xl">
          🖼️
        </span>

        <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
          {uploading
            ? "Uploading..."
            : preview
              ? "Replace Photo"
              : "Choose Photo"}
        </span>

        <span className="mt-2 text-xs text-white/25">
          Photos / Gallery / Files
        </span>

      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(event) => {

          const file =
            event.target.files?.[0];

          if (file) {
            void handleFile(file);
          }

        }}
        className="hidden"
      />

      {preview && (
        <div className="relative overflow-hidden border border-white/[0.08] bg-black">

          <img
            src={preview}
            alt="Team member preview"
            className="h-72 w-full object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">

              <div className="flex flex-col items-center">

                <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />

                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                  Uploading...
                </span>

              </div>

            </div>
          )}

        </div>
      )}

      {error && (
        <div className="border border-red-400/20 bg-red-400/[0.04] px-4 py-3">

          <p className="text-xs text-red-300">
            {error}
          </p>

        </div>
      )}

      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
        JPG · PNG · WEBP · GIF · Maximum 10 MB
      </p>

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
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
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
