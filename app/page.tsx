import Link from "next/link";
import { supabase } from "../lib/supabase";
import StatCard from "@/components/StatCard";

export default async function DashboardPage() {
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: metrics } = await supabase
    .from("player_metrics")
    .select("*");

  const playerCount = players?.length || 0;
  const publicProfiles = players?.filter((p) => p.is_public).length || 0;

  const videoCount =
    players?.filter(
      (p) =>
        p.recruiting_video_url ||
        p.hitting_video_url ||
        p.fielding_video_url ||
        p.pitching_video_url
    ).length || 0;

  const metricCount = metrics?.length || 0;

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Deep South Player Hub</h1>
          <p className="text-gray-600 mt-2">
            Player development and recruiting dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Players</p>
            <h2 className="text-4xl font-bold">{playerCount}</h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Public Profiles</p>
            <h2 className="text-4xl font-bold">{publicProfiles}</h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Players With Videos</p>
            <h2 className="text-4xl font-bold">{videoCount}</h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Metric Entries</p>
            <h2 className="text-4xl font-bold">{metricCount}</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link
            href="/players"
            className="bg-red-600 text-white rounded-xl p-6 shadow hover:bg-red-700"
          >
            <h2 className="text-2xl font-bold">Manage Players</h2>
            <p className="mt-2 text-red-100">
              View, edit, and update player profiles.
            </p>
          </Link>

          <Link
            href="/players/new"
            className="bg-white rounded-xl p-6 shadow hover:bg-gray-50"
          >
            <h2 className="text-2xl font-bold">Add Player</h2>
            <p className="mt-2 text-gray-600">Create a new profile.</p>
          </Link>

          <Link
            href="/players"
            className="bg-white rounded-xl p-6 shadow hover:bg-gray-50"
          >
            <h2 className="text-2xl font-bold">Recruiting Profiles</h2>
            <p className="mt-2 text-gray-600">
              Review photos, videos, and metrics.
            </p>
          </Link>

          <Link
            href="/recruiting"
            className="bg-white rounded-xl p-6 shadow hover:bg-gray-50"
          >
            <h2 className="text-2xl font-bold">Recruiting Dashboard</h2>
            <p className="mt-2 text-gray-600">
              Track college interest and offers.
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Recent Players</h2>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Grad Year</th>
                <th className="text-left p-4">Position</th>
                <th className="text-left p-4">School</th>
              </tr>
            </thead>

            <tbody>
              {players?.slice(0, 8).map((player) => (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Link
                      href={`/players/${player.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {player.name}
                    </Link>
                  </td>
                  <td className="p-4">{player.grad_year || "-"}</td>
                  <td className="p-4">{player.primary_position || "-"}</td>
                  <td className="p-4">{player.school || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}