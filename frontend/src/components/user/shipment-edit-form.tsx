type ShipmentEditFormProps = {
  shipmentId: string;
  editForm: {
    title: string;
    description: string;
    pickupAddress: string;
    deliveryAddress: string;
  };
  savingShipmentId: string | null;
  onEditFormChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onSaveEdit: (shipmentId: string) => void;
  onCancelEdit: () => void;
};

const INPUT_CLASS =
  "rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white";

export default function ShipmentEditForm({
  shipmentId,
  editForm,
  savingShipmentId,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit
}: ShipmentEditFormProps) {
  return (
    <div className="mt-4 rounded-xl border border-stone-200 bg-white/90 p-4">
      <p className="text-sm font-semibold text-stone-700">Edit Shipment</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <input
          className={INPUT_CLASS}
          value={editForm.title}
          onChange={(e) => onEditFormChange("title", e.target.value)}
          placeholder="Title"
        />
        <input
          className={INPUT_CLASS}
          value={editForm.description}
          onChange={(e) => onEditFormChange("description", e.target.value)}
          placeholder="Description"
        />
        <input
          className={INPUT_CLASS}
          value={editForm.pickupAddress}
          onChange={(e) => onEditFormChange("pickupAddress", e.target.value)}
          placeholder="Pickup address"
        />
        <input
          className={INPUT_CLASS}
          value={editForm.deliveryAddress}
          onChange={(e) => onEditFormChange("deliveryAddress", e.target.value)}
          placeholder="Delivery address"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onSaveEdit(shipmentId)}
          disabled={savingShipmentId === shipmentId}
          className="user-btn-primary px-3 py-1.5 text-xs"
        >
          {savingShipmentId === shipmentId ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancelEdit}
          className="user-btn-secondary px-3 py-1.5 text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
