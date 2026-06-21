"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Player = {
  id: string;
  name: string;
  team?: string | null;
  grad_year?: string | number | null;
  position?: string | null;
  bio?: string | null;
};

type College = {
  id: string;
  name: string;
  recruiting_email: string | null;
  head_coach_email: string | null;
  baseball_email: string | null;
  recruiting_form_url: string | null;
};

export default function SendPlayerProfileButton({ player }: { player: Player }) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    const { data, error } = await supabase
      .from("colleges")
      .select(
        "id, name, recruiting_email, head_coach_email, baseball_email, recruiting_form_url"
      )
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setColleges(data || []);
  };

  const selectedCollege = colleges.find(
    (college) => college.id === selectedCollegeId
  );

  const emailOptions = selectedCollege
    ? [
        selectedCollege.recruiting_email,
        selectedCollege.head_coach_email,
        selectedCollege.baseball_email,
      ].filter(Boolean)
    : [];

  const sendProfile = () => {
    if (!selectedCollege || !selectedEmail) {
      alert("Please select a college and email.");
      return;
    }

    const profileUrl = `${window.location.origin}/players/${player.id}`;

    const subject = `Recruiting Profile: ${player.name}`;

    const body = `
Coach,

I wanted to share the recruiting profile for ${player.name} with you.

Player: ${player.name}
Team: ${player.team || "Deep South Baseball"}
Graduation Year: ${player.grad_year || ""}
Position: ${player.position || ""}

Profile Link:
${profileUrl}

Player Bio:
${player.bio || ""}

${selectedCollege.recruiting_form_url ? `Recruiting Form:\n${selectedCollege.recruiting_form_url}` : ""}

Thank you,

Deep South Baseball
`.trim();

    window.location.href = `mailto:${selectedEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Send Profile to College</h2>
      <p className="mb-4 text-sm text-gray-600">
        Select a college and open a pre-filled recruiting email.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          value={selectedCollegeId}
          onChange={(e) => {
            setSelectedCollegeId(e.target.value);
            setSelectedEmail("");
          }}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Select college</option>
          {colleges.map((college) => (
            <option key={college.id} value={college.id}>
              {college.name}
            </option>
          ))}
        </select>

        <select
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
          disabled={!selectedCollege}
        >
          <option value="">Select email</option>
          {emailOptions.map((email) => (
            <option key={email} value={email || ""}>
              {email}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={sendProfile}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Open Recruiting Email
      </button>
    </div>
  );
}
