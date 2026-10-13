import { Courier } from "../../lib/api";

type AvailabilityPanelProps = {
  courier: Courier | null;
  saving: boolean;
  onToggle: () => void;
};

export default function AvailabilityPanel({
  courier,
  saving,
  onToggle
}: AvailabilityPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/90">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="courier-label">Availability</p>
          <p className="mt-1 text-sm text-slate-600">
            {courier?.availability ? "Accepting jobs" : "Not accepting jobs"}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          disabled={!courier || saving}
          className={`courier-btn-primary px-4 py-2 text-xs ${
            courier?.availability
              ? ""
              : "!bg-none !bg-slate-600 !shadow-slate-600/15"
          }`}
        >
          {saving
            ? "Saving..."
            : courier?.availability
              ? "Mark unavailable"
              : "Mark available"}
        </button>
      </div>

      {courier ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200/80 px-4 py-3 text-xs text-slate-500">
          <span>{courier.user.email}</span>
          <span>{courier.vehicleType ?? "No vehicle"}</span>
          <span>{courier._count?.shipments ?? 0} shipments</span>
        </div>
      ) : null}
    </div>
  );
}
