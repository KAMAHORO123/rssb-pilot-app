import CollapsibleCreateShipmentPanel from "./collapsible-create-shipment-panel";
import ShipmentSearchBar from "./shipment-search-bar";
import ShipmentSegmentedFilter, {
  ShipmentSegment
} from "./shipment-segmented-filter";

type CreateShipmentFormState = {
  title: string;
  description: string;
  pickupAddress: string;
  deliveryAddress: string;
};

type UserDashboardSidebarProps = {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  cancelledShipments: number;
  selectedSegment: ShipmentSegment;
  searchQuery: string;
  createForm: CreateShipmentFormState;
  isCreatePanelOpen: boolean;
  submitting: boolean;
  onSegmentChange: (value: ShipmentSegment) => void;
  onSearchChange: (value: string) => void;
  onToggleCreatePanel: () => void;
  onCreateFormChange: (
    field: "title" | "description" | "pickupAddress" | "deliveryAddress",
    value: string
  ) => void;
  onCreateSubmit: (e: React.FormEvent) => void;
};

export default function UserDashboardSidebar({
  totalShipments,
  activeShipments,
  deliveredShipments,
  cancelledShipments,
  selectedSegment,
  searchQuery,
  createForm,
  isCreatePanelOpen,
  submitting,
  onSegmentChange,
  onSearchChange,
  onToggleCreatePanel,
  onCreateFormChange,
  onCreateSubmit
}: UserDashboardSidebarProps) {
  return (
    <aside className="space-y-4">
      <section className="user-surface px-5 py-5">
        <div className="space-y-5">
          <h1 className="text-xl font-bold text-stone-900">My Shipments</h1>

          <CollapsibleCreateShipmentPanel
            form={createForm}
            isOpen={isCreatePanelOpen}
            submitting={submitting}
            onToggle={onToggleCreatePanel}
            onChange={onCreateFormChange}
            onSubmit={onCreateSubmit}
          />

          <ShipmentSearchBar value={searchQuery} onChange={onSearchChange} />

          <ShipmentSegmentedFilter
            value={selectedSegment}
            counts={{
              ALL: totalShipments,
              ACTIVE: activeShipments,
              COMPLETED: deliveredShipments,
              CANCELLED: cancelledShipments
            }}
            onChange={onSegmentChange}
          />
        </div>
      </section>
    </aside>
  );
}
