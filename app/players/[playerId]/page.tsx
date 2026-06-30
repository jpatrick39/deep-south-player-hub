import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import PhotoUploader from "./PhotoUploader";
import EditPlayerForm from "./EditPlayerForm";
import AddMetricForm from "./AddMetricForm";
import VideoUploader from "./VideoUploader";
import PlayerMetrics from "./PlayerMetrics";
import CollegeInterestTracker from "./CollegeInterestTracker";
import SendPlayerProfileButton from "@/components/SendPlayerProfileButton";
import CopyPublicProfileLink from "@/components/CopyPublicProfileLink";
import RecruitingScoreCard from "@/components/RecruitingScoreCard";

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

  const latestMetrics = metrics || [];

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link
            href="/players"
            className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
          >

  <div className="mt-6">
  <RecruitingScoreCard player={player} metrics={latestMetrics} />
</div>
            ← Back to Players
          </Link>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-900 p-6 text-white md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-5 md:flex-row md:items-end">
                <div>
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={player.name}
                      className="h-36 w-36 rounded-2xl border-4 border-white/20 object-cover shadow-lg md:h-44 md:w-44"
                    />
                  ) : (
                    <div className="flex h-36 w-36 items-center justify-center rounded-2xl border-4 border-white/20 bg-white/10 text-sm text-slate-300 shadow-lg md:h-44 md:w-44">
                      No Photo
                    </div>
                  )}

                  <div className="mt-3">
                    <PhotoUploader playerId={player.id} />
                  </div>
                </div>

                <div>
                  <p className="mb-2 inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Recruiting Profile
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                    {player.name}
                  </h1>

                  <p className="mt-3 text-slate-200">
                    {player.primary_position || "Position"} | Class of{" "}
                    {player.grad_year || "-"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <Badge>{player.team || "Unassigned Team"}</Badge>
                    <Badge>{player.school || "School Not Added"}</Badge>
                    <Badge>GPA: {player.gpa || "-"}</Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur md:min-w-[240px]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">
                    Profile Completion
                  </p>
                  <p className="text-2xl font-bold">{completion.percent}%</p>
                </div>

                <div className="mt-3 h-3 rounded-full bg-white/20">
                  <div
                    className="h-3 rounded-full bg-red-500"
                    style={{ width: `${completion.percent}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-300">
                  Complete profiles are easier for college coaches to evaluate.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-4 md:grid-cols-3 md:p-8">
            <InfoCard label="Height" value={player.height || "-"} />
            <InfoCard
              label="Weight"
              value={player.weight ? `${player.weight} lbs` : "-"}
            />
            <InfoCard label="Bats / Throws" value={`${player.bats || "-"} / ${player.throws || "-"}`} />
            <InfoCard label="Primary Position" value={player.primary_position || "-"} />
            <InfoCard label="Secondary Position" value={player.secondary_position || "-"} />
            <InfoCard label="Email" value={player.email || "-"} />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900">Player Bio</h2>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {player.bio ? (
                <div className="whitespace-pre-wrap">{player.bio}</div>
              ) : (
                <p className="text-slate-500">No bio added yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <CopyPublicProfileLink playerId={player.id} />
              <SendPlayerProfileButton player={player} />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Profile Completion Checklist
          </h2>

          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-4">
            {completion.checks.map((check) => (
              <div
                key={check.label}
                className={`rounded-xl border px-3 py-2 ${
                  check.complete
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {check.complete ? "✅" : "⬜"} {check.label}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Edit Player Information
          </h2>
          <EditPlayerForm player={player} />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Recruiting Videos
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
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
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <PlayerMetrics metrics={latestMetrics} />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Performance Metrics
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-slate-700">
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {latestMetrics.map((metric) => (
                  <tr
                    key={metric.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="p-3 font-medium">{metric.metric_type}</td>
                    <td className="p-3">
                      {metric.value} {metric.unit}
                    </td>
                    <td className="p-3">
                      {new Date(metric.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {latestMetrics.length === 0 && (
                  <tr>
                    <td className="p-3 text-slate-500" colSpan={3}>
                      No metrics added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <AddMetricForm playerId={playerId} />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CollegeInterestTracker
            playerId={playerId}
            interests={collegeInterests || []}
            colleges={colleges || []}
          />
        </section>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-slate-100 ring-1 ring-white/20">
      {children}
    </span>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
