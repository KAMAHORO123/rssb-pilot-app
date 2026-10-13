import { Shipment } from "../../lib/api";
import ShipmentStatusBadge from "../shipment-status-badge";

type TrackingHeroProps = {
  shipment: Shipment | null;
};

export default function TrackingHero({ shipment }: TrackingHeroProps) {
  return (
    <section className="user-hero px-6 py-6 md:px-8 md:py-8">
      <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="user-label">Live Tracking</p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
            {shipment?.title || "Loading..."}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {shipment?.status ? (
            <ShipmentStatusBadge status={shipment.status} />
          ) : (
            <span className="user-chip text-xs">Loading</span>
          )}
          <span className="text-xs text-stone-500">
            {shipment?.assignedCourier?.user.email ?? "No courier"}
          </span>
          {shipment?.createdAt ? (
            <span className="text-xs text-stone-400">
              {new Date(shipment.createdAt).toLocaleDateString()}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
