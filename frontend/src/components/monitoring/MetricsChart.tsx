'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import type { Metric } from '@/lib/api';

type MetricsChartProps = {
  metrics: Metric[];
};

export default function MetricsChart({ metrics }: MetricsChartProps) {
  const chartData = [...metrics]
    .reverse()
    .map((metric) => ({
      date: new Date(metric.recordedAt).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      cpu: metric.cpuUsage,
      ram: metric.ramUsage,
    }));

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Évolution CPU et RAM
      </h2>

      {chartData.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aucune donnée disponible pour afficher le graphique.
        </p>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU"
                stroke="#2563eb"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="ram"
                name="RAM"
                stroke="#9333ea"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}