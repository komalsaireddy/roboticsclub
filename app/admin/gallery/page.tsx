import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import AccessDenied from "@/components/admin/AccessDenied";
import GalleryAdminClient from "@/components/admin/GalleryAdminClient";

interface PageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export default async function AdminGalleryPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const supabase =
    await createSupabaseServerClient();

  /* ==========================================================
     AUTHENTICATION
  ========================================================== */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /* ==========================================================
     PERMISSION
  ========================================================== */

  const {
    data: allowed,
    error: permissionError,
  } = await supabase.rpc(
    "has_permission",
    {
      perm: "manage_gallery",
    }
  );

  if (
    permissionError ||
    !allowed
  ) {
    return <AccessDenied />;
  }

  /* ==========================================================
     LOAD GALLERY
  ========================================================== */

  const {
    data: gallery,
    error: galleryError,
  } = await supabase
    .from("gallery_images")
    .select(`
      id,
      image_url,
      storage_path,
      caption,
      alt_text,
      event_id,
      sort_order,
      is_published,
      created_at,
      updated_at
    `)
    .order(
      "sort_order",
      {
        ascending: true,
      }
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  /* ==========================================================
     LOAD EVENTS
  ========================================================== */

  const {
    data: events,
  } = await supabase
    .from("events")
    .select(
      "id, number, title"
    )
    .order(
      "event_date",
      {
        ascending: false,
        nullsFirst: false,
      }
    );

  /* ==========================================================
     SAFE ARRAYS
  ========================================================== */

  const galleryList =
    gallery ?? [];

  const eventList =
    events ?? [];

  /* ==========================================================
     RETURN
  ========================================================== */

  return (
    <GalleryAdminClient
      gallery={galleryList}
      events={eventList}
      galleryError={
        galleryError?.message ??
        null
      }
    />
  );
}