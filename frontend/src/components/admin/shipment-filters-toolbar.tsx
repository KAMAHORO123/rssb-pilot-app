import { Courier, ShipmentFilters } from "../../lib/api";

type ShipmentFiltersToolbarProps = {
  filters: ShipmentFilters;
  couriers: Courier[];
  onChange: (field: keyof ShipmentFilters, value: string) => void;
};

export default function ShipmentFiltersToolbar({
  filters,
  couriers,
  onChange
}: ShipmentFiltersToolbarProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <input
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
        placeholder="Search title or address"
        value={filters.search ?? ""}
        onChange={(e) => onChange("search", e.target.value)}
      />

      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
        value={filters.status ?? ""}
        onChange={(e) => onChange("status", e.target.value)}
      >
        <option value="">All statuses</option>
        <option value="CREATED">CREATED</option>
        <option value="ASSIGNED">ASSIGNED</option>
        <option value="PICKED_UP">PICKED_UP</option>
        <option value="IN_TRANSIT">IN_TRANSIT</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="DELAYED">DELAYED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
        value={filters.assignedCourierId ?? ""}
        onChange={(e) => onChange("assignedCourierId", e.target.value)}
      >
        <option value="">All couriers</option>
        {couriers.map((courier) => (
          <option key={courier.id} value={courier.id}>
            {courier.user.email}
          </option>
        ))}
      </select>

      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
        value={filters.sortBy ?? "createdAt"}
        onChange={(e) =>
          onChange(
            "sortBy",
            e.target.value as ShipmentFilters["sortBy"] & string
          )
        }
      >
        <option value="createdAt">Sort by date</option>
        <option value="title">Sort by title</option>
        <option value="status">Sort by status</option>
      </select>

      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
        value={filters.sortOrder ?? "desc"}
        onChange={(e) =>
          onChange(
            "sortOrder",
            e.target.value as ShipmentFilters["sortOrder"] & string
          )
        }
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </div>
  );
}
