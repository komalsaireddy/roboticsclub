"use client";

import {
  useRef,
  useState,
} from "react";

import {
  createSupabaseBrowserClient,
} from "@/lib/supabase/client";

interface MemberAvatarUploaderProps {
  currentImageUrl?: string | null;
  onUploaded: (url: string) => void;
}

const MAX_SIZE =
  10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function MemberAvatarUploader({
  currentImageUrl,
  onUploaded,
}: MemberAvatarUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [preview, setPreview] =
    useState(
      currentImageUrl ?? ""
    );

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleFile(
    file: File
  ) {
    setError("");

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      setError(
        "Please select JPG, PNG, WEBP or GIF."
      );
      return;
    }

    if (file.size > MAX_SIZE) {
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
      const supabase =
        createSupabaseBrowserClient();

      const {
        data: {
          user,
        },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "You must be logged in."
        );
      }

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const storagePath =
        `members/${user.id}/${fileName}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("roboticsclub-media")
          .upload(
            storagePath,
            file,
            {
              cacheControl:
                "31536000",
              contentType:
                file.type,
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

      setPreview(
        data.publicUrl
      );

      onUploaded(
        data.publicUrl
      );

    } catch (uploadError) {
      console.error(
        "Member image upload failed:",
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

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (file) {
      void handleFile(file);
    }
  }

  return (
    <div className="space-y-4">

      <button
        type="button"
        disabled={uploading}
        onClick={() =>
          inputRef.current?.click()
        }
        className="group relative flex h-32 w-32 overflow-hidden rounded-full border border-dashed border-white/[0.15] bg-white/[0.02] transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
      >

        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">

            <span className="text-3xl">
              🖼️
            </span>

            <span className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-white/40">
              Add Photo
            </span>

          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm">

            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />

          </div>
        )}

      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
          JPG · PNG · WEBP · GIF
        </p>

        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-white/15">
          Maximum 10 MB
        </p>
      </div>

      {error && (
        <div className="max-w-xs border border-red-400/20 bg-red-400/[0.04] px-4 py-3">

          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/60">
            Upload Error
          </p>

          <p className="mt-1 text-xs leading-5 text-red-300">
            {error}
          </p>

        </div>
      )}

    </div>
  );
}
