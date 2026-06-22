import { supabase } from "../../../lib/supabase";
import PhotoUploader from "./PhotoUploader";
import EditPlayerForm from "./EditPlayerForm";
import AddMetricForm from "./AddMetricForm";
import VideoUploader from "./VideoUploader";
import PlayerMetrics from "./PlayerMetrics";
import CollegeInterestTracker from "./CollegeInterestTracker";
import SendPlayerProfileButton from "@/components/SendPlayerProfileButton";
import CopyPublicProfileLink from "@/components/CopyPublicProfileLink";

function calculateProfileCompletion(
  player: any,
  metrics: any[],
  collegeInterests: any[]
) {
  const checks = [
    { label: "Photo", complete: !!player.photo_url },
    { label: "Name", complete: !!player.name },
    { label: "School", complete: !!player.school },
    { label: "Grad Year", complete: !!player.grad_year },
    { label: "Primary Position", complete: !!player.primary_position },
    { label: "Secondary Position", complete: !!player.secondary_position },
    { label: "Height", complete: !!player.height },
    { label: "Weight", complete: !!player.weight },
    { label: "Bats", complete: !!player.bats },
    { label: "Throws", complete: !!player.throws },
    { label: "GPA", complete: !!player.gpa },
    { label: "Email", complete: !!player.email },
    { label: "Bio", complete: !!player.bio },
    {
      label: "Video",
      complete:
        !!player.recruiting_video_url ||
        !!player.hitting_video_url ||
        !!player.fielding_video_url ||
        !!player.pitching_video_url,
    },
    { label: "Metrics", complete: metrics.length > 0 },
    { label: "College Interests", complete: collegeInterests.length > 0 },
  ];

  const completed = checks.filter((c) => c.complete).length;
  const percent = Math.round((completed / checks.length) * 100);

  return { percent, checks };
}

export default async function PlayerPage({
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

  const { data: collegeInterests } = await supabase
    .from("college_interests")
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  const { data: colleges } = await supabase
    .from("colleges")
    .select("*")
    .order("name", { ascending: true });

  if (!player) {
    return <main className="p-8">Player not found</main>;
  }

  const completion = calculateProfileCompletion(
    player,
    metrics || [],
    collegeInterests || []
  );

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-4 shadow md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div>
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.name}
                className="h-40 w-40 rounded-xl border object-cover md:h-48 md:w-48"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-xl border bg-gray-200 text-gray-500 md:h-48 md:w-48"
                No Photo
              </div>
            )}

            <PhotoUploader playerId={player.id} />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold">{player.name}</h1>
            <p className="text-gray-600 mt-2">
              {player.primary_position || "Position"} | Class of{" "}
              {player.grad_year || "-"}
            </p>

            <div className="mt-6 border rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Profile Completion</h2>
                <span className="text-2xl font-bold">
                  {completion.percent}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-red-600 h-4 rounded-full"
                  style={{ width: `${completion.percent}%` }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-2 text-sm">
                {completion.checks.map((check) => (
                  <div key={check.label}>
                    {check.complete ? "✅" : "⬜"} {check.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <p>
            <strong>School:</strong> {player.school || "-"}
          </p>
          <p>
            <strong>Grad Year:</strong> {player.grad_year || "-"}
          </p>
          <p>
            <strong>Primary Position:</strong>{" "}
            {player.primary_position || "-"}
          </p>
          <p>
            <strong>Secondary Position:</strong>{" "}
            {player.secondary_position || "-"}
          </p>
          <p>
            <strong>Height:</strong> {player.height || "-"}
          </p>
          <p>
            <strong>Weight:</strong>{" "}
            {player.weight ? `${player.weight} lbs` : "-"}
          </p>
          <p>
            <strong>Bats:</strong> {player.bats || "-"}
          </p>
          <p>
            <strong>Throws:</strong> {player.throws || "-"}
          </p>
          <p>
            <strong>Team:</strong> {player.team || "-"}
          </p>
          <p>
            <strong>GPA:</strong> {player.gpa || "-"}
          </p>
          <p>
            <strong>Email:</strong> {player.email || "-"}
          </p>
        </div>

        {player.bio && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-3">Player Bio</h2>
            <div className="bg-gray-50 border rounded-lg p-4 whitespace-pre-wrap">
              {player.bio}
            </div>
          </div>
        )}

	<div className="mt-8 flex flex-wrap gap-3">
 	<CopyPublicProfileLink playerId={player.id} />
	</div>

        <div className="mt-8">
          <SendPlayerProfileButton player={player} />
        </div>

        <EditPlayerForm player={player} />

        <div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">Recruiting Videos</h2>

  <div className="grid md:grid-cols-2 gap-4">
    <VideoUploader
      playerId={player.id}
      fieldName="recruiting_video_url"
      label="Recruiting Video"
    />

    <VideoUploader
      playerId={player.id}
      fieldName="hitting_video_url"
      label="Hitting Video"
    />

    <VideoUploader
      playerId={player.id}
      fieldName="fielding_video_url"
      label="Fielding Video"
    />

    <VideoUploader
      playerId={player.id}
      fieldName="pitching_video_url"
      label="Pitching Video"
    />
  </div>
</div>

        <PlayerMetrics metrics={metrics || []} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>

          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Metric</th>
                  <th className="p-3 text-left">Value</th>
                  <th className="p-3 text-left">Date</th>
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
                      No metrics added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AddMetricForm playerId={playerId} />
        </div>

        <CollegeInterestTracker
          playerId={playerId}
          interests={collegeInterests || []}
          colleges={colleges || []}
        />
      </div>
    </main>
  );
}