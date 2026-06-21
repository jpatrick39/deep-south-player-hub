"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function VideoUploader({
  playerId,
  fieldName,
  label,
}: {
  playerId: string;
  fieldName:
    | "recruiting_video_url"
    | "hitting_video_url"
    | "fielding_video_url"
    | "pitching_video_url";
  label: string;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert("Please choose a video first.");
      return;
    }

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${playerId}-${fieldName}-${Date.now()}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("player-videos")
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("player-videos")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("players")
      .update({
        [fieldName]: data.publicUrl,
      })
      .eq("id", playerId);

    if (updateError) {
      alert(updateError.message);
      setUploading(false);
      return;
    }

    alert("Video uploaded successfully!");
    setUploading(false);
    router.refresh();
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-3">{label}</h3>

      <label className="inline-block cursor-pointer bg-white border-2 border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 hover:border-gray-400 transition">
        🎥 Choose Video
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>

      {file ? (
        <p className="text-sm text-gray-700 mt-2">Selected: {file.name}</p>
      ) : (
        <p className="text-sm text-gray-500 mt-2">No file selected</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
}