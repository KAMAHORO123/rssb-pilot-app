import { CourierSegment } from "./courier-segmented-filter";

type CourierQueueHeaderProps = {
  selectedSegment: CourierSegment;
  visibleShipmentsCount: number;
  totalShipmentsCount: number;
};

export default function CourierQueueHeader({
  selectedSegment,
  visibleShipmentsCount,
  totalShipmentsCount
}: CourierQueueHeaderProps) {
  return (
    <div className="courier-surface px-5 py-4 md:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">My Deliveries</h2>
        <p className="text-sm text-slate-500">
          {visibleShipmentsCount} of {totalShipmentsCount}
        </p>
      </div>
    </div>
  );
}
