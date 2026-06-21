export function calculateProfileCompletion(
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
      label: "Recruiting Video",
      complete:
        !!player.recruiting_video_url ||
        !!player.hitting_video_url ||
        !!player.fielding_video_url ||
        !!player.pitching_video_url,
    },
    {
      label: "Metrics",
      complete: metrics.length > 0,
    },
    {
      label: "College Interests",
      complete: collegeInterests.length > 0,
    },
  ];

  const completed = checks.filter((check) => check.complete).length;
  const percent = Math.round((completed / checks.length) * 100);

  return {
    percent,
    checks,
    completed,
    total: checks.length,
  };
}