import Link from "next/link";
import { supabase } from "../../lib/supabase";

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
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Teams & Rosters</h1>
          <p className="mt-2 text-gray-600">
            View players grouped by team assignment.
          </p>
        </div>

        <div className="grid gap-6">
          {teams.map(([teamName, teamPlayers]: any) => (
            <section key={teamName} className="rounded-xl bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{teamName}</h2>
                  <p className="text-sm text-gray-500">
                    {teamPlayers.length} player
                    {teamPlayers.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
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
                      <tr key={player.id} className="border-t">
                        <td className="p-3 font-medium">{player.name}</td>
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
                            className="text-red-600 hover:underline"
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
            <div className="rounded-xl bg-white p-6 text-gray-500 shadow">
              No players found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}