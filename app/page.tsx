import Link from "next/link";
import { supabase } from "../lib/supabase";
import PageHeader from "@/components/PageHeader";

function calculateCompletion(player: any, interests: any[], metrics: any[]) {
  const checks = [
    !!player.photo_url,
    !!player.name,
    !!player.school,
    !!player.grad_year || !!player.graduation_year,
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
      !!player.pitching_video_url ||
      !!player.catching_video_url,
    metrics.some((metric) => metric.player_id === player.id),
    interests.some((interest) => interest.player_id === player.id),
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default async function DashboardPage() {
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: metrics } = await supabase.from("player_metrics").select("*");

  const { data: interests } = await supabase
    .from("college_interests")
    .select("*, colleges(name, state, division)")
    .order("created_at", { ascending: false });

  const { data: colleges } = await supabase.from("colleges").select("*");

  const playerList = players || [];
  const metricList = metrics || [];
  const interestList = interests || [];
  const collegeList = colleges || [];

  const teams = Array.from(
    new Set(playerList.map((player) => player.team || "Unassigned"))
  );

  const playersWithVideos = playerList.filter(
    (player) =>
      player.recruiting_video_url ||
      player.hitting_video_url ||
      player.fielding_video_url ||
      player.pitching_video_url ||
      player.catching_video_url
  ).length;

  const completionScores = playerList.map((player) =>
    calculateCompletion(player, interestList, metricList)
  );

  const avgCompletion =
    completionScores.length > 0
      ? Math.round(
          completionScores.reduce((sum, score) => sum + score, 0) /
            completionScores.length
        )
      : 0;

  const activeRecruitingPlayers = new Set(
    interestList.map((interest) => interest.player_id)
  ).size;

  const offers = interestList.filter(
    (interest) => interest.status === "Offer Received"
  ).length;

  const commitments = interestList.filter(
    (interest) => interest.status === "Committed"
  ).length;

  const coachContacted = interestList.filter(
    (interest) => interest.status === "Coach Contacted"
  ).length;

  const recentPlayers = playerList.slice(0, 5);
  const recentActivity = interestList.slice(0, 8);

  const needsAttention = playerList
    .map((player) => ({
      ...player,
      completion: calculateCompletion(player, interestList, metricList),
    }))
    .filter((player) => player.completion < 75)
    .sort((a, b) => a.completion - b.completion)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Organization Dashboard"
          subtitle="A complete snapshot of player development, team activity, recruiting progress, and profile readiness."
        />

        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard title="Total Players" value={playerList.length} />
          <DashboardCard title="Teams" value={teams.length} />
          <DashboardCard title="Active Recruiting" value={activeRecruitingPlayers} />
          <DashboardCard title="Avg Profile Completion" value={`${avgCompletion}%`} />
          <DashboardCard title="Players With Video" value={playersWithVideos} />
          <DashboardCard title="College Contacts" value={collegeList.length} />
          <DashboardCard title="Coach Contacted" value={coachContacted} />
          <DashboardCard title="Offers / Commits" value={`${offers} / ${commitments}`} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Recent Recruiting Activity
                </h2>
                <p className="text-sm text-slate-500">
                  Latest college interest updates across the organization.
                </p>
              </div>

              <Link
                href="/recruiting"
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                View Recruiting
              </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left text-slate-700">
                    <th className="p-3">Player</th>
                    <th className="p-3">College</th>
                    <th className="p-3">Division</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentActivity.map((activity) => {
                    const player = playerList.find(
                      (item) => item.id === activity.player_id
                    );

                    return (
                      <tr
                        key={activity.id}
                        className="border-t border-slate-200 hover:bg-slate-50"
                      >
                        <td className="p-3 font-medium">
                          {player ? (
                            <Link
                              href={`/players/${player.id}`}
                              className="text-slate-900 hover:text-red-600 hover:underline"
                            >
                              {player.name}
                            </Link>
                          ) : (
                            "Unknown Player"
                          )}
                        </td>
                        <td className="p-3">
                          {activity.colleges?.name || "-"}
                        </td>
                        <td className="p-3">
                          {activity.colleges?.division || "-"}
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {recentActivity.length === 0 && (
                    <tr>
                      <td className="p-4 text-slate-500" colSpan={4}>
                        No recruiting activity yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-4 grid gap-3">
              <ActionLink href="/players" label="Manage Players" />
              <ActionLink href="/teams" label="View Teams & Rosters" />
              <ActionLink href="/recruiting" label="Recruiting Dashboard" />
              <ActionLink href="/colleges" label="College Database" />
              <ActionLink href="/colleges/verify" label="Verify Contacts" />
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Players Needing Attention
                </h2>
                <p className="text-sm text-slate-500">
                  Profiles below 75% completion.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {needsAttention.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {player.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {player.team || "Unassigned"} •{" "}
                        {player.primary_position || "Position not set"}
                      </p>
                    </div>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                      {player.completion}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{ width: `${player.completion}%` }}
                    />
                  </div>
                </Link>
              ))}

              {needsAttention.length === 0 && (
                <p className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                  All player profiles are above 75% completion.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Recent Players
                </h2>
                <p className="text-sm text-slate-500">
                  Latest players added to the platform.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {recentPlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
                >
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={player.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-xs text-slate-500">
                      No Photo
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-slate-900">
                      {player.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {player.team || "Unassigned"} • Class of{" "}
                      {player.grad_year || player.graduation_year || "-"}
                    </p>
                  </div>
                </Link>
              ))}

              {recentPlayers.length === 0 && (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No players added yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
    >
      {label}
    </Link>
  );
}