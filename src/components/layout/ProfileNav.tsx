"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, Settings } from "lucide-react";

const links = [
  { href: "/profile", label: "Overview", icon: Home },
  { href: "/profile/subscription", label: "Subscription", icon: CreditCard },
  { href: "/profile/settings", label: "Settings", icon: Settings },
];

export function ProfileNav() {
  const path = usePathname();

  return (
    <nav className="w-full md:w-auto overflow-hidden flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-2xl p-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = path === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-2 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              active
                ? "bg-blue-600 text-white shadow"
                : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Icon size={15} />
            <span className="sm:inline text-xs md:text-sm">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
