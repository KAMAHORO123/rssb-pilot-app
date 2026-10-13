"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToLoginIfUnauthorized } from "../lib/route-guards";
import {
  createTrackingEvent,
  fetchMyCourier,
  fetchShipments,
  Shipment,
  updateMyCourierAvailability,
  Courier
} from "../lib/api";
import { FeedbackState, TrackingFormState } from "../lib/types";
import { CourierSegment } from "../components/courier/courier-segmented-filter";

function getDefaultNextStatus(currentStatus: string) {
  if (currentStatus === "ASSIGNED") return "PICKED_UP";
  if (currentStatus === "PICKED_UP") return "IN_TRANSIT";
  if (currentStatus === "IN_TRANSIT") return "DELIVERED";
  return "";
}

export default function useCourierShipments() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingForms, setTrackingForms] = useState<
    Record<string, TrackingFormState>
  >({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [courier, setCourier] = useState<Courier | null>(null);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<CourierSegment>("ALL");

  function getTrackingForm(
    shipmentId: string,
    currentStatus: string
  ): TrackingFormState {
    return (
      trackingForms[shipmentId] || {
        status: getDefaultNextStatus(currentStatus),
        note: "",
        locationLat: "",
        locationLng: ""
      }
    );
  }

  function updateTrackingForm(
    shipmentId: string,
    currentStatus: string,
    field: keyof TrackingFormState,
    value: string
  ) {
    setTrackingForms((prev) => ({
      ...prev,
      [shipmentId]: {
        ...getTrackingForm(shipmentId, currentStatus),
        [field]: value
      }
    }));
  }

  async function handleTrackingSubmit(
    shipmentId: string,
    currentStatus: string
  ) {
    const form = getTrackingForm(shipmentId, currentStatus);
    setSubmittingId(shipmentId);
    setFeedback(null);

    try {
      if (form.status === "DELIVERED" && !form.note.trim()) {
        throw new Error("A delivery note is required for delivered shipments.");
      }

      await createTrackingEvent(shipmentId, {
        status: form.status,
        note: form.note || undefined,
        locationLat: form.locationLat ? Number(form.locationLat) : undefined,
        locationLng: form.locationLng ? Number(form.locationLng) : undefined
      });

      const refreshed = await fetchShipments({ limit: 100 });
      setShipments(refreshed.data);

      setTrackingForms((prev) => ({
        ...prev,
        [shipmentId]: {
          status: getDefaultNextStatus(form.status),
          note: "",
          locationLat: "",
          locationLng: ""
        }
      }));

      setFeedback({
        type: "success",
        message: "Tracking updated successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update tracking."
      });
    } finally {
      setSubmittingId(null);
    }
  }

  async function handleAvailabilityToggle() {
    if (!courier) return;

    setSavingAvailability(true);
    setFeedback(null);

    try {
      const updated = await updateMyCourierAvailability(!courier.availability);
      setCourier(updated);
      setFeedback({
        type: "success",
        message: `Availability updated to ${
          updated.availability ? "available" : "unavailable"
        }.`
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update availability."
      });
    } finally {
      setSavingAvailability(false);
    }
  }

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["COURIER"])) {
      return;
    }

    setFeedback(null);

    fetchShipments({ limit: 100 })
      .then((res) => setShipments(res.data))
      .catch(() => {
        setFeedback({
          type: "error",
          message: "Failed to load assigned deliveries."
        });
      })
      .finally(() => setLoading(false));

    fetchMyCourier()
      .then((data) => setCourier(data))
      .catch(() => {
        // Keep the dashboard usable even if the profile card fails to load.
      });
  }, [router]);

  const readyNowCount = useMemo(
    () =>
      shipments.filter((s) => ["ASSIGNED", "PICKED_UP"].includes(s.status))
        .length,
    [shipments]
  );
  const inTransitCount = useMemo(
    () => shipments.filter((s) => s.status === "IN_TRANSIT").length,
    [shipments]
  );
  const completedCount = useMemo(
    () =>
      shipments.filter((s) => ["DELIVERED", "CANCELLED"].includes(s.status))
        .length,
    [shipments]
  );

  const visibleShipments = useMemo(
    () =>
      shipments.filter((shipment) => {
        if (selectedSegment === "READY_NOW") {
          return ["ASSIGNED", "PICKED_UP"].includes(shipment.status);
        }
        if (selectedSegment === "IN_TRANSIT") {
          return shipment.status === "IN_TRANSIT";
        }
        if (selectedSegment === "COMPLETED") {
          return ["DELIVERED", "CANCELLED"].includes(shipment.status);
        }
        return true;
      }),
    [shipments, selectedSegment]
  );

  return {
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
  };
}
