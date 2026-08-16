import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import AccessDenied from "@/components/admin/AccessDenied";

import TeamAdminClient from "@/components/admin/TeamAdminClient";

export default async function AdminTeamPage() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: allowed,
    error: permissionError,
  } =
    await supabase.rpc(
      "has_permission",
      {
        perm: "manage_team",
      }
    );

  if (permissionError || !allowed) {
    return <AccessDenied />;
  }

  const {
    data: members,
    error,
  } =
    await supabase
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
        sort_order,
        is_published,
        created_at
      `)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

  return (
    <TeamAdminClient
      members={members ?? []}
      error={error?.message ?? null}
    />
  );
}
