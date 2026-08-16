"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData) {
    const currentPassword = String(
        formData.get("currentPassword") ?? "",
    );

    const newPassword = String(
        formData.get("newPassword") ?? "",
    );

    const confirmPassword = String(
        formData.get("confirmPassword") ?? "",
    );

    if (!currentPassword || !newPassword || !confirmPassword) {
        redirect(
            "/account/security?error=All password fields are required",
        );
    }

    if (newPassword.length < 8) {
        redirect(
            "/account/security?error=New password must be at least 8 characters",
        );
    }

    if (newPassword !== confirmPassword) {
        redirect(
            "/account/security?error=New passwords do not match",
        );
    }

    if (currentPassword === newPassword) {
        redirect(
            "/account/security?error=New password must be different",
        );
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        redirect("/login");
    }

    const { error: verificationError } =
        await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        });

    if (verificationError) {
        redirect(
            "/account/security?error=Current password is incorrect",
        );
    }

    const { error: updateError } =
        await supabase.auth.updateUser({
            password: newPassword,
        });

    if (updateError) {
        redirect(
            `/account/security?error=${encodeURIComponent(
                updateError.message,
            )}`,
        );
    }

    redirect(
        "/account/security?success=Password updated successfully",
    );
}