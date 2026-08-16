import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Profile information
      </h2>

      <div className="mt-6 space-y-5">
        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">
            Email
          </p>

          <p className="mt-1 text-slate-900">
            {user.email}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">
            User ID
          </p>

          <p className="mt-1 break-all font-mono text-sm text-slate-900">
            {user.id}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">
            Account created
          </p>

          <p className="mt-1 text-slate-900">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </section>
  );
}