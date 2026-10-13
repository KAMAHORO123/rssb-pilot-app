import { Shipment } from "../../lib/api";
import { ShipmentUpdate } from "../../lib/types";

type ShipmentProgressCardProps = {
  shipment: Shipment | null;
  events: ShipmentUpdate[];
};

const STATUS_STEPS = [
  "CREATED",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED"
];

function getStatusIndex(status?: string) {
  if (!status) {
    return -1;
  }

  return STATUS_STEPS.indexOf(status);
}

export default function ShipmentProgressCard({
  shipment
}: ShipmentProgressCardProps) {
  const currentStatus = shipment?.status;
  const currentStepIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === "CANCELLED";

  return (
    <div className="user-surface p-5 md:p-6">
      <h2 className="text-base font-bold text-stone-900">Progress</h2>

      {!shipment ? (
        <p className="mt-3 text-sm text-stone-500">Loading...</p>
      ) : isCancelled ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            Shipment Cancelled
          </p>
          <p className="mt-1 text-sm text-red-700">
            This delivery was cancelled before completion.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {STATUS_STEPS.map((step, index) => {
            const isComplete = currentStepIndex >= index;
            const isCurrent = currentStatus === step;

            return (
              <div
                key={step}
                className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition ${
                  isCurrent
                    ? "progress-step-current border-transparent text-white"
                    : isComplete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-stone-200 bg-stone-50/80 text-stone-500"
                }`}
              >
                <span className="font-semibold">{step.replace("_", " ")}</span>
                <span
                  className={`text-xs ${isCurrent ? "text-slate-300" : ""}`}
                >
                  {isCurrent ? "Current" : isComplete ? "Done" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
