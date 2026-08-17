"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const supabase = createClient();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

  
      if (!session) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/check`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );


        if (!response.ok) {
          router.replace("/");
          return;
        }


        setAuthorized(true);
      } catch {
        router.replace("/");
      }
    }

    checkAdmin();
  }, [router]);


  if (!authorized) {
    return null;
  }

 return (
  <div>
    <nav className="border-b">
      <div className="mx-auto flex max-w-7xl gap-8 px-6">
        <Link
          href="/admin"
          className="py-4 font-medium"
        >
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className="py-4 font-medium"
        >
          Products
        </Link>

        <Link
          href="/admin/orders"
          className="py-4 font-medium"
        >
          Orders
        </Link>
      </div>
    </nav>

    {children}
  </div>
);
}