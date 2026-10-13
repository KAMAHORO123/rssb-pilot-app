type AddressRouteProps = {
  pickup: string;
  delivery: string;
  colorScheme?: "slate" | "stone";
};

const TEXT_CLASSES = {
  slate: "text-slate-600",
  stone: "text-stone-600"
};

const ARROW_CLASSES = {
  slate: "text-slate-400",
  stone: "text-stone-400"
};

export default function AddressRoute({
  pickup,
  delivery,
  colorScheme = "slate"
}: AddressRouteProps) {
  return (
    <div
      className={`mt-3 flex items-center gap-2 text-sm ${TEXT_CLASSES[colorScheme]}`}
    >
      <span className="font-medium">{pickup}</span>
      <svg
        className={`h-4 w-4 shrink-0 ${ARROW_CLASSES[colorScheme]}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
        />
      </svg>
      <span className="font-medium">{delivery}</span>
    </div>
  );
}
