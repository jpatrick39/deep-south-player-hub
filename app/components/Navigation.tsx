"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Branding = {
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
};

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/players", label: "Players" },
  { href: "/teams", label: "Teams" },
  { href: "/recruiting", label: "Recruiting" },
  { href: "/colleges", label: "Colleges" },
  { href: "/colleges/import", label: "Import Colleges" },
  { href: "/colleges/verify", label: "Verify Contacts" },
  { href: "/settings/branding", label: "Branding" },
];

export default function Navigation() {
  const pathname = usePathname();

  const [branding, setBranding] = useState<Branding>({
    name: "Deep South Player Hub",
    logo_url: null,
    primary_color: "#dc2626",
    secondary_color: "#020617",
  });

  useEffect(() => {
    async function loadBranding() {
      const { data } = await supabase
        .from("organization_settings")
        .select("name, logo_url, primary_color, secondary_color")
        .limit(1)
        .single();

      if (data) {
        setBranding(data);
      }
    }

    loadBranding();
  }, []);

  return (
    <header
      className="border-b text-white"
      style={{
        backgroundColor: branding.secondary_color || "#020617",
        borderColor: branding.primary_color || "#dc2626",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <Link href="/" className="flex items-center gap-3">
          {branding.logo_url ? (
            <img
              src={branding.logo_url}
              alt={branding.name}
              className="h-10 w-10 rounded-lg bg-white object-contain p-1"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-xs font-bold">
              DS
            </div>
          )}

          <span className="text-lg font-bold tracking-tight">
            {branding.name}
          </span>
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
                className="rounded-lg px-3 py-2 text-sm font-medium transition"
                style={{
                  backgroundColor: isActive
                    ? branding.primary_color || "#dc2626"
                    : "transparent",
                  color: "white",
                }}
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