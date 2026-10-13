import { Shipment } from "../../lib/api";
import TrackingUpdateForm from "./tracking-update-form";
import ShipmentStatusBadge from "../shipment-status-badge";
import { TrackingFormState } from "../../lib/types";
import DeliveryStageStrip from "./delivery-stage-strip";
import AddressRoute from "../address-route";

type AssignedShipmentsListProps = {
  shipments: Shipment[];
  submittingId: string | null;
  getTrackingForm: (
    shipmentId: string,
    currentStatus: string
  ) => TrackingFormState;
  onTrackingFormChange: (
    shipmentId: string,
    currentStatus: string,
    field: keyof TrackingFormState,
    value: string
  ) => void;
  onTrackingSubmit: (shipmentId: string, currentStatus: string) => void;
};

export default function AssignedShipmentsList({
  shipments,
  submittingId,
  getTrackingForm,
  onTrackingFormChange,
  onTrackingSubmit
}: AssignedShipmentsListProps) {
  const sortedShipments = [...shipments].sort((left, right) => {
    const priority: Record<string, number> = {
      ASSIGNED: 0,
      PICKED_UP: 1,
      IN_TRANSIT: 2,
      DELIVERED: 3,
      CANCELLED: 4
    };

    return (priority[left.status] ?? 99) - (priority[right.status] ?? 99);
  });

  return (
    <div className="space-y-4">
      {sortedShipments.map((shipment) => (
        <div
          key={shipment.id}
          className="courier-surface overflow-hidden px-5 py-4 md:px-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {shipment.title}
                </h2>
                <ShipmentStatusBadge status={shipment.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Requested by {shipment.createdBy?.email ?? shipment.createdById}
              </p>
            </div>
            <span className="shrink-0 text-xs text-slate-400">
              {new Date(shipment.createdAt).toLocaleDateString()}
            </span>
          </div>

          <DeliveryStageStrip status={shipment.status} />

          <AddressRoute
            pickup={shipment.pickupAddress}
            delivery={shipment.deliveryAddress}
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {shipment.createdBy?.email ?? "Unknown customer"}
            </span>

            {shipment.status !== "DELIVERED" &&
            shipment.status !== "CANCELLED" ? (
              <a
                href={`/shipments/${shipment.id}`}
                className="courier-btn-secondary px-3 py-1.5 text-xs"
              >
                Track
              </a>
            ) : null}
          </div>

          <TrackingUpdateForm
            form={getTrackingForm(shipment.id, shipment.status)}
            currentStatus={shipment.status}
            submitting={submittingId === shipment.id}
            onChange={(field, value) =>
              onTrackingFormChange(shipment.id, shipment.status, field, value)
            }
            onSubmit={() => onTrackingSubmit(shipment.id, shipment.status)}
          />
        </div>
      ))}
    </div>
  );
}
