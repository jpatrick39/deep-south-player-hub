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

  const { data: branding } = await supabase
    .from("organization_settings")
    .select("*")
    .limit(1)
    .single();

  if (!player) {
    return <main className="p-8">Player profile not found.</main>;
  }

  const gradYear = player.grad_year || player.graduation_year || "-";
  const organizationName = branding?.name || "Organization";

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-3xl bg-white shadow">
          <div
            className="p-6 text-white md:p-10"
            style={{
              background: `linear-gradient(135deg, ${
                branding?.secondary_color || "#0f172a"
              }, ${branding?.primary_color || "#dc2626"})`,
            }}
          >
            <div className="mb-6 flex items-center gap-3">
              {branding?.logo_url && (
                <img
                  src={branding.logo_url}
                  alt={organizationName}
                  className="h-14 w-14 rounded-xl bg-white object-contain p-2"
                />
              )}

              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-white/70">
                  {organizationName} Recruiting Profile
                </p>
                {branding?.tagline && (
                  <p className="text-sm text-white/60">{branding.tagline}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-end">
              {player.photo_url ? (
                <img
                  src={player.photo_url}
                  alt={player.name}
                  className="h-48 w-48 rounded-2xl border-4 border-white/20 object-cover shadow-lg md:h-56 md:w-56"
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-2xl border-4 border-white/20 bg-white/10 text-slate-300 md:h-56 md:w-56">
                  No Photo
                </div>
              )}

              <div>
                <h1 className="text-4xl font-bold md:text-6xl">
                  {player.name}
                </h1>

                <p className="mt-3 text-xl text-slate-200">
                  {player.primary_position || "Player"} | Class of {gradYear}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-sm">
                  <Badge>{player.team || organizationName}</Badge>
                  <Badge>{player.school || "School Not Listed"}</Badge>
                  <Badge>GPA: {player.gpa || "-"}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-5 md:p-8">
            <InfoCard label="Height" value={player.height || "-"} />
            <InfoCard
              label="Weight"
              value={player.weight ? `${player.weight} lbs` : "-"}
            />
            <InfoCard label="Bats" value={player.bats || "-"} />
            <InfoCard label="Throws" value={player.throws || "-"} />
            <InfoCard label="Position" value={player.primary_position || "-"} />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-bold text-slate-900">Player Bio</h2>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-slate-700">
            {player.bio ? (
              <div className="whitespace-pre-wrap">{player.bio}</div>
            ) : (
              <p className="text-slate-500">No bio available.</p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Recruiting Videos
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <VideoLink label="Recruiting Video" url={player.recruiting_video_url} />
            <VideoLink label="Hitting Video" url={player.hitting_video_url} />
            <VideoLink label="Fielding Video" url={player.fielding_video_url} />
            <VideoLink label="Pitching Video" url={player.pitching_video_url} />
            <VideoLink label="Catching Video" url={player.catching_video_url} />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Performance Metrics
          </h2>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-slate-700">
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {(metrics || []).map((metric) => (
                  <tr key={metric.id} className="border-t border-slate-200">
                    <td className="p-3 font-medium">{metric.metric_type}</td>
                    <td className="p-3">
                      {metric.value} {metric.unit}
                    </td>
                    <td className="p-3">
                      {metric.created_at
                        ? new Date(metric.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}

                {(!metrics || metrics.length === 0) && (
                  <tr>
                    <td className="p-3 text-slate-500" colSpan={3}>
                      No metrics available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="mt-6 rounded-2xl p-6 text-white shadow-sm"
          style={{
            backgroundColor: branding?.secondary_color || "#020617",
          }}
        >
          <h2 className="text-2xl font-bold">Contact {organizationName}</h2>

          <p className="mt-2 text-white/70">
            Interested in learning more about this athlete? Contact{" "}
            {organizationName} for additional information, schedule details, or
            recruiting opportunities.
          </p>

          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <ContactItem label="Email" value={player.email} type="email" />
            <ContactItem label="Phone" value={player.phone} type="phone" />
          </div>

          {branding?.website && (
            <a
              href={branding.website}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Visit {organizationName}
            </a>
          )}
        </section>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white ring-1 ring-white/20">
      {children}
    </span>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function VideoLink({ label, url }: { label: string; url: string | null }) {
  if (!url) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        {label}: Not uploaded
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-red-600 hover:bg-red-50 hover:underline"
    >
      View {label}
    </a>
  );
}

function ContactItem({
  label,
  value,
  type,
}: {
  label: string;
  value: string | null;
  type: "email" | "phone";
}) {
  if (!value) {
    return (
      <div className="rounded-xl bg-white/10 p-4">
        <p className="text-xs uppercase text-white/50">{label}</p>
        <p className="mt-1 text-white/70">Not listed</p>
      </div>
    );
  }

  const href = type === "email" ? `mailto:${value}` : `tel:${value}`;

  return (
    <a href={href} className="rounded-xl bg-white/10 p-4 hover:bg-white/15">
      <p className="text-xs uppercase text-white/50">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </a>
  );
}