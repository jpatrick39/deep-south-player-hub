type Player = {
  id: string;
  grad_year?: number | null;
  graduation_year?: string | null;
  primary_position?: string | null;
  height?: string | null;
  weight?: string | null;
  gpa?: string | null;
  photo_url?: string | null;
  bio?: string | null;
  recruiting_video_url?: string | null;
  hitting_video_url?: string | null;
  fielding_video_url?: string | null;
  pitching_video_url?: string | null;
  catching_video_url?: string | null;
};

type Metric = {
  metric_type: string;
  value: number | string;
  unit?: string | null;
};

function getMetric(metrics: Metric[], names: string[]) {
  const match = metrics.find((metric) =>
    names.some((name) =>
      metric.metric_type?.toLowerCase().includes(name.toLowerCase())
    )
  );

  if (!match) return null;

  const value = Number(match.value);
  return Number.isFinite(value) ? value : null;
}

function calculateRecruitingScore(player: Player, metrics: Metric[]) {
  let score = 0;

  const exitVelo = getMetric(metrics, ["exit velo", "exit velocity"]);
  const sixty = getMetric(metrics, ["60", "60 yard", "sixty"]);
  const popTime = getMetric(metrics, ["pop time"]);
  const pitchVelo = getMetric(metrics, ["pitch velo", "pitch velocity"]);
  const gpa = player.gpa ? Number(player.gpa) : null;

  if (player.photo_url) score += 5;
  if (player.bio) score += 5;
  if (
    player.recruiting_video_url ||
    player.hitting_video_url ||
    player.fielding_video_url ||
    player.pitching_video_url ||
    player.catching_video_url
  ) {
    score += 15;
  }

  if (gpa && gpa >= 3.7) score += 10;
  else if (gpa && gpa >= 3.3) score += 8;
  else if (gpa && gpa >= 3.0) score += 6;
  else if (gpa && gpa >= 2.5) score += 3;

  if (exitVelo) {
    if (exitVelo >= 95) score += 20;
    else if (exitVelo >= 90) score += 16;
    else if (exitVelo >= 85) score += 12;
    else if (exitVelo >= 80) score += 8;
    else score += 4;
  }

  if (sixty) {
    if (sixty <= 6.7) score += 15;
    else if (sixty <= 7.0) score += 12;
    else if (sixty <= 7.3) score += 8;
    else if (sixty <= 7.6) score += 5;
    else score += 2;
  }

  if (pitchVelo) {
    if (pitchVelo >= 90) score += 20;
    else if (pitchVelo >= 86) score += 16;
    else if (pitchVelo >= 82) score += 12;
    else if (pitchVelo >= 78) score += 8;
    else score += 4;
  }

  if (popTime) {
    if (popTime <= 1.9) score += 15;
    else if (popTime <= 2.0) score += 12;
    else if (popTime <= 2.1) score += 8;
    else if (popTime <= 2.2) score += 5;
    else score += 2;
  }

  const finalScore = Math.min(score, 100);

  let rating = "Developing";
  let stars = "★★☆☆☆";
  let projectedLevel = "High School / Developmental";

  if (finalScore >= 90) {
    rating = "Elite Prospect";
    stars = "★★★★★";
    projectedLevel = "NCAA Division I";
  } else if (finalScore >= 80) {
    rating = "High-Level Prospect";
    stars = "★★★★☆";
    projectedLevel = "NCAA D1 / High D2";
  } else if (finalScore >= 70) {
    rating = "College Prospect";
    stars = "★★★☆☆";
    projectedLevel = "NCAA D2 / NAIA / JUCO";
  } else if (finalScore >= 55) {
    rating = "Projectable Prospect";
    stars = "★★★☆☆";
    projectedLevel = "JUCO / Developmental College";
  }

  return {
    score: finalScore,
    rating,
    stars,
    projectedLevel,
    exitVelo,
    sixty,
    popTime,
    pitchVelo,
  };
}

export default function RecruitingScoreCard({
  player,
  metrics,
}: {
  player: Player;
  metrics: Metric[];
}) {
  const result = calculateRecruitingScore(player, metrics);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Recruiting Score
          </p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {result.score}/100
          </h2>
          <p className="mt-1 text-lg text-yellow-500">{result.stars}</p>
          <p className="mt-2 font-semibold text-slate-800">{result.rating}</p>
          <p className="text-sm text-slate-500">
            Projected Level: {result.projectedLevel}
          </p>
        </div>

        <div className="w-full md:max-w-sm">
          <div className="h-4 rounded-full bg-slate-200">
            <div
              className="h-4 rounded-full bg-red-600"
              style={{ width: `${result.score}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Early scoring model based on profile completeness, video, academics,
            and available measurables.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MiniMetric label="Exit Velo" value={result.exitVelo} suffix="mph" />
        <MiniMetric label="60 Time" value={result.sixty} suffix="sec" />
        <MiniMetric label="Pitch Velo" value={result.pitchVelo} suffix="mph" />
        <MiniMetric label="Pop Time" value={result.popTime} suffix="sec" />
      </div>
    </section>
  );
}

function MiniMetric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | null;
  suffix: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-slate-900">
        {value ? `${value} ${suffix}` : "-"}
      </p>
    </div>
  );
}