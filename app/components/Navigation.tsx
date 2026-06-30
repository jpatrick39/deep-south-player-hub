"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/players", label: "Players" },
  { href: "/teams", label: "Teams" },
  { href: "/recruiting", label: "Recruiting" },
  { href: "/settings/branding", label: "Branding" },
  { href: "/colleges", label: "Colleges" },
  { href: "/colleges/import", label: "Import Colleges" },
  { href: "/colleges/verify", label: "Verify Contacts" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-red-400"
        >
          Deep South Player Hub
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}