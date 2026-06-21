"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function PhotoUploader({
  playerId,
}: {
  playerId: string;
}) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert("Please choose a photo first.");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${playerId}-${Date.now()}.${fileExt}`;
      const filePath = `headshots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("player-photos")
        .upload(filePath, file);

      if (uploadError) {
        alert(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from("player-photos")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("players")
        .update({
          photo_url: data.publicUrl,
        })
        .eq("id", playerId);

      if (updateError) {
        alert(updateError.message);
        setUploading(false);
        return;
      }

      alert("Photo uploaded successfully!");

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }

    setUploading(false);
  }

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-4">
        Upload Player Photo
      </h3>

      <div className="mb-4">
        <label
          htmlFor="photo-upload"
          className="inline-block cursor-pointer bg-white border-2 border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 hover:border-gray-400 transition"
        >
          📷 Choose Photo
        </label>

        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="hidden"
        />

        {file ? (
          <p className="text-sm text-gray-700 mt-2">
            Selected: {file.name}
          </p>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            No file selected
          </p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
    </div>
  );
}