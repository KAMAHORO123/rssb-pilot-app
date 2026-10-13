import { ShipmentMetrics } from "../../lib/api";

type StatusMixChartProps = {
  metrics: ShipmentMetrics;
};

export default function StatusMixChart({ metrics }: StatusMixChartProps) {
  const bars = [
    {
      label: "Created",
      value: metrics.created,
      color: "from-slate-500 to-slate-400"
    },
    {
      label: "Assigned",
      value: metrics.assigned,
      color: "from-amber-500 to-amber-400"
    },
    {
      label: "Picked Up",
      value: metrics.pickedUp ?? 0,
      color: "from-cyan-500 to-cyan-400"
    },
    {
      label: "In Transit",
      value: metrics.inTransit,
      color: "from-sky-500 to-sky-400"
    },
    {
      label: "Delivered",
      value: metrics.delivered,
      color: "from-emerald-500 to-emerald-400"
    },
    {
      label: "Cancelled",
      value: metrics.cancelled ?? 0,
      color: "from-rose-500 to-rose-400"
    }
  ];

  const maxValue = Math.max(...bars.map((item) => item.value), 1);

  return (
    <div className="admin-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">Status Mix</h2>
        <span className="text-xs text-slate-500">
          {bars.reduce((sum, bar) => sum + bar.value, 0)} total
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {bars.map((bar) => (
          <div key={bar.label} className="admin-panel p-3">
            <div className="mb-1.5 flex items-center justify-between text-sm text-slate-700">
              <span>{bar.label}</span>
              <span className="font-semibold">{bar.value}</span>
            </div>

            <div className="h-2.5 rounded-full bg-slate-100">
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r ${bar.color}`}
                style={{
                  width: `${(bar.value / maxValue) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
