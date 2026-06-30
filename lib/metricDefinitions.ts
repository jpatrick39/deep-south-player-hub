export const METRIC_DEFINITIONS = [
  {
    key: "exit_velocity",
    label: "Exit Velocity",
    unit: "mph",
    category: "Hitting",
  },
  {
    key: "bat_speed",
    label: "Bat Speed",
    unit: "mph",
    category: "Hitting",
  },
  {
    key: "pitch_velocity",
    label: "Pitch Velocity",
    unit: "mph",
    category: "Pitching",
  },
  {
    key: "fastball_velocity",
    label: "Fastball Velocity",
    unit: "mph",
    category: "Pitching",
  },
  {
    key: "catcher_velocity",
    label: "Catcher Velocity",
    unit: "mph",
    category: "Catching",
  },
  {
    key: "pop_time",
    label: "Pop Time",
    unit: "sec",
    category: "Catching",
  },
  {
    key: "infield_velocity",
    label: "Infield Velocity",
    unit: "mph",
    category: "Defense",
  },
  {
    key: "outfield_velocity",
    label: "Outfield Velocity",
    unit: "mph",
    category: "Defense",
  },
  {
    key: "sixty_yard_dash",
    label: "60 Yard Dash",
    unit: "sec",
    category: "Speed",
  },
  {
    key: "home_to_first",
    label: "Home to First",
    unit: "sec",
    category: "Speed",
  },
  {
    key: "vertical_jump",
    label: "Vertical Jump",
    unit: "in",
    category: "Athleticism",
  },
  {
    key: "broad_jump",
    label: "Broad Jump",
    unit: "in",
    category: "Athleticism",
  },
] as const;

export type MetricKey = (typeof METRIC_DEFINITIONS)[number]["key"];

export function getMetricDefinition(key: string) {
  return METRIC_DEFINITIONS.find((metric) => metric.key === key);
}