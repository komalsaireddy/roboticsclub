"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateMemberProfile(
  formData: FormData
): Promise<void> {
  const supabase =
    await createSupabaseServerClient();

  /* ============================================================
     AUTHENTICATION
  ============================================================ */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "You must be logged in."
    );
  }

  /* ============================================================
     INPUT
  ============================================================ */

  const fullName = String(
    formData.get("full_name") ?? ""
  ).trim();

  const avatarUrl = String(
    formData.get("avatar_url") ?? ""
  ).trim();

  if (!fullName) {
    throw new Error(
      "Full name is required."
    );
  }

  if (fullName.length > 100) {
    throw new Error(
      "Full name is too long."
    );
  }

  /* ============================================================
     UPDATE ONLY THE CURRENT USER
  ============================================================ */

  const {
    error,
  } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      avatar_url:
        avatarUrl || null,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath("/member");
}
