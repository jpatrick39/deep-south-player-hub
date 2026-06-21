"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const gradYears = Array.from({ length: 14 }, (_, i) => String(2027 + i));

const teams = [
  "9U",
  "10U",
  "11U",
  "12U",
  "13U",
  "14U",
  "15U",
  "16U",
  "17U",
  "18U",
  "High School Showcase",
];

const positions = [
  "RHP",
  "LHP",
  "Catcher",
  "1B",
  "2B",
  "SS",
  "3B",
  "LF",
  "CF",
  "RF",
  "OF",
  "Utility",
];

const secondaryPositions = ["None", ...positions];

const heights = [
  "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"",
  "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"",
  "6'6\"", "6'7\"", "6'8\"",
];

const weights = Array.from({ length: 49 }, (_, i) => String(60 + i * 5));
const gpas = Array.from({ length: 21 }, (_, i) => (4.0 - i * 0.1).toFixed(1));

export default function EditPlayerForm({ player }: { player: any }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: player.name || "",
    school: player.school || "",
    email: player.email || "",
    team: player.team || "",
    grad_year: player.grad_year ? String(player.grad_year) : "",
    primary_position: player.primary_position || "",
    secondary_position: player.secondary_position || "None",
    height: player.height || "",
    weight: player.weight || "",
    bats: player.bats || "",
    throws: player.throws || "",
    gpa: player.gpa || "",
    bio: player.bio || "",
  });

  function updateField(key: string, value: string) {
    setForm({ ...form, [key]: value });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("players")
      .update({
        name: form.name,
        school: form.school,
        email: form.email,
        team: form.team,
        grad_year: form.grad_year ? Number(form.grad_year) : null,
        primary_position: form.primary_position,
        secondary_position:
          form.secondary_position === "None" ? "" : form.secondary_position,
        height: form.height,
        weight: form.weight,
        bats: form.bats,
        throws: form.throws,
        gpa: form.gpa,
        bio: form.bio,
      })
      .eq("id", player.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Player updated!");
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="mt-8 border rounded-lg p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Edit Player Info</h2>

      <input className="w-full border p-3 rounded mb-3" placeholder="Player Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
      <input className="w-full border p-3 rounded mb-3" placeholder="School" value={form.school} onChange={(e) => updateField("school", e.target.value)} />
      <input className="w-full border p-3 rounded mb-3" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />

      <select className="w-full border p-3 rounded mb-3" value={form.team} onChange={(e) => updateField("team", e.target.value)}>
        <option value="">Team</option>
        {teams.map((team) => <option key={team} value={team}>{team}</option>)}
      </select>

      <select className="w-full border p-3 rounded mb-3" value={form.grad_year} onChange={(e) => updateField("grad_year", e.target.value)}>
        <option value="">Grad Year</option>
        {gradYears.map((year) => <option key={year} value={year}>{year}</option>)}
      </select>

      <select className="w-full border p-3 rounded mb-3" value={form.primary_position} onChange={(e) => updateField("primary_position", e.target.value)}>
        <option value="">Primary Position</option>
        {positions.map((position) => <option key={position} value={position}>{position}</option>)}
      </select>

      <select className="w-full border p-3 rounded mb-3" value={form.secondary_position} onChange={(e) => updateField("secondary_position", e.target.value)}>
        {secondaryPositions.map((position) => <option key={position} value={position}>{position}</option>)}
      </select>

      <select className="w-full border p-3 rounded mb-3" value={form.height} onChange={(e) => updateField("height", e.target.value)}>
        <option value="">Height</option>
        {heights.map((height) => <option key={height} value={height}>{height}</option>)}
      </select>

      <select className="w-full border p-3 rounded mb-3" value={form.weight} onChange={(e) => updateField("weight", e.target.value)}>
        <option value="">Weight</option>
        {weights.map((weight) => <option key={weight} value={weight}>{weight} lbs</option>)}
      </select>

      <select className="w-full border p-3 rounded mb-3" value={form.bats} onChange={(e) => updateField("bats", e.target.value)}>
        <option value="">Bats</option>
        <option value="Right">Right</option>
        <option value="Left">Left</option>
        <option value="Switch">Switch</option>
      </select>

      <select className="w-full border p-3 rounded mb-3" value={form.throws} onChange={(e) => updateField("throws", e.target.value)}>
        <option value="">Throws</option>
        <option value="Right">Right</option>
        <option value="Left">Left</option>
      </select>

      <select className="w-full border p-3 rounded mb-3" value={form.gpa} onChange={(e) => updateField("gpa", e.target.value)}>
        <option value="">GPA</option>
        {gpas.map((gpa) => <option key={gpa} value={gpa}>{gpa}</option>)}
      </select>

      <textarea className="w-full border p-3 rounded mb-3" rows={6} placeholder="Player Bio" value={form.bio} onChange={(e) => updateField("bio", e.target.value)} />

      <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
        Save Changes
      </button>
    </form>
  );
}