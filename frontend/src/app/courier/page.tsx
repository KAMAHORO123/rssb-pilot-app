"use client";

import FeedbackAlert from "../../components/feedback-alert";
import AssignedShipmentsList from "../../components/courier/assigned-shipments-list";
import CourierSidebar from "../../components/courier/courier-sidebar";
import CourierQueueHeader from "../../components/courier/courier-queue-header";
import useCourierShipments from "../../hooks/use-courier-shipments";

export default function CourierDashboardPage() {
  const {
    shipments,
    loading,
    feedback,
    courier,
    savingAvailability,
    selectedSegment,
    submittingId,
    readyNowCount,
    inTransitCount,
    completedCount,
    visibleShipments,
    setSelectedSegment,
    handleAvailabilityToggle,
    getTrackingForm,
    updateTrackingForm,
    handleTrackingSubmit
  } = useCourierShipments();

  return (
    <main className="courier-experience px-4 py-6 md:px-8 md:py-8">
      <div className="courier-page-shell">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <CourierSidebar
            courier={courier}
            savingAvailability={savingAvailability}
            selectedSegment={selectedSegment}
            shipmentsCount={shipments.length}
            readyNowCount={readyNowCount}
            inTransitCount={inTransitCount}
            completedCount={completedCount}
            onSegmentChange={setSelectedSegment}
            onToggleAvailability={handleAvailabilityToggle}
          />

          <section className="min-w-0">
            <CourierQueueHeader
              selectedSegment={selectedSegment}
              visibleShipmentsCount={visibleShipments.length}
              totalShipmentsCount={shipments.length}
            />

            <FeedbackAlert feedback={feedback} />

            {loading ? (
              <div className="courier-surface mt-4 px-6 py-8 text-sm text-slate-500">
                Loading deliveries...
              </div>
            ) : shipments.length === 0 ? (
              <div className="courier-surface mt-4 px-6 py-8">
                <h3 className="text-lg font-bold text-slate-900">
                  No assignments yet
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Shipments assigned to you will appear here.
                </p>
              </div>
            ) : visibleShipments.length === 0 ? (
              <div className="courier-surface mt-4 px-6 py-8">
                <h3 className="text-lg font-bold text-slate-900">
                  No matching deliveries
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different filter.
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <AssignedShipmentsList
                  shipments={visibleShipments}
                  submittingId={submittingId}
                  getTrackingForm={getTrackingForm}
                  onTrackingFormChange={updateTrackingForm}
                  onTrackingSubmit={handleTrackingSubmit}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
