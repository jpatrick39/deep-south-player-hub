"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { METRIC_DEFINITIONS } from "../../../lib/metricDefinitions";

export default function AddMetricForm({ playerId }: { playerId: string }) {
  const [metricKey, setMetricKey] = useState(METRIC_DEFINITIONS[0].key);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedMetric = METRIC_DEFINITIONS.find(
    (metric) => metric.key === metricKey
  );

  async function addMetric() {
    if (!value || !selectedMetric) {
      alert("Please enter a metric value.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("player_metrics").insert({
      player_id: playerId,
      metric_key: selectedMetric.key,
      metric_type: selectedMetric.label,
      value: Number(value),
      unit: selectedMetric.unit,
    });

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Could not add metric.");
      return;
    }

    window.location.reload();
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-lg font-bold text-slate-900">Add Metric</h3>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_auto]">
        <select
          value={metricKey}
          onChange={(event) => setMetricKey(event.target.value as any)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {METRIC_DEFINITIONS.map((metric) => (
            <option key={metric.key} value={metric.key}>
              {metric.category} — {metric.label}
            </option>
          ))}
        </select>

        <div className="flex overflow-hidden rounded-lg border border-slate-300 bg-white">
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Value"
            className="w-full px-3 py-2 text-sm outline-none"
          />
          <span className="flex items-center border-l border-slate-300 bg-slate-100 px-3 text-sm text-slate-500">
            {selectedMetric?.unit}
          </span>
        </div>

        <button
          onClick={addMetric}
          disabled={saving}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Metric"}
        </button>
      </div>
    </div>
  );
}