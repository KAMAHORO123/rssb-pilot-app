import { Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";

type ShipmentSummaryCardProps = {
  shipment: Shipment | null;
};

export default function ShipmentSummaryCard({
  shipment
}: ShipmentSummaryCardProps) {
  return (
    <div className="user-surface p-5 md:p-6">
      <h2 className="text-base font-bold text-stone-900">Summary</h2>

      {!shipment ? (
        <p className="mt-3 text-sm text-stone-500">Loading...</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-stone-900">{shipment.title}</p>
              {shipment.description ? (
                <p className="mt-1 text-sm text-stone-500">
                  {shipment.description}
                </p>
              ) : null}
            </div>
            <ShipmentStatusBadge status={shipment.status} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="user-panel p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Pickup
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {shipment.pickupAddress}
              </p>
            </div>
            <div className="user-panel p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Delivery
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {shipment.deliveryAddress}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="user-panel p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Created
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {new Date(shipment.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="user-panel p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Courier
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {shipment.assignedCourier?.user.email ?? "Not assigned"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
