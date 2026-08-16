import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/action";
import { UserRound } from "lucide-react";

export default async function AuthControls() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <UserRound
              aria-hidden="true"
              className="size-5"
            />

            <span>Login</span>
          </Link>

    );
  }

  return (
    <div className="flex items-center gap-4">
     <UserRound
              aria-hidden="true"
              className="size-5"/>
      <Link
        href="/account"
        className="max-w-40 truncate text-sm font-medium text-slate-700 transition hover:text-blue-600"
      >
        {user.email}
      </Link>

      <form action={logout}>
        <button
          type="submit"
          className="text-sm font-medium text-slate-600 transition hover:text-red-600"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}