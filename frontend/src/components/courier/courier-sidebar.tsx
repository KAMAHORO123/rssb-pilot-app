import { Courier } from "../../lib/api";
import AvailabilityPanel from "./availability-panel";
import CourierSegmentedFilter, {
  CourierSegment
} from "./courier-segmented-filter";

type CourierSidebarProps = {
  courier: Courier | null;
  savingAvailability: boolean;
  selectedSegment: CourierSegment;
  shipmentsCount: number;
  readyNowCount: number;
  inTransitCount: number;
  completedCount: number;
  onSegmentChange: (value: CourierSegment) => void;
  onToggleAvailability: () => void;
};

export default function CourierSidebar({
  courier,
  savingAvailability,
  selectedSegment,
  shipmentsCount,
  readyNowCount,
  inTransitCount,
  completedCount,
  onSegmentChange,
  onToggleAvailability
}: CourierSidebarProps) {
  return (
    <aside className="space-y-4">
      <section className="courier-hero px-5 py-4 text-white md:px-6">
        <div className="relative z-10">
          <h1 className="courier-display text-2xl font-semibold leading-none">
            Delivery Console
          </h1>
        </div>
      </section>

      <section className="courier-surface px-5 py-5">
        <div className="space-y-5">
          <AvailabilityPanel
            courier={courier}
            saving={savingAvailability}
            onToggle={onToggleAvailability}
          />

          <CourierSegmentedFilter
            value={selectedSegment}
            counts={{
              ALL: shipmentsCount,
              READY_NOW: readyNowCount,
              IN_TRANSIT: inTransitCount,
              COMPLETED: completedCount
            }}
            onChange={onSegmentChange}
          />
        </div>
      </section>
    </aside>
  );
}
