"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(
    formData.get("confirmPassword") ?? "",
  );

  if (!email) {
    redirect("/signup?error=Email is required");
  }

  if (password.length < 8) {
    redirect(
      "/signup?error=Password must be at least 8 characters",
    );
  }

  if (password !== confirmPassword) {
    redirect("/signup?error=Passwords do not match");
  }

  const supabase = await createClient();
  

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(
      `/signup?error=${encodeURIComponent(error.message)}`,
    );
  }


  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  redirect(
    "/signup?message=Check your email to confirm your account",
  );


}