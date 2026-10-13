type Segment<T extends string> = {
  value: T;
  label: string;
};

type SegmentedFilterProps<T extends string> = {
  value: T;
  counts: Record<T, number>;
  segments: Segment<T>[];
  colorScheme?: "slate" | "stone";
  onChange: (value: T) => void;
};

const INACTIVE_CLASSES = {
  slate: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  stone: "text-stone-600 hover:bg-white/70 hover:text-stone-900"
};

const BADGE_CLASSES = {
  slate: "bg-slate-100 text-slate-600",
  stone: "bg-stone-100 text-stone-600"
};

export default function SegmentedFilter<T extends string>({
  value,
  counts,
  segments,
  colorScheme = "slate",
  onChange
}: SegmentedFilterProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {segments.map((segment) => {
        const isActive = value === segment.value;

        return (
          <button
            key={segment.value}
            type="button"
            onClick={() => onChange(segment.value)}
            className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              isActive
                ? "segment-active text-white shadow-sm"
                : INACTIVE_CLASSES[colorScheme]
            }`}
          >
            <span>{segment.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isActive ? "bg-white/15 text-white" : BADGE_CLASSES[colorScheme]
              }`}
            >
              {counts[segment.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
