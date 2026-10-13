import ShipmentStatusBadge from "../shipment-status-badge";
import { ShipmentUpdate } from "../../lib/types";

type CurrentStatusCardProps = {
  lastEvent: ShipmentUpdate | null;
};

export default function CurrentStatusCard({
  lastEvent
}: CurrentStatusCardProps) {
  return (
    <div className="user-surface p-5 md:p-6">
      <h2 className="text-base font-bold text-stone-900">Latest Update</h2>

      {lastEvent ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <ShipmentStatusBadge status={lastEvent.status} />
            <span className="text-xs text-stone-400">
              {lastEvent.createdAt
                ? new Date(lastEvent.createdAt).toLocaleString()
                : "Unknown"}
            </span>
          </div>

          <div className="user-panel p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Note
            </p>
            <p className="mt-1 text-sm text-stone-700">
              {lastEvent.note || "No note provided"}
            </p>
          </div>

          {(lastEvent.locationLat || lastEvent.locationLng) && (
            <div className="user-panel p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Coordinates
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {lastEvent.locationLat ?? "-"}, {lastEvent.locationLng ?? "-"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/70 p-4">
          <p className="text-sm font-medium text-stone-600">
            Waiting for the first courier update.
          </p>
        </div>
      )}
    </div>
  );
}
