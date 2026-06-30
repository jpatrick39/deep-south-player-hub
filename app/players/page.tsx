import Link from "next/link";
import { supabase } from "../../lib/supabase";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

export default async function PlayersPage() {
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
         <PageHeader
  title="Recruiting Dashboard"
  subtitle="Track player recruiting activity, college interest, coach contact, offers, commitments, and profile readiness."
/>

          <Link href="/players/new" className="bg-red-600 text-white px-4 py-2 rounded-lg">
            Add Player
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Team</th>
                <th className="text-left p-4">School</th>
                <th className="text-left p-4">Grad Year</th>
                <th className="text-left p-4">Position</th>
              </tr>
            </thead>

            <tbody>
              {players?.map((player) => (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Link href={`/players/${player.id}`} className="text-blue-600 hover:underline">
                      {player.name}
                    </Link>
                  </td>
                  <td className="p-4">{player.team || "-"}</td>
                  <td className="p-4">{player.school || "-"}</td>
                  <td className="p-4">{player.grad_year || "-"}</td>
                  <td className="p-4">{player.primary_position || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}