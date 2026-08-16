"use client";

import {
  useState,
} from "react";

import MemberAvatarUploader from "./MemberAvatarUploader";

interface MemberProfileEditorProps {
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role_name: string;
    role_color: string;
  };

  email: string;

  updateAction: (
    formData: FormData
  ) => Promise<void>;
}

export default function MemberProfileEditor({
  profile,
  email,
  updateAction,
}: MemberProfileEditorProps) {
  const [
    avatarUrl,
    setAvatarUrl,
  ] = useState(
    profile.avatar_url ?? ""
  );

  const [
    fullName,
    setFullName,
  ] = useState(
    profile.full_name ?? ""
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    saved,
    setSaved,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    const formData =
      new FormData();

    formData.set(
      "full_name",
      fullName
    );

    formData.set(
      "avatar_url",
      avatarUrl
    );

    try {
      await updateAction(
        formData
      );

      setSaved(true);

    } catch (saveError) {
      console.error(
        "Profile update failed:",
        saveError
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save profile."
      );

    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 lg:p-8"
    >

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">

        {/* ======================================================
            PHOTO
        ====================================================== */}

        <div>

          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            Profile Photo
          </p>

          <MemberAvatarUploader
            currentImageUrl={
              profile.avatar_url
            }
            onUploaded={
              setAvatarUrl
            }
          />

        </div>

        {/* ======================================================
            DETAILS
        ====================================================== */}

        <div className="space-y-7">

          {/* NAME */}

          <div>

            <label
              htmlFor="member-full-name"
              className="mb-2 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/30"
            >
              Full Name
            </label>

            <input
              id="member-full-name"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(
                  event.target.value
                )
              }
              maxLength={100}
              required
              className="h-12 w-full border border-white/[0.1] bg-[#070707] px-4 text-[15px] text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-cyan-400/40"
            />

          </div>

          {/* EMAIL */}

          <div>

            <label
              htmlFor="member-email"
              className="mb-2 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/30"
            >
              Account
            </label>

            <input
              id="member-email"
              type="text"
              value={email}
              disabled
              className="h-12 w-full border border-white/[0.06] bg-white/[0.02] px-4 text-[15px] text-white/25 outline-none"
            />

            <p className="mt-2 text-xs text-white/20">
              Authentication information cannot be changed here.
            </p>

          </div>

          {/* ROLE */}

          <div>

            <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
              Club Role
            </label>

            <div className="flex h-12 items-center border border-white/[0.06] bg-white/[0.02] px-4">

              <span
                className="text-[15px]"
                style={{
                  color:
                    profile.role_color,
                }}
              >
                {profile.role_name}
              </span>

            </div>

            <p className="mt-2 text-xs text-white/20">
              Your role can only be changed by an authorized club administrator.
            </p>

          </div>

          {/* STATUS */}

          <div>

            <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
              Membership Status
            </label>

            <div className="flex h-12 items-center gap-3 border border-cyan-400/10 bg-cyan-400/[0.025] px-4">

              <span className="h-2 w-2 rounded-full bg-cyan-300" />

              <span className="text-[15px] text-cyan-300/80">
                Approved
              </span>

            </div>

          </div>

          {/* ERROR */}

          {error && (

            <div className="border border-red-400/20 bg-red-400/[0.04] px-4 py-3">

              <p className="text-sm leading-6 text-red-300">
                {error}
              </p>

            </div>

          )}

          {/* SAVED */}

          {saved && (

            <div className="border border-cyan-400/15 bg-cyan-400/[0.03] px-4 py-3">

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-300/70">
                ✓ Profile saved successfully
              </p>

            </div>

          )}

          {/* SAVE */}

          <div className="flex justify-end pt-2">

            <button
              type="submit"
              disabled={saving}
              className="min-w-36 bg-white px-7 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>

          </div>

        </div>

      </div>

    </form>
  );
}
