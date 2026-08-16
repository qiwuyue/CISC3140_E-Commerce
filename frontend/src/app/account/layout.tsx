import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AccountTabs from "@/components/account/AccountTabs";
import { createClient } from "@/lib/supabase/server";

type AccountLayoutProps = {
  children: ReactNode;
};

export default async function AccountLayout({
  children,
}: AccountLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          My Account
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your profile, security, and orders.
        </p>
      </header>

      <AccountTabs />

      <div className="pt-8">
        {children}
      </div>
    </main>
  );
}