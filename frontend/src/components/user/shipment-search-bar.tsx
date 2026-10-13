type ShipmentSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ShipmentSearchBar({
  value,
  onChange
}: ShipmentSearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-3 py-2.5">
      <svg
        className="h-4 w-4 text-stone-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
        placeholder="Search shipments..."
        aria-label="Search shipments"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
