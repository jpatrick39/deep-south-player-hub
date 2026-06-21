"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import CollegeContactEditor from "@/components/CollegeContactEditor";

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

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      alert("Error loading colleges.");
    } else {
      setColleges(data || []);
    }

    setLoading(false);
  };

  const updateCollegeInList = (updatedCollege: College) => {
    setColleges((prev) =>
      prev.map((college) =>
        college.id === updatedCollege.id ? updatedCollege : college
      )
    );
  };

  if (loading) {
    return <div className="p-6">Loading colleges...</div>;
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">College Database</h1>
        <p className="text-gray-600">
          Manage baseball contacts, coach emails, recruiting links, and verified
          college information.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">School</th>
              <th className="p-3">State</th>
              <th className="p-3">Division</th>
              <th className="p-3">Head Coach</th>
              <th className="p-3">Recruiting Email</th>
              <th className="p-3">Website</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Manage</th>
            </tr>
          </thead>

          <tbody>
            {colleges.map((college) => (
              <tr key={college.id} className="border-t align-top">
                <td className="p-3 font-medium">{college.name}</td>
                <td className="p-3">{college.state || "-"}</td>
                <td className="p-3">{college.division || "-"}</td>
                <td className="p-3">{college.head_coach || "-"}</td>
                <td className="p-3">
                  {college.recruiting_email ? (
                    <a
                      href={`mailto:${college.recruiting_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {college.recruiting_email}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3">
                  {college.baseball_website ? (
                    <a
                      href={college.baseball_website}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3">
                  {college.verified_at
                    ? new Date(college.verified_at).toLocaleDateString()
                    : "Not verified"}
                </td>
                <td className="p-3 min-w-[360px]">
                  <CollegeContactEditor
                    college={college}
                    onUpdated={updateCollegeInList}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}