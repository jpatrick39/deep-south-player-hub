"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

type CollegeImportRow = {
  name: string;
  state?: string;
  division?: string;
  baseball_email?: string;
  head_coach?: string;
  head_coach_email?: string;
  recruiting_coordinator?: string;
  recruiting_email?: string;
  baseball_website?: string;
  recruiting_form_url?: string;
  verified_at?: string;
};

export default function CollegeImportPage() {
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  function parseCsv(text: string): CollegeImportRow[] {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || null;
      });

      return row;
    });
  }

  async function importColleges() {
    setImporting(true);
    setMessage("");

    const rows = parseCsv(csvText).filter((row) => row.name);

    const { error } = await supabase.from("colleges").upsert(rows, {
      onConflict: "name,state",
    });

    setImporting(false);

    if (error) {
      console.error(error);
      setMessage("Import failed. Check console for details.");
      return;
    }

    setMessage(`Imported ${rows.length} colleges successfully.`);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-4xl font-bold">College Import Tool</h1>
        <p className="mt-2 text-gray-600">
          Paste CSV college data below to add or update schools.
        </p>

        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="mt-6 h-96 w-full rounded-lg border p-4 font-mono text-sm"
          placeholder="name,state,division,baseball_email,head_coach,head_coach_email,recruiting_coordinator,recruiting_email,baseball_website,recruiting_form_url,verified_at"
        />

        <button
          onClick={importColleges}
          disabled={importing || !csvText.trim()}
          className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {importing ? "Importing..." : "Import Colleges"}
        </button>

        {message && <p className="mt-4 font-medium">{message}</p>}
      </div>
    </main>
  );
}