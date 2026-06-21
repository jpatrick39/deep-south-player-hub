"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AddMetricForm({
  playerId,
}: {
  playerId: string;
}) {
  const router = useRouter();

  const [metricType, setMetricType] = useState("Exit Velocity");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("mph");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("player_metrics")
      .insert({
        player_id: playerId,
        metric_type: metricType,
        value: Number(value),
        unit,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setValue("");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 bg-gray-50 mt-6"
    >
      <h3 className="font-bold mb-4">Add Metric</h3>

      <select
        value={metricType}
        onChange={(e) => setMetricType(e.target.value)}
        className="w-full border p-3 rounded mb-3"
      >
        <option>Exit Velocity</option>
        <option>Bat Speed</option>
        <option>60 Yard Dash</option>
        <option>Pop Time</option>
        <option>Pitch Velocity</option>
        <option>Infield Velocity</option>
        <option>Outfield Velocity</option>
      </select>

      <input
        type="number"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border p-3 rounded mb-3"
      />

      <input
        placeholder="Unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="w-full border p-3 rounded mb-3"
      />

      <button className="bg-red-600 text-white px-4 py-2 rounded">
        Add Metric
      </button>
    </form>
  );
}