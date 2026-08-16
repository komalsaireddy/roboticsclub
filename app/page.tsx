import { createSupabaseServerClient } from "@/lib/supabase/server";

import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const supabase =
    await createSupabaseServerClient();

  const [
    { data: projects, error: projectsError },
    { data: events, error: eventsError },
    { data: gallery, error: galleryError },
    { data: updates, error: updatesError },
    { data: team, error: teamError },
  ] = await Promise.all([

    supabase
      .from("projects")
      .select(`
        id,
        number,
        title,
        description,
        category,
        image_url,
        document_url,
        document_status
      `)
      .eq("is_published", true)
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("events")
      .select(`
        id,
        number,
        title,
        type,
        description,
        cover_image_url,
        rules_url,
        event_date,
        chapter,
        featured
      `)
      .eq("is_published", true)
      .order("number", {
        ascending: true,
      }),

    supabase
      .from("gallery_images")
      .select(`
        id,
        image_url,
        caption,
        alt_text,
        sort_order
      `)
      .eq("is_published", true)
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("updates")
      .select(`
        id,
        date_label,
        category,
        title,
        description,
        featured,
        created_at
      `)
      .eq("is_published", true)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("team_members")
      .select(`
        id,
        year,
        name,
        position,
        category,
        photo_url,
        linkedin_url,
        instagram_url,
        github_url,
        email,
        sort_order
      `)
      .eq("is_published", true)
      .order("sort_order", {
        ascending: true,
      }),
  ]);

  if (projectsError) {
    console.error(
      "Failed to load projects:",
      projectsError
    );
  }

  if (eventsError) {
    console.error(
      "Failed to load events:",
      eventsError
    );
  }

  if (galleryError) {
    console.error(
      "Failed to load gallery:",
      galleryError
    );
  }

  if (updatesError) {
    console.error(
      "Failed to load updates:",
      updatesError
    );
  }

  if (teamError) {
    console.error(
      "Failed to load team:",
      teamError
    );
  }

  const formattedProjects =
    (projects ?? []).map(
      (project) => ({
        id: project.id,
        number: project.number,
        title: project.title,
        description: project.description,
        category: project.category,
        image: project.image_url,
        document: project.document_url,
        status:
          project.document_status ===
          "document-missing"
            ? ("document-missing" as const)
            : ("available" as const),
      })
    );

  const formattedEvents =
    (events ?? []).map(
      (event) => ({
        id: event.id,
        number: event.number,
        title: event.title,
        type: event.type,
        description: event.description,
        image: event.cover_image_url,
        rules: event.rules_url,
        date: event.event_date,
        chapter: event.chapter,
        featured: event.featured,
      })
    );

  const formattedGallery =
    (gallery ?? []).map(
      (item) => ({
        id: item.id,
        src: item.image_url,
        alt:
          item.alt_text ??
          "Robotics Club",
        caption: item.caption,
      })
    );

  const formattedUpdates =
    (updates ?? []).map(
      (update) => ({
        id: update.id,
        date:
          update.date_label ?? "",
        category:
          update.category,
        title:
          update.title,
        description:
          update.description ?? "",
        featured:
          update.featured,
      })
    );

  const formattedTeam =
    (team ?? []).map(
      (member) => ({
        id: member.id,
        year: member.year,
        name: member.name,
        position: member.position,
        category: member.category,
        photo: member.photo_url,
        linkedin:
          member.linkedin_url,
        instagram:
          member.instagram_url,
        github:
          member.github_url,
        email:
          member.email,
      })
    );

  return (
    <HomeClient
      projects={formattedProjects}
      events={formattedEvents}
      gallery={formattedGallery}
      updates={formattedUpdates}
      team={formattedTeam}
    />
  );
}
