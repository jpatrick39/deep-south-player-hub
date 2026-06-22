"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_ORDER = [
  "Interested",
  "Questionnaire Submitted",
  "Camp Attended",
  "Coach Contacted",
  "Coach Responded",
  "Offer Received",
  "Committed",
];

function calculateCompletion(player: any, interests: any[]) {
  const checks = [
    !!player.photo_url,
    !!player.name,
    !!player.school,
    !!player.grad_year,
    !!player.primary_position,
    !!player.secondary_position,
    !!player.height,
    !!player.weight,
    !!player.bats,
    !!player.throws,
    !!player.gpa,
    !!player.email,
    !!player.bio,
    !!player.recruiting_video_url ||
      !!player.hitting_video_url ||
      !!player.fielding_video_url ||
      !!player.pitching_video_url,
    interests.some((i) => i.player_id === player.id),
  ];

  return Math.round(
    (checks.filter(Boolean).length / checks.length) * 100
  );
}

export default function RecruitingDashboardPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const { data: playerData } = await supabase
      .from("players")
      .select("*")
      .order("name", { ascending: true });

    const { data: interestData } = await supabase
      .from("college_interests")
      .select("*, colleges(name, state, division)")
      .order("created_at", { ascending: false });

    setPlayers(playerData || []);
    setInterests(interestData || []);
    setLoading(false);
  }

  const stats = useMemo(() => {
    const uniquePlayerIds = new Set(interests.map((i) => i.player_id));
    const uniqueCollegeIds = new Set(interests.map((i) => i.college_id));

    const statusCounts: Record<string, number> = {};
    STATUS_ORDER.forEach((status) => {
      statusCounts[status] = interests.filter((i) => i.status === status).length;
    });

    const completionScores = players.map((player) =>
      calculateCompletion(player, interests)
    );

    const avgCompletion =
      completionScores.length > 0
        ? Math.round(
            completionScores.reduce((sum, score) => sum + score, 0) /
              completionScores.length
          )
        : 0;

    const collegeCounts: Record<string, number> = {};

    interests.forEach((interest) => {
      const collegeName = interest.colleges?.name || "Unknown College";
      collegeCounts[collegeName] = (collegeCounts[collegeName] || 0) + 1;
    });

    const mostActiveCollege =
      Object.entries(collegeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return {
      recruitedPlayers: uniquePlayerIds.size,
      totalInterests: interests.length,
      totalColleges: uniqueCollegeIds.size,
      contacted: statusCounts["Coach Contacted"] || 0,
      responded: statusCounts["Coach Responded"] || 0,
      offers: statusCounts["Offer Received"] || 0,
      committed: statusCounts["Committed"] || 0,
      avgCompletion,
      mostActiveCollege,
      funnelData: STATUS_ORDER.map((status) => ({
        status,
        count: statusCounts[status] || 0,
      })),
    };
  }, [players, interests]);

  if (loading) {
    return <main className="p-8">Loading recruiting dashboard...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Recruiting Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Track player recruiting activity, college interest, coach contact,
            offers, commitments, and profile readiness.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Players Being Recruited" value={stats.recruitedPlayers} />
          <StatCard title="Total College Interests" value={stats.totalInterests} />
          <StatCard title="Colleges Tracked" value={stats.totalColleges} />
          <StatCard title="Avg Profile Completion" value={`${stats.avgCompletion}%`} />
          <StatCard title="Coach Contacted" value={stats.contacted} />
          <StatCard title="Coach Responded" value={stats.responded} />
          <StatCard title="Offers Received" value={stats.offers} />
          <StatCard title="Committed" value={stats.committed} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">Recruiting Funnel</h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.funnelData}>
                  <XAxis
                    dataKey="status"
                    angle={-25}
                    textAnchor="end"
                    height={90}
                    interval={0}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">Recruiting Summary</h2>

            <div className="space-y-4 text-sm">
              <p>
                <strong>Most Active College:</strong>
                <br />
                {stats.mostActiveCollege}
              </p>

              <p>
                <strong>Offer Rate:</strong>
                <br />
                {stats.totalInterests > 0
                  ? `${Math.round((stats.offers / stats.totalInterests) * 100)}%`
                  : "0%"}
              </p>

              <p>
                <strong>Commitment Rate:</strong>
                <br />
                {stats.totalInterests > 0
                  ? `${Math.round(
                      (stats.committed / stats.totalInterests) * 100
                    )}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Recent Recruiting Activity</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Player</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Division</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {interests.map((interest) => {
                  const player = players.find(
                    (p) => p.id === interest.player_id
                  );

                  return (
                    <tr key={interest.id} className="border-t">
                      <td className="p-3 font-medium">
                        {player?.name || "Unknown Player"}
                      </td>
                      <td className="p-3">
                        {interest.colleges?.name || "-"}
                      </td>
                      <td className="p-3">
                        {interest.colleges?.division || "-"}
                      </td>
                      <td className="p-3">
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          {interest.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {interest.created_at
                          ? new Date(interest.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })}

                {interests.length === 0 && (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={5}>
                      No recruiting activity yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}