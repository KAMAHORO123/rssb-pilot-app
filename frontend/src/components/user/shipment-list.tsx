import { Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";
import AddressRoute from "../address-route";
import ShipmentEditForm from "./shipment-edit-form";

type ShipmentListProps = {
  shipments: Shipment[];
  editingShipmentId: string | null;
  editForm: {
    title: string;
    description: string;
    pickupAddress: string;
    deliveryAddress: string;
  };
  savingShipmentId: string | null;
  cancellingShipmentId: string | null;
  onStartEdit: (shipment: Shipment) => void;
  onEditFormChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onSaveEdit: (shipmentId: string) => void;
  onCancelEdit: () => void;
  onCancelShipment: (shipmentId: string) => void;
};

export default function ShipmentList({
  shipments,
  editingShipmentId,
  editForm,
  savingShipmentId,
  cancellingShipmentId,
  onStartEdit,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
  onCancelShipment
}: ShipmentListProps) {
  return (
    <div className="space-y-4">
      {shipments.map((shipment) => (
        <div
          key={shipment.id}
          className="user-surface overflow-hidden px-5 py-4 md:px-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-stone-900">
                  {shipment.title}
                </h2>
                <ShipmentStatusBadge status={shipment.status} />
              </div>
              {shipment.description ? (
                <p className="mt-1 text-sm text-stone-500">
                  {shipment.description}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 text-xs text-stone-400">
              {new Date(shipment.createdAt).toLocaleDateString()}
            </span>
          </div>

          <AddressRoute
            pickup={shipment.pickupAddress}
            delivery={shipment.deliveryAddress}
            colorScheme="stone"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              {shipment.assignedCourier?.user.email ?? "No courier assigned"}
            </span>

            <div className="flex items-center gap-2">
              <a
                className="user-btn-primary px-3 py-1.5 text-xs"
                href={`/shipments/${shipment.id}`}
              >
                Track
              </a>
              <button
                type="button"
                onClick={() => onStartEdit(shipment)}
                disabled={shipment.status !== "CREATED"}
                className="user-btn-secondary px-3 py-1.5 text-xs"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onCancelShipment(shipment.id)}
                disabled={
                  cancellingShipmentId === shipment.id ||
                  !["CREATED", "ASSIGNED"].includes(shipment.status)
                }
                className="user-btn-danger px-3 py-1.5 text-xs"
              >
                {cancellingShipmentId === shipment.id
                  ? "Cancelling..."
                  : "Cancel"}
              </button>
            </div>
          </div>

          {editingShipmentId === shipment.id ? (
            <ShipmentEditForm
              shipmentId={shipment.id}
              editForm={editForm}
              savingShipmentId={savingShipmentId}
              onEditFormChange={onEditFormChange}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
