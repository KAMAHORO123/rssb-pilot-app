import { ShipmentUpdate } from "../../lib/types";

type TrackingHistoryListProps = {
  events: ShipmentUpdate[];
};

export default function TrackingHistoryList({
  events
}: TrackingHistoryListProps) {
  return (
    <div className="user-surface p-5 md:p-6">
      <h2 className="text-base font-bold text-stone-900">Activity</h2>

      {events.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/70 p-4">
          <p className="text-sm text-stone-500">No events recorded yet.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {events.map((event, index) => (
            <li
              key={event.id ?? `${event.shipmentId}-${index}`}
              className="relative pl-6"
            >
              <span className="timeline-dot absolute left-0 top-2.5 h-2.5 w-2.5 rounded-full bg-slate-900" />
              {index !== events.length - 1 ? (
                <span className="timeline-line absolute left-[0.3rem] top-5 h-[calc(100%+0.5rem)] w-px bg-stone-200" />
              ) : null}

              <div className="rounded-xl border border-stone-200 bg-stone-50/75 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {event.status.replace("_", " ")}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      {event.createdAt
                        ? new Date(event.createdAt).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                  {(event.locationLat || event.locationLng) && (
                    <span className="text-xs text-stone-400">
                      {event.locationLat}, {event.locationLng}
                    </span>
                  )}
                </div>
                {event.note ? (
                  <p className="mt-2 text-sm text-stone-600">{event.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
