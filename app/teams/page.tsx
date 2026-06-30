import Link from "next/link";
import { supabase } from "../../lib/supabase";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

export default async function TeamsPage() {
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("team", { ascending: true })
    .order("name", { ascending: true });

  const groupedTeams = (players || []).reduce((groups: any, player: any) => {
    const teamName = player.team || "Unassigned";
    if (!groups[teamName]) groups[teamName] = [];
    groups[teamName].push(player);
    return groups;
  }, {});

  const teams = Object.entries(groupedTeams);

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Teams & Rosters"
          subtitle="View players grouped by team assignment."
        />

        <div className="grid gap-6">
          {teams.map(([teamName, teamPlayers]: any) => (
            <section
              key={teamName}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
            >
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {teamName}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {teamPlayers.length} player
                    {teamPlayers.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-left text-slate-700">
                      <th className="p-3">Player</th>
                      <th className="p-3">School</th>
                      <th className="p-3">Grad Year</th>
                      <th className="p-3">Position</th>
                      <th className="p-3">Bats</th>
                      <th className="p-3">Throws</th>
                      <th className="p-3">Profile</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teamPlayers.map((player: any) => (
                      <tr
                        key={player.id}
                        className="border-t border-slate-200 hover:bg-slate-50"
                      >
                        <td className="p-3 font-medium text-slate-900">
                          {player.name}
                        </td>
                        <td className="p-3">{player.school || "-"}</td>
                        <td className="p-3">{player.grad_year || "-"}</td>
                        <td className="p-3">
                          {player.primary_position || "-"}
                        </td>
                        <td className="p-3">{player.bats || "-"}</td>
                        <td className="p-3">{player.throws || "-"}</td>
                        <td className="p-3">
                          <Link
                            href={`/players/${player.id}`}
                            className="font-medium text-red-600 hover:text-red-700 hover:underline"
                          >
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          {teams.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
              No players found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}