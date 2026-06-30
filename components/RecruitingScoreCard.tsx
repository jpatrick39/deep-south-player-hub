type Player = {
  id: string;
  age?: number | null;
  grad_year?: number | null;
  graduation_year?: string | null;
  primary_position?: string | null;
  secondary_position?: string | null;
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

function getAge(player: Player) {
  if (player.age) return player.age;

  const gradYear =
    typeof player.grad_year === "number"
      ? player.grad_year
      : Number(player.graduation_year);

  if (!gradYear || !Number.isFinite(gradYear)) return null;

  const currentYear = new Date().getFullYear();

  return Math.max(13, 18 - (gradYear - currentYear));
}

function scoreHigherIsBetter(value: number | null, levels: number[]) {
  if (!value) return 0;

  const [average, good, excellent, elite] = levels;

  if (value >= elite) return 100;
  if (value >= excellent) return 85;
  if (value >= good) return 70;
  if (value >= average) return 55;

  return 35;
}

function scoreLowerIsBetter(value: number | null, levels: number[]) {
  if (!value) return 0;

  const [average, good, excellent, elite] = levels;

  if (value <= elite) return 100;
  if (value <= excellent) return 85;
  if (value <= good) return 70;
  if (value <= average) return 55;

  return 35;
}

function getBenchmarks(age: number | null) {
  if (!age || age <= 14) {
    return {
      label: "13-14U",
      exitVelo: [65, 72, 78, 84],
      pitchVelo: [65, 70, 75, 80],
      sixty: [8.0, 7.6, 7.25, 7.0],
      popTime: [2.35, 2.25, 2.12, 2.0],
      catcherVelo: [65, 70, 74, 78],
    };
  }

  if (age <= 16) {
    return {
      label: "15-16U",
      exitVelo: [78, 84, 90, 95],
      pitchVelo: [72, 78, 84, 88],
      sixty: [7.6, 7.3, 7.05, 6.85],
      popTime: [2.2, 2.1, 2.0, 1.9],
      catcherVelo: [70, 75, 79, 83],
    };
  }

  return {
    label: "17-18U",
    exitVelo: [85, 91, 97, 103],
    pitchVelo: [80, 85, 90, 94],
    sixty: [7.25, 7.0, 6.8, 6.6],
    popTime: [2.05, 1.98, 1.9, 1.82],
    catcherVelo: [76, 80, 84, 88],
  };
}

function calculateProfileReadiness(player: Player, metrics: Metric[]) {
  const checks = [
    !!player.photo_url,
    !!player.bio,
    !!player.primary_position,
    !!player.height,
    !!player.weight,
    !!player.gpa,
    !!player.recruiting_video_url ||
      !!player.hitting_video_url ||
      !!player.fielding_video_url ||
      !!player.pitching_video_url ||
      !!player.catching_video_url,
    metrics.length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function calculatePlayerRating(player: Player, metrics: Metric[]) {
  const age = getAge(player);
  const benchmarks = getBenchmarks(age);

  const exitVelo = getMetric(metrics, ["exit velo", "exit velocity"]);
  const pitchVelo = getMetric(metrics, ["pitch velo", "pitch velocity"]);
  const sixty = getMetric(metrics, ["60", "60 yard", "sixty"]);
  const popTime = getMetric(metrics, ["pop time"]);
  const catcherVelo = getMetric(metrics, [
    "catcher velo",
    "catcher velocity",
    "catching velo",
    "catching velocity",
  ]);

  const position = `${player.primary_position || ""} ${
    player.secondary_position || ""
  }`.toLowerCase();

  const isPitcher = position.includes("p");
  const isCatcher = position.includes("c");

  const scores = [];

  if (exitVelo) {
    scores.push({
      label: "Exit Velocity",
      score: scoreHigherIsBetter(exitVelo, benchmarks.exitVelo),
      value: `${exitVelo} mph`,
    });
  }

  if (sixty) {
    scores.push({
      label: "60 Yard",
      score: scoreLowerIsBetter(sixty, benchmarks.sixty),
      value: `${sixty} sec`,
    });
  }

  if (pitchVelo || isPitcher) {
    scores.push({
      label: "Pitch Velocity",
      score: scoreHigherIsBetter(pitchVelo, benchmarks.pitchVelo),
      value: pitchVelo ? `${pitchVelo} mph` : "-",
    });
  }

  if (popTime || isCatcher) {
    scores.push({
      label: "Pop Time",
      score: scoreLowerIsBetter(popTime, benchmarks.popTime),
      value: popTime ? `${popTime} sec` : "-",
    });
  }

  if (catcherVelo || isCatcher) {
    scores.push({
      label: "Catcher Velocity",
      score: scoreHigherIsBetter(catcherVelo, benchmarks.catcherVelo),
      value: catcherVelo ? `${catcherVelo} mph` : "-",
    });
  }

  const measurableScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, item) => sum + item.score, 0) / scores.length
        )
      : 0;

  const gpa = player.gpa ? Number(player.gpa) : null;

  let academicScore = 0;
  if (gpa && gpa >= 3.8) academicScore = 100;
  else if (gpa && gpa >= 3.5) academicScore = 90;
  else if (gpa && gpa >= 3.2) academicScore = 80;
  else if (gpa && gpa >= 3.0) academicScore = 70;
  else if (gpa && gpa >= 2.5) academicScore = 55;

  const videoScore =
    player.recruiting_video_url ||
    player.hitting_video_url ||
    player.fielding_video_url ||
    player.pitching_video_url ||
    player.catching_video_url
      ? 100
      : 0;

  const profileScore = calculateProfileReadiness(player, metrics);

  const playerRating = Math.round(
    measurableScore * 0.6 +
      academicScore * 0.15 +
      videoScore * 0.1 +
      profileScore * 0.15
  );

  const recruitingScore = Math.round(
    playerRating * 0.75 + profileScore * 0.15 + videoScore * 0.1
  );

  let ratingLabel = "Developing Prospect";
  let projectedLevel = "Developmental / High School";
  let stars = "★★☆☆☆";

  if (playerRating >= 90) {
    ratingLabel = "Elite Age-Group Prospect";
    projectedLevel = "NCAA Division I Projection";
    stars = "★★★★★";
  } else if (playerRating >= 80) {
    ratingLabel = "High-Level Age-Group Prospect";
    projectedLevel = "NCAA D1 / High D2 Projection";
    stars = "★★★★☆";
  } else if (playerRating >= 70) {
    ratingLabel = "College Prospect";
    projectedLevel = "NCAA D2 / NAIA / JUCO Projection";
    stars = "★★★☆☆";
  } else if (playerRating >= 55) {
    ratingLabel = "Projectable Prospect";
    projectedLevel = "JUCO / Developmental College Projection";
    stars = "★★★☆☆";
  }

  const strengths = scores
    .filter((item) => item.score >= 80)
    .map((item) => item.label);

  const needsWork = scores
    .filter((item) => item.score > 0 && item.score < 70)
    .map((item) => item.label);

  return {
    age,
    ageGroup: benchmarks.label,
    playerRating,
    recruitingScore,
    ratingLabel,
    projectedLevel,
    stars,
    measurableScore,
    academicScore,
    profileScore,
    videoScore,
    metricBreakdown: scores,
    strengths,
    needsWork,
  };
}

export default function RecruitingScoreCard({
  player,
  metrics,
}: {
  player: Player;
  metrics: Metric[];
}) {
  const result = calculatePlayerRating(player, metrics);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            AI Player Rating
          </p>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end">
            <h2 className="text-4xl font-bold text-slate-900">
              {result.playerRating}/100
            </h2>

            <div>
              <p className="text-lg text-yellow-500">{result.stars}</p>
              <p className="font-semibold text-slate-800">
                {result.ratingLabel}
              </p>
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Age-adjusted rating based on available baseball measurables,
            academics, video, and profile readiness.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>Age Group: {result.ageGroup}</Pill>
            <Pill>Age: {result.age || "Unknown"}</Pill>
            <Pill>{result.projectedLevel}</Pill>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            Recruiting Score
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {result.recruitingScore}/100
          </p>

          <div className="mt-3 h-4 rounded-full bg-slate-200">
            <div
              className="h-4 rounded-full bg-red-600"
              style={{ width: `${result.recruitingScore}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Recruiting score reflects both player rating and how ready the
            profile is to send to coaches.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <ScoreMini label="Measurables" value={result.measurableScore} />
        <ScoreMini label="Academics" value={result.academicScore} />
        <ScoreMini label="Profile" value={result.profileScore} />
        <ScoreMini label="Video" value={result.videoScore} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="font-bold text-slate-900">Metric Breakdown</h3>

          <div className="mt-3 space-y-3">
            {result.metricBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {item.label}
                  </span>
                  <span className="text-slate-500">
                    {item.value} • {item.score}/100
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-red-600"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}

            {result.metricBreakdown.length === 0 && (
              <p className="text-sm text-slate-500">
                Add metrics like exit velocity, 60 time, pitch velocity, or pop
                time to generate a stronger rating.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="font-bold text-slate-900">AI Notes</h3>

          <div className="mt-3 space-y-3 text-sm">
            <div>
              <p className="font-semibold text-green-700">Strengths</p>
              <p className="text-slate-600">
                {result.strengths.length > 0
                  ? result.strengths.join(", ")
                  : "Add more verified metrics to identify strengths."}
              </p>
            </div>

            <div>
              <p className="font-semibold text-yellow-700">
                Development Focus
              </p>
              <p className="text-slate-600">
                {result.needsWork.length > 0
                  ? result.needsWork.join(", ")
                  : "No major weaknesses identified from available metrics."}
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-800">Recommendation</p>
              <p className="text-slate-600">
                Keep metrics current by age group and upload recent video so
                college coaches can evaluate the player accurately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function ScoreMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}/100</p>
    </div>
  );
}