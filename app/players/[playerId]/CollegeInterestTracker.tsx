"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const statuses = [
  "Interested",
  "Questionnaire Submitted",
  "Camp Attended",
  "Coach Contacted",
  "Coach Responded",
  "Offer Received",
  "Committed",
];

export default function CollegeInterestTracker({
  playerId,
  interests,
  colleges,
}: {
  playerId: string;
  interests: any[];
  colleges: any[];
}) {
  const router = useRouter();

  const [collegeName, setCollegeName] = useState("");
  const [status, setStatus] = useState("Interested");
  const [notes, setNotes] = useState("");

  async function addInterest(e: React.FormEvent) {
    e.preventDefault();

    if (!collegeName) {
      alert("Please select a college.");
      return;
    }

    const { error } = await supabase.from("college_interests").insert({
      player_id: playerId,
      college_name: collegeName,
      status,
      notes,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setCollegeName("");
    setStatus("Interested");
    setNotes("");
    router.refresh();
  }

  async function updateInterest(id: string, newStatus: string, newNotes: string) {
    const { error } = await supabase
      .from("college_interests")
      .update({
        status: newStatus,
        notes: newNotes,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  async function deleteInterest(id: string) {
    const confirmed = confirm("Remove this college from the tracker?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("college_interests")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">College Interest Tracker</h2>

      <div className="bg-white border rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">College</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Notes</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {interests.map((item) => (
              <tr key={item.id} className="border-t align-top">
                <td className="p-3 font-medium">{item.college_name}</td>

                <td className="p-3">
                  <select
                    className="border p-2 rounded w-full"
                    defaultValue={item.status}
                    onChange={(e) =>
                      updateInterest(item.id, e.target.value, item.notes || "")
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>

                <td className="p-3">
                  <textarea
                    className="border p-2 rounded w-full"
                    defaultValue={item.notes || ""}
                    onBlur={(e) =>
                      updateInterest(item.id, item.status, e.target.value)
                    }
                  />
                </td>

                <td className="p-3">
                  <button
                    onClick={() => deleteInterest(item.id)}
                    className="bg-gray-800 text-white px-3 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {interests.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={4}>
                  No college interests added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={addInterest} className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-bold mb-4">Add College Interest</h3>

        <select
          className="w-full border p-3 rounded mb-3"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college.id} value={college.name}>
              {college.name} - {college.state || ""} - {college.division || ""}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-3 rounded mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <textarea
          className="w-full border p-3 rounded mb-3"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
          Add College
        </button>
      </form>
    </div>
  );
}