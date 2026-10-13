"use client";

import FeedbackAlert from "../../components/feedback-alert";
import ShipmentList from "../../components/user/shipment-list";
import UserDashboardSidebar from "../../components/user/user-dashboard-sidebar";
import useUserShipments from "../../hooks/use-user-shipments";

export default function UserDashboardPage() {
  const {
    shipments,
    loading,
    form,
    submitting,
    feedback,
    editingShipmentId,
    editForm,
    savingShipmentId,
    cancellingShipmentId,
    selectedSegment,
    searchQuery,
    isCreatePanelOpen,
    segmentCounts,
    visibleShipments,
    selectedSegmentLabel,
    setSelectedSegment,
    setSearchQuery,
    setIsCreatePanelOpen,
    setEditingShipmentId,
    handleFormChange,
    handleSubmit,
    startEdit,
    handleEditFormChange,
    handleSaveEdit,
    handleCancelShipment
  } = useUserShipments();

  return (
    <main className="user-experience px-4 py-6 md:px-8 md:py-8">
      <div className="user-page-shell">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <UserDashboardSidebar
            totalShipments={shipments.length}
            activeShipments={segmentCounts.ACTIVE}
            deliveredShipments={segmentCounts.COMPLETED}
            cancelledShipments={segmentCounts.CANCELLED}
            selectedSegment={selectedSegment}
            searchQuery={searchQuery}
            createForm={form}
            isCreatePanelOpen={isCreatePanelOpen}
            submitting={submitting}
            onSegmentChange={setSelectedSegment}
            onSearchChange={setSearchQuery}
            onToggleCreatePanel={() => setIsCreatePanelOpen((prev) => !prev)}
            onCreateFormChange={handleFormChange}
            onCreateSubmit={handleSubmit}
          />

          <section className="min-w-0">
            <div className="user-surface px-5 py-4 md:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900">
                  {selectedSegmentLabel}
                </h2>
                <p className="text-sm text-stone-400">
                  {visibleShipments.length} of {shipments.length}
                </p>
              </div>
              {searchQuery.trim() ? (
                <p className="mt-1 text-xs text-stone-400">
                  Searching: {searchQuery.trim()}
                </p>
              ) : null}
              <FeedbackAlert feedback={feedback} />
            </div>

            {loading ? (
              <div className="user-surface mt-4 px-5 py-8 text-center text-sm text-stone-500">
                Loading shipments...
              </div>
            ) : shipments.length === 0 ? (
              <div className="user-surface mt-4 px-5 py-10 text-center">
                <p className="text-lg font-semibold text-stone-900">
                  No shipments yet
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Create your first shipment using the panel on the left.
                </p>
              </div>
            ) : visibleShipments.length === 0 ? (
              <div className="user-surface mt-4 px-5 py-10 text-center">
                <p className="text-lg font-semibold text-stone-900">
                  No matching shipments
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Try adjusting the filters or search query.
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <ShipmentList
                  shipments={visibleShipments}
                  editingShipmentId={editingShipmentId}
                  editForm={editForm}
                  savingShipmentId={savingShipmentId}
                  cancellingShipmentId={cancellingShipmentId}
                  onStartEdit={startEdit}
                  onEditFormChange={handleEditFormChange}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingShipmentId(null)}
                  onCancelShipment={handleCancelShipment}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
