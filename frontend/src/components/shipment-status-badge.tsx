type ShipmentStatusBadgeProps = {
  status: string;
};

export default function ShipmentStatusBadge({
  status
}: ShipmentStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        status === "DELIVERED"
          ? "bg-green-100 text-green-800"
          : status === "IN_TRANSIT"
            ? "bg-blue-100 text-blue-800"
            : status === "PICKED_UP"
              ? "bg-cyan-100 text-cyan-800"
              : status === "ASSIGNED"
                ? "bg-yellow-100 text-yellow-800"
                : status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
