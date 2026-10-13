import SegmentedFilter from "../segmented-filter";

type CourierSegment = "ALL" | "READY_NOW" | "IN_TRANSIT" | "COMPLETED";

const COURIER_SEGMENTS: Array<{ value: CourierSegment; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "READY_NOW", label: "Ready" },
  { value: "IN_TRANSIT", label: "Transit" },
  { value: "COMPLETED", label: "Done" }
];

type CourierSegmentedFilterProps = {
  value: CourierSegment;
  counts: Record<CourierSegment, number>;
  onChange: (value: CourierSegment) => void;
};

export default function CourierSegmentedFilter({
  value,
  counts,
  onChange
}: CourierSegmentedFilterProps) {
  return (
    <SegmentedFilter
      value={value}
      counts={counts}
      segments={COURIER_SEGMENTS}
      colorScheme="slate"
      onChange={onChange}
    />
  );
}

export type { CourierSegment };
