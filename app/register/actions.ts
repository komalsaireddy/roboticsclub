"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function registerMember(
  formData: FormData
): Promise<void> {
  const supabase =
    await createSupabaseServerClient();

  /* ============================================================
     READ FORM
  ============================================================ */

  const fullName = String(
    formData.get("full_name") ?? ""
  ).trim();

  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? ""
  );

  const confirmPassword = String(
    formData.get("confirm_password") ?? ""
  );

  /* ============================================================
     VALIDATION
  ============================================================ */

  if (!fullName) {
    throw new Error(
      "Full name is required."
    );
  }

  if (!email) {
    throw new Error(
      "Email is required."
    );
  }

  if (!email.includes("@")) {
    throw new Error(
      "Please enter a valid email address."
    );
  }

  if (password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters."
    );
  }

  if (password !== confirmPassword) {
    throw new Error(
      "Passwords do not match."
    );
  }

  /* ============================================================
     CREATE SUPABASE AUTH ACCOUNT
     
     The database trigger:
     
     handle_new_member()
     
     automatically creates:
     
     profiles
     membership_requests
     
     with status = pending.
  ============================================================ */

  const {
    data,
    error,
  } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error(
      "Registration failed:",
      error
    );

    throw new Error(
      error.message
    );
  }

  if (!data.user) {
    throw new Error(
      "Unable to create your account."
    );
  }

  /* ============================================================
     IMPORTANT
     
     We intentionally DO NOT insert into:
     
     profiles
     membership_requests
     
     because handle_new_member() already does that.
  ============================================================ */

  redirect(
    "/login?registered=true"
  );
}
