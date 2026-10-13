import { Courier, Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";

type ShipmentAssignmentPanelProps = {
  shipments: Shipment[];
  couriers: Courier[];
  selectedCouriers: Record<string, string>;
  assigningId: string | null;
  onSelectCourier: (shipmentId: string, courierId: string) => void;
  onAssignCourier: (shipmentId: string) => void;
};

export default function ShipmentAssignmentPanel({
  shipments,
  couriers,
  selectedCouriers,
  assigningId,
  onSelectCourier,
  onAssignCourier
}: ShipmentAssignmentPanelProps) {
  return (
    <div className="admin-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">Dispatch Queue</h2>
        <span className="text-xs text-slate-500">
          {shipments.length} shipments
        </span>
      </div>

      {shipments.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No shipments to display.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="admin-panel p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-950">
                      {shipment.title}
                    </h3>
                    <ShipmentStatusBadge status={shipment.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {shipment.pickupAddress} → {shipment.deliveryAddress}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(shipment.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>
                  By: {shipment.createdBy?.email ?? shipment.createdById}
                </span>
                <span>
                  Courier:{" "}
                  {shipment.assignedCourier?.user.email ?? "Unassigned"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                  value={selectedCouriers[shipment.id] || ""}
                  onChange={(e) => onSelectCourier(shipment.id, e.target.value)}
                >
                  <option value="">Select courier</option>
                  {couriers.map((courier) => (
                    <option
                      key={courier.id}
                      value={courier.id}
                      disabled={!courier.availability}
                    >
                      {courier.user.email}
                      {courier.vehicleType ? ` (${courier.vehicleType})` : ""}
                      {courier.availability === false ? " [Unavailable]" : ""}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => onAssignCourier(shipment.id)}
                  disabled={
                    assigningId === shipment.id ||
                    !selectedCouriers[shipment.id]
                  }
                  className="admin-btn-primary px-4 py-2 text-xs"
                >
                  {assigningId === shipment.id ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
