"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Branding = {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  website: string | null;
  tagline: string | null;
};

export default function BrandingSettingsPage() {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBranding();
  }, []);

  async function loadBranding() {
    const { data, error } = await supabase
      .from("organization_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error(error);
      alert("Could not load organization branding.");
      return;
    }

    setBranding(data);
  }

  async function saveBranding() {
    if (!branding) return;

    setSaving(true);

    const { error } = await supabase
      .from("organization_settings")
      .update({
        name: branding.name,
        logo_url: branding.logo_url,
        primary_color: branding.primary_color,
        secondary_color: branding.secondary_color,
        website: branding.website,
        tagline: branding.tagline,
        updated_at: new Date().toISOString(),
      })
      .eq("id", branding.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Could not save branding.");
      return;
    }

    alert("Branding saved.");
  }

  if (!branding) {
    return <main className="p-8">Loading branding...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            Organization Branding
          </h1>
          <p className="mt-2 text-slate-600">
            Customize the platform name, colors, logo, website, and tagline.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <Input
              label="Organization Name"
              value={branding.name || ""}
              onChange={(value) =>
                setBranding({ ...branding, name: value })
              }
            />

            <Input
              label="Logo URL"
              value={branding.logo_url || ""}
              onChange={(value) =>
                setBranding({ ...branding, logo_url: value })
              }
            />

            <Input
              label="Website"
              value={branding.website || ""}
              onChange={(value) =>
                setBranding({ ...branding, website: value })
              }
            />

            <Input
              label="Tagline"
              value={branding.tagline || ""}
              onChange={(value) =>
                setBranding({ ...branding, tagline: value })
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Primary Color"
                type="color"
                value={branding.primary_color || "#dc2626"}
                onChange={(value) =>
                  setBranding({ ...branding, primary_color: value })
                }
              />

              <Input
                label="Secondary Color"
                type="color"
                value={branding.secondary_color || "#0f172a"}
                onChange={(value) =>
                  setBranding({ ...branding, secondary_color: value })
                }
              />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 overflow-hidden">
            <div
              className="p-6 text-white"
              style={{
                background: `linear-gradient(135deg, ${
                  branding.secondary_color || "#0f172a"
                }, ${branding.primary_color || "#dc2626"})`,
              }}
            >
              <p className="text-sm uppercase tracking-wide text-white/80">
                Preview
              </p>

              <div className="mt-4 flex items-center gap-4">
                {branding.logo_url ? (
                  <img
                    src={branding.logo_url}
                    alt={branding.name}
                    className="h-16 w-16 rounded-xl bg-white object-contain p-2"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-sm">
                    Logo
                  </div>
                )}

                <div>
                  <h2 className="text-3xl font-bold">{branding.name}</h2>
                  <p className="text-white/80">
                    {branding.tagline || "Organization tagline"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={saveBranding}
            disabled={saving}
            className="mt-6 rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Branding"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  );
}