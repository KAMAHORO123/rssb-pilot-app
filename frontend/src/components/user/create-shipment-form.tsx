type CreateShipmentFormProps = {
  form: {
    title: string;
    description: string;
    pickupAddress: string;
    deliveryAddress: string;
  };
  submitting: boolean;
  onChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CreateShipmentForm({
  form,
  submitting,
  onChange,
  onSubmit
}: CreateShipmentFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <input
        className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
        placeholder="Shipment title"
        required
      />
      <input
        className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Description (optional)"
      />
      <input
        className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
        value={form.pickupAddress}
        onChange={(e) => onChange("pickupAddress", e.target.value)}
        placeholder="Pickup address"
        required
      />
      <input
        className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
        value={form.deliveryAddress}
        onChange={(e) => onChange("deliveryAddress", e.target.value)}
        placeholder="Delivery address"
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="user-btn-primary w-full"
      >
        {submitting ? "Creating..." : "Create Shipment"}
      </button>
    </form>
  );
}
