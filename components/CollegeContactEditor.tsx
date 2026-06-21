"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

type College = {
  id: string;
  name: string;
  state: string | null;
  division: string | null;
  baseball_email: string | null;
  head_coach: string | null;
  head_coach_email: string | null;
  recruiting_coordinator: string | null;
  recruiting_email: string | null;
  baseball_website: string | null;
  recruiting_form_url: string | null;
  verified_at: string | null;
};

export default function CollegeContactEditor({
  college,
  onUpdated,
}: {
  college: College;
  onUpdated: (college: College) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    baseball_email: college.baseball_email || "",
    head_coach: college.head_coach || "",
    head_coach_email: college.head_coach_email || "",
    recruiting_coordinator: college.recruiting_coordinator || "",
    recruiting_email: college.recruiting_email || "",
    baseball_website: college.baseball_website || "",
    recruiting_form_url: college.recruiting_form_url || "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveCollege = async () => {
    setSaving(true);

    const updatedData = {
      ...form,
      verified_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("colleges")
      .update(updatedData)
      .eq("id", college.id)
      .select()
      .single();

    setSaving(false);

    if (error) {
      alert("Error saving college contact info.");
      console.error(error);
      return;
    }

    onUpdated(data);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border bg-gray-50 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Head Coach"
          value={form.head_coach}
          onChange={(value) => updateField("head_coach", value)}
        />

        <Input
          label="Head Coach Email"
          value={form.head_coach_email}
          onChange={(value) => updateField("head_coach_email", value)}
        />

        <Input
          label="Recruiting Coordinator"
          value={form.recruiting_coordinator}
          onChange={(value) => updateField("recruiting_coordinator", value)}
        />

        <Input
          label="Recruiting Email"
          value={form.recruiting_email}
          onChange={(value) => updateField("recruiting_email", value)}
        />

        <Input
          label="Baseball Email"
          value={form.baseball_email}
          onChange={(value) => updateField("baseball_email", value)}
        />

        <Input
          label="Baseball Website"
          value={form.baseball_website}
          onChange={(value) => updateField("baseball_website", value)}
        />

        <Input
          label="Recruiting Form URL"
          value={form.recruiting_form_url}
          onChange={(value) => updateField("recruiting_form_url", value)}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={saveCollege}
          disabled={saving}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={() => setEditing(false)}
          className="rounded-lg bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />
    </label>
  );
}