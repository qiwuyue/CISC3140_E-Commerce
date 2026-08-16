"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    name: "Profile",
    href: "/account/profile",
  },
  {
    name: "Security",
    href: "/account/security",
  },
  {
    name: "Orders",
    href: "/account/orders",
  },
];

export default function AccountTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex gap-1 border-b border-slate-200">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-5 py-3 text-sm font-semibold transition ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}