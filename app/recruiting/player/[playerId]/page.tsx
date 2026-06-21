import { supabase } from "../../../../lib/supabase";

export default async function PublicRecruitingProfile({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();

  const { data: metrics } = await supabase
    .from("player_metrics")
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  if (!player) {
    return <main className="p-8">Player profile not found.</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <div className="mb-8 border-b pb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-red-600">
            Deep South Baseball Recruiting Profile
          </p>

          <h1 className="mt-2 text-4xl font-bold">{player.name}</h1>

          <p className="mt-2 text-gray-600">
            {player.primary_position || "Position"} | Class of{" "}
            {player.grad_year || "-"}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div>
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.name}
                className="h-56 w-56 rounded-xl border object-cover"
              />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center rounded-xl border bg-gray-200 text-gray-500">
                No Photo
              </div>
            )}
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-2">
            <Info label="School" value={player.school} />
            <Info label="Team" value={player.team} />
            <Info label="Graduation Year" value={player.grad_year} />
            <Info label="Primary Position" value={player.primary_position} />
            <Info label="Secondary Position" value={player.secondary_position} />
            <Info label="Height" value={player.height} />
            <Info
              label="Weight"
              value={player.weight ? `${player.weight} lbs` : ""}
            />
            <Info label="Bats" value={player.bats} />
            <Info label="Throws" value={player.throws} />
            <Info label="GPA" value={player.gpa} />
          </div>
        </div>

        {player.bio && (
          <section className="mt-8">
            <h2 className="mb-3 text-2xl font-bold">Player Bio</h2>
            <div className="whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-gray-700">
              {player.bio}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-2xl font-bold">Recruiting Videos</h2>

          <div className="grid gap-3 md:grid-cols-2">
            <VideoLink label="Recruiting Video" url={player.recruiting_video_url} />
            <VideoLink label="Hitting Video" url={player.hitting_video_url} />
            <VideoLink label="Fielding Video" url={player.fielding_video_url} />
            <VideoLink label="Pitching Video" url={player.pitching_video_url} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-2xl font-bold">Performance Metrics</h2>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {metrics?.map((metric) => (
                  <tr key={metric.id} className="border-t">
                    <td className="p-3">{metric.metric_type}</td>
                    <td className="p-3">
                      {metric.value} {metric.unit}
                    </td>
                    <td className="p-3">
                      {new Date(metric.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {(!metrics || metrics.length === 0) && (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={3}>
                      No metrics available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-xl border bg-slate-950 p-6 text-white">
          <h2 className="text-2xl font-bold">Coach Contact</h2>
          <p className="mt-2 text-slate-300">
            For more information about {player.name}, contact Deep South
            Baseball.
          </p>

          {player.email && (
            <a
              href={`mailto:${player.email}`}
              className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Contact Player
            </a>
          )}
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="mt-1 font-semibold">{value || "-"}</p>
    </div>
  );
}

function VideoLink({ label, url }: { label: string; url: string | null }) {
  if (!url) {
    return (
      <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-500">
        {label}: Not uploaded
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      className="rounded-lg border bg-gray-50 p-4 text-sm font-medium text-red-600 hover:underline"
    >
      View {label}
    </a>
  );
}