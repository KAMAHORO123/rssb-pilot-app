"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToLoginIfUnauthorized } from "../lib/route-guards";
import {
  cancelShipment,
  createShipment,
  fetchShipments,
  Shipment,
  updateShipment
} from "../lib/api";
import { FeedbackState } from "../lib/types";
import { ShipmentSegment } from "../components/user/shipment-segmented-filter";

type ShipmentFormFields = {
  title: string;
  description: string;
  pickupAddress: string;
  deliveryAddress: string;
};

type ShipmentFormField = keyof ShipmentFormFields;

const EMPTY_FORM: ShipmentFormFields = {
  title: "",
  description: "",
  pickupAddress: "",
  deliveryAddress: ""
};

export default function useUserShipments() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ShipmentFormFields>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(
    null
  );
  const [savingShipmentId, setSavingShipmentId] = useState<string | null>(null);
  const [cancellingShipmentId, setCancellingShipmentId] = useState<
    string | null
  >(null);
  const [selectedSegment, setSelectedSegment] =
    useState<ShipmentSegment>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(true);
  const [editForm, setEditForm] = useState<ShipmentFormFields>(EMPTY_FORM);

  function handleFormChange(field: ShipmentFormField, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const created = await createShipment({
        title: form.title,
        description: form.description || undefined,
        pickupAddress: form.pickupAddress,
        deliveryAddress: form.deliveryAddress
      });

      setShipments((prev) => [created, ...prev]);
      setIsCreatePanelOpen(false);
      setForm(EMPTY_FORM);
      setFeedback({
        type: "success",
        message: "Shipment created successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to create shipment."
      });
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(shipment: Shipment) {
    setEditingShipmentId(shipment.id);
    setEditForm({
      title: shipment.title,
      description: shipment.description ?? "",
      pickupAddress: shipment.pickupAddress,
      deliveryAddress: shipment.deliveryAddress
    });
  }

  function handleEditFormChange(field: ShipmentFormField, value: string) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveEdit(shipmentId: string) {
    setSavingShipmentId(shipmentId);
    setFeedback(null);

    try {
      const updated = await updateShipment(shipmentId, {
        title: editForm.title,
        description: editForm.description || undefined,
        pickupAddress: editForm.pickupAddress,
        deliveryAddress: editForm.deliveryAddress
      });

      setShipments((prev) =>
        prev.map((s) => (s.id === shipmentId ? updated : s))
      );
      setEditingShipmentId(null);
      setFeedback({
        type: "success",
        message: "Shipment updated successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update shipment."
      });
    } finally {
      setSavingShipmentId(null);
    }
  }

  async function handleCancelShipment(shipmentId: string) {
    setCancellingShipmentId(shipmentId);
    setFeedback(null);

    try {
      const cancelled = await cancelShipment(shipmentId);
      setShipments((prev) =>
        prev.map((s) => (s.id === shipmentId ? cancelled : s))
      );
      setEditingShipmentId((prev) => (prev === shipmentId ? null : prev));
      setFeedback({
        type: "success",
        message: "Shipment cancelled successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to cancel shipment."
      });
    } finally {
      setCancellingShipmentId(null);
    }
  }

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["USER"])) {
      return;
    }

    setFeedback(null);

    fetchShipments({ limit: 100 })
      .then((res) => {
        setShipments(res.data);
        setIsCreatePanelOpen(res.data.length === 0);
      })
      .catch(() => {
        setFeedback({
          type: "error",
          message: "Failed to load shipments."
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const segmentCounts = useMemo(
    () => ({
      ALL: shipments.length,
      ACTIVE: shipments.filter((s) =>
        ["CREATED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(s.status)
      ).length,
      COMPLETED: shipments.filter((s) => s.status === "DELIVERED").length,
      CANCELLED: shipments.filter((s) => s.status === "CANCELLED").length
    }),
    [shipments]
  );

  const visibleShipments = useMemo(
    () =>
      shipments.filter((shipment) => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const matchesSegment =
          selectedSegment === "ALL"
            ? true
            : selectedSegment === "ACTIVE"
              ? ["CREATED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(
                  shipment.status
                )
              : selectedSegment === "COMPLETED"
                ? shipment.status === "DELIVERED"
                : shipment.status === "CANCELLED";

        const matchesSearch =
          normalizedQuery.length === 0
            ? true
            : [
                shipment.title,
                shipment.pickupAddress,
                shipment.deliveryAddress,
                shipment.description ?? ""
              ]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);

        return matchesSegment && matchesSearch;
      }),
    [shipments, selectedSegment, searchQuery]
  );

  const selectedSegmentLabel =
    selectedSegment === "ALL"
      ? "All Shipments"
      : selectedSegment === "ACTIVE"
        ? "In Progress"
        : selectedSegment === "COMPLETED"
          ? "Delivered"
          : "Cancelled";

  return {
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
  };
}
