"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PlayerMetrics({ metrics }: { metrics: any[] }) {
  const latestByType: Record<string, any> = {};

  metrics.forEach((metric) => {
    if (!latestByType[metric.metric_type]) {
      latestByType[metric.metric_type] = metric;
    }
  });

  const cardMetrics = [
    "Exit Velocity",
    "Bat Speed",
    "60 Yard Dash",
    "Pop Time",
    "Pitch Velocity",
    "Infield Velocity",
    "Outfield Velocity",
  ];

  const exitVeloData = metrics
    .filter((m) => m.metric_type === "Exit Velocity")
    .reverse()
    .map((m) => ({
      date: new Date(m.created_at).toLocaleDateString(),
      value: Number(m.value),
    }));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Metric Cards</h2>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {cardMetrics.map((type) => {
          const metric = latestByType[type];

          return (
            <div key={type} className="border rounded-xl p-4 bg-gray-50">
              <p className="text-sm text-gray-500 uppercase">{type}</p>
              <p className="text-3xl font-bold mt-2">
                {metric ? `${metric.value} ${metric.unit}` : "-"}
              </p>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold mb-4">Progress Chart</h2>

      <div className="border rounded-xl p-4 bg-gray-50 h-80">
        {exitVeloData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={exitVeloData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">
            Add at least two Exit Velocity entries to see a progress chart.
          </p>
        )}
      </div>
    </div>
  );
}