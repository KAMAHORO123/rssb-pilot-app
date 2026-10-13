import SegmentedFilter from "../segmented-filter";

type ShipmentSegment = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const SHIPMENT_SEGMENTS: Array<{ value: ShipmentSegment; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" }
];

type ShipmentSegmentedFilterProps = {
  value: ShipmentSegment;
  counts: Record<ShipmentSegment, number>;
  onChange: (value: ShipmentSegment) => void;
};

export default function ShipmentSegmentedFilter({
  value,
  counts,
  onChange
}: ShipmentSegmentedFilterProps) {
  return (
    <SegmentedFilter
      value={value}
      counts={counts}
      segments={SHIPMENT_SEGMENTS}
      colorScheme="stone"
      onChange={onChange}
    />
  );
}

export type { ShipmentSegment };
