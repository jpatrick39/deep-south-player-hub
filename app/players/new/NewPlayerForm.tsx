"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function NewPlayerForm() {
  const router = useRouter();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    school: "",
    grad_year: "",
    primary_position: "",
    bats: "",
    throws: "",
    email: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let photoUrl = "";

    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `headshots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("player-photos")
        .upload(filePath, photoFile);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("player-photos")
        .getPublicUrl(filePath);

      photoUrl = data.publicUrl;
    }

    const { error } = await supabase.from("players").insert({
      name: form.name,
      school: form.school,
      grad_year: form.grad_year ? Number(form.grad_year) : null,
      primary_position: form.primary_position,
      bats: form.bats,
      throws: form.throws,
      email: form.email,
      photo_url: photoUrl,
      is_public: true,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/players");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        ["name", "Player Name"],
        ["school", "School"],
        ["grad_year", "Grad Year"],
        ["primary_position", "Primary Position"],
        ["bats", "Bats"],
        ["throws", "Throws"],
        ["email", "Email"],
      ].map(([key, label]) => (
        <input
          key={key}
          className="w-full border p-3 rounded"
          placeholder={label}
          value={(form as any)[key]}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ))}

      <div>
        <label className="block font-semibold mb-2">
          Player Photo
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPhotoFile(e.target.files?.[0] || null)
          }
          className="w-full border p-3 rounded bg-white"
        />
      </div>

      <button className="bg-red-600 text-white px-6 py-3 rounded-lg">
        Save Player
      </button>
    </form>
  );
}