import { Shipment } from "../../lib/api";

type AdminAttentionListProps = {
  shipments: Shipment[];
};

export default function AdminAttentionList({
  shipments
}: AdminAttentionListProps) {
  if (shipments.length === 0) {
    return (
      <p className="text-sm text-slate-500">No items need immediate review.</p>
    );
  }

  return (
    <div className="space-y-2">
      {shipments.map((shipment) => (
        <div
          key={shipment.id}
          className="admin-panel flex items-center justify-between p-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-950">
              {shipment.title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {shipment.pickupAddress} → {shipment.deliveryAddress}
            </p>
          </div>

          <span className="shrink-0 text-xs text-slate-500">
            {shipment.assignedCourier?.user.email ?? "Unassigned"}
          </span>
        </div>
      ))}
    </div>
  );
}
