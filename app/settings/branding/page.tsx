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
  const [uploading, setUploading] = useState(false);

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
      alert("Could not load branding.");
      return;
    }

    setBranding(data);
  }

  async function uploadLogo(file: File) {
    if (!branding) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `organization-logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("organization-assets")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      alert("Logo upload failed.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("organization-assets")
      .getPublicUrl(fileName);

    setBranding({
      ...branding,
      logo_url: data.publicUrl,
    });

    setUploading(false);
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
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            Organization Branding
          </h1>
          <p className="mt-2 text-slate-600">
            Customize your organization logo, colors, website, and tagline.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5">
            <Input
              label="Organization Name"
              value={branding.name || ""}
              onChange={(value) => setBranding({ ...branding, name: value })}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Logo
              </label>

              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <div className="flex h-44 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {branding.logo_url ? (
                    <img
                      src={branding.logo_url}
                      alt={branding.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">No Logo</span>
                  )}
                </div>

                <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center hover:bg-slate-100">
                  <span className="text-4xl">☁️</span>
                  <span className="mt-2 text-sm font-semibold text-slate-800">
                    {uploading ? "Uploading..." : "Click to upload logo"}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    PNG, JPG, or WebP recommended
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={uploading}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) uploadLogo(file);
                    }}
                  />
                </label>
              </div>

              {branding.logo_url && (
                <button
                  onClick={() => setBranding({ ...branding, logo_url: "" })}
                  className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Remove Logo
                </button>
              )}
            </div>

            <Input
              label="Website"
              value={branding.website || ""}
              onChange={(value) => setBranding({ ...branding, website: value })}
            />

            <Input
              label="Tagline"
              value={branding.tagline || ""}
              onChange={(value) => setBranding({ ...branding, tagline: value })}
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

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
            <div
              className="p-6 text-white"
              style={{
                background: `linear-gradient(135deg, ${
                  branding.secondary_color || "#0f172a"
                }, ${branding.primary_color || "#dc2626"})`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                Preview
              </p>

              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
                {branding.logo_url ? (
                  <img
                    src={branding.logo_url}
                    alt={branding.name}
                    className="h-20 w-20 rounded-xl bg-white object-contain p-2"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 text-sm">
                    Logo
                  </div>
                )}

                <div>
                  <h2 className="text-3xl font-bold">{branding.name}</h2>
                  <p className="mt-1 text-white/80">
                    {branding.tagline || "Organization tagline"}
                  </p>
                  {branding.website && (
                    <p className="mt-1 text-sm text-white/70">
                      {branding.website}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={saveBranding}
            disabled={saving || uploading}
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