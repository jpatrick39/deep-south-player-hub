"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

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
  verified_at: string | null;
};

type FilterStatus = "all" | "verified" | "needs-review";

export default function CollegeVerificationPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState<FilterStatus>("needs-review");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadColleges();
  }, []);

  async function loadColleges() {
    setLoading(true);

    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .order("state", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      alert("Could not load colleges.");
      setLoading(false);
      return;
    }

    setColleges(data || []);
    setLoading(false);
  }

  const states = useMemo(() => {
    return Array.from(
      new Set(
        colleges
          .map((college) => college.state)
          .filter((state): state is string => Boolean(state))
      )
    ).sort();
  }, [colleges]);

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      const matchesState =
        stateFilter === "all" || college.state === stateFilter;

      const hasContact =
        Boolean(college.baseball_email) ||
        Boolean(college.head_coach_email) ||
        Boolean(college.recruiting_email);

      const isVerified = Boolean(college.verified_at);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "verified"
          ? isVerified
          : !isVerified || !hasContact;

      return matchesState && matchesStatus;
    });
  }, [colleges, stateFilter, statusFilter]);

  async function markVerified(college: College) {
    setSavingId(college.id);

    const { data, error } = await supabase
      .from("colleges")
      .update({
        verified_at: new Date().toISOString(),
      })
      .eq("id", college.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Could not mark this college as verified.");
      setSavingId(null);
      return;
    }

    setColleges((current) =>
      current.map((item) => (item.id === college.id ? data : item))
    );

    setSavingId(null);
  }

  async function clearVerification(college: College) {
    setSavingId(college.id);

    const { data, error } = await supabase
      .from("colleges")
      .update({
        verified_at: null,
      })
      .eq("id", college.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Could not reset verification.");
      setSavingId(null);
      return;
    }

    setColleges((current) =>
      current.map((item) => (item.id === college.id ? data : item))
    );

    setSavingId(null);
  }

  if (loading) {
    return <main className="p-8">Loading contact verification queue...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">College Contact Verification</h1>
          <p className="mt-2 text-gray-600">
            Review recruiting contacts before using them in player outreach.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow md:flex-row md:items-center">
          <select
            value={stateFilter}
            onChange={(event) => setStateFilter(event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="all">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as FilterStatus)
            }
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="needs-review">Needs Review</option>
            <option value="verified">Verified</option>
            <option value="all">All Colleges</option>
          </select>

          <p className="text-sm text-gray-500">
            Showing {filteredColleges.length} college
            {filteredColleges.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-left text-white">
                <th className="p-3">School</th>
                <th className="p-3">State</th>
                <th className="p-3">Division</th>
                <th className="p-3">Head Coach</th>
                <th className="p-3">Recruiting Contact</th>
                <th className="p-3">Email</th>
                <th className="p-3">Official Site</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredColleges.map((college) => {
                const bestEmail =
                  college.recruiting_email ||
                  college.head_coach_email ||
                  college.baseball_email ||
                  "";

                const isVerified = Boolean(college.verified_at);

                return (
                  <tr key={college.id} className="border-t align-top">
                    <td className="p-3 font-medium">{college.name}</td>
                    <td className="p-3">{college.state || "-"}</td>
                    <td className="p-3">{college.division || "-"}</td>
                    <td className="p-3">{college.head_coach || "-"}</td>
                    <td className="p-3">
                      {college.recruiting_coordinator || "-"}
                    </td>
                    <td className="p-3">
                      {bestEmail ? (
                        <a
                          href={`mailto:${bestEmail}`}
                          className="text-red-600 hover:underline"
                        >
                          {bestEmail}
                        </a>
                      ) : (
                        <span className="text-gray-400">No email</span>
                      )}
                    </td>
                    <td className="p-3">
                      {college.baseball_website ? (
                        <a
                          href={college.baseball_website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Open Site
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">
                      {isVerified ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                          Needs Review
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {isVerified ? (
                        <button
                          onClick={() => clearVerification(college)}
                          disabled={savingId === college.id}
                          className="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-gray-100 disabled:opacity-50"
                        >
                          Reset
                        </button>
                      ) : (
                        <button
                          onClick={() => markVerified(college)}
                          disabled={savingId === college.id}
                          className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {savingId === college.id
                            ? "Saving..."
                            : "Mark Verified"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredColleges.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">
                    No colleges match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}