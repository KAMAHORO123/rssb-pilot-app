import CreateShipmentForm from "./create-shipment-form";

type CreateShipmentFormState = {
  title: string;
  description: string;
  pickupAddress: string;
  deliveryAddress: string;
};

type CollapsibleCreateShipmentPanelProps = {
  form: CreateShipmentFormState;
  isOpen: boolean;
  submitting: boolean;
  onToggle: () => void;
  onChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CollapsibleCreateShipmentPanel({
  form,
  isOpen,
  submitting,
  onToggle,
  onChange,
  onSubmit
}: CollapsibleCreateShipmentPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white/78 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold text-stone-700">New Shipment</p>
        <button
          type="button"
          onClick={onToggle}
          className="user-btn-primary px-3 py-1.5 text-xs"
        >
          {isOpen ? "Hide" : "Create"}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-stone-200/80 px-4 pb-4">
          <CreateShipmentForm
            form={form}
            submitting={submitting}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
      ) : null}
    </section>
  );
}
