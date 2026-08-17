"use client";

import {
  useRef,
  useState,
} from "react";

import {
  createSupabaseBrowserClient,
} from "@/lib/supabase/client";

interface GalleryImageUploaderProps {
  currentImageUrl?: string | null;
  currentStoragePath?: string | null;

  onUploaded: (
    url: string,
    path: string
  ) => void;
}

const MAX_SIZE =
  10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function GalleryImageUploader({
  currentImageUrl,
  currentStoragePath: _currentStoragePath,
  onUploaded,
}: GalleryImageUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [
    preview,
    setPreview,
  ] = useState(
    currentImageUrl ?? ""
  );

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

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
        "Please select a JPG, PNG, WEBP or GIF image."
      );

      return;
    }

    if (
      file.size > MAX_SIZE
    ) {
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

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const uniqueName =
        `${crypto.randomUUID()}.${extension}`;

      const year =
        new Date().getFullYear();

      const storagePath =
        `gallery/${year}/${uniqueName}`;

      const {
        error:
          uploadError,
      } =
        await supabase.storage
          .from(
            "roboticsclub-media"
          )
          .upload(
            storagePath,
            file,
            {
              cacheControl:
                "31536000",

              contentType:
                file.type,

              upsert:
                false,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const {
        data:
          publicUrlData,
      } =
        supabase.storage
          .from(
            "roboticsclub-media"
          )
          .getPublicUrl(
            storagePath
          );

      const publicUrl =
        publicUrlData.publicUrl;

      if (!publicUrl) {
        throw new Error(
          "Could not generate the image URL."
        );
      }

      /*
       * Tell parent about the new
       * image.
       *
       * IMPORTANT:
       * Do not delete the old file here.
       * The server action handles cleanup
       * after Save Changes.
       */

      onUploaded(
        publicUrl,
        storagePath
      );

      setPreview(
        publicUrl
      );

      setError("");
    } catch (uploadError) {
      console.error(
        "Gallery image upload failed:",
        uploadError
      );

      setPreview(
        currentImageUrl ?? ""
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed. Please try again."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value =
          "";
      }
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    void handleFile(file);
  }

  function openFilePicker() {
    if (uploading) {
      return;
    }

    inputRef.current?.click();
  }

  return (
    <div className="space-y-4">

      <button
        type="button"
        disabled={uploading}
        onClick={
          openFilePicker
        }
        className="flex min-h-36 w-full flex-col items-center justify-center border border-dashed border-white/[0.15] bg-white/[0.02] px-6 py-8 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-4xl">
          🖼️
        </span>

        <span className="mt-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
          {uploading
            ? "Uploading..."
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
        onChange={
          handleInputChange
        }
        className="hidden"
      />

      {preview && (
        <div className="relative overflow-hidden border border-white/[0.08] bg-black">

          <img
            src={preview}
            alt="Selected gallery image"
            className="max-h-[400px] w-full object-contain"
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">

              <div className="flex flex-col items-center">

                <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />

                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                  Uploading image...
                </span>

              </div>

            </div>
          )}

        </div>
      )}

      {error && (
        <div className="border border-red-400/20 bg-red-400/[0.04] px-4 py-3">

          <div className="flex items-start gap-3">

            <span className="text-sm">
              ⚠️
            </span>

            <div>

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/60">
                Upload Error
              </p>

              <p className="mt-1 text-xs leading-5 text-red-300">
                {error}
              </p>

            </div>

          </div>

        </div>
      )}

      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
        JPG · PNG · WEBP · GIF · Maximum 10 MB
      </p>

    </div>
  );
}