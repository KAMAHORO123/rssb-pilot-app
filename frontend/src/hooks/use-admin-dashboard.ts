"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToLoginIfUnauthorized } from "../lib/route-guards";
import {
  AdminUser,
  assignCourierToShipment,
  AuditLog,
  Courier,
  fetchAuditLogs,
  fetchCouriers,
  fetchShipments,
  fetchShipmentMetrics,
  fetchUsers,
  Shipment,
  ShipmentFilters,
  ShipmentMetrics,
  updateUserRole
} from "../lib/api";
import { AdminTabKey, AuditLogFilters, FeedbackState } from "../lib/types";

export default function useAdminDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<ShipmentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCouriers, setSelectedCouriers] = useState<
    Record<string, string>
  >({});
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
    {}
  );
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [shipmentFilters, setShipmentFilters] = useState<ShipmentFilters>({
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [auditFilters, setAuditFilters] = useState<AuditLogFilters>({
    actionType: "",
    targetType: "",
    actorUserId: "",
    sortOrder: "desc"
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedUserAuditLogs, setSelectedUserAuditLogs] = useState<
    AuditLog[]
  >([]);
  const [activeTab, setActiveTab] = useState<AdminTabKey>("overview");

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["ADMIN"])) {
      return;
    }

    setFeedback(null);

    fetchShipmentMetrics()
      .then((data) => setMetrics(data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load admin metrics."
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["ADMIN"])) {
      return;
    }

    fetchShipments({ ...shipmentFilters, limit: 100 })
      .then((res) => setShipments(res.data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to load shipments."
        });
      });
  }, [router, shipmentFilters]);

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["ADMIN"])) {
      return;
    }

    fetchCouriers()
      .then((data) => setCouriers(data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to load couriers."
        });
      });

    fetchUsers()
      .then((data) => setUsers(data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to load users."
        });
      });
  }, [router]);

  useEffect(() => {
    if (!redirectToLoginIfUnauthorized(router, ["ADMIN"])) {
      return;
    }

    fetchAuditLogs(auditFilters)
      .then((data) => setAuditLogs(data))
      .catch((error) => {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load audit logs."
        });
      });
  }, [router, auditFilters]);

  function handleCourierSelect(shipmentId: string, courierId: string) {
    setSelectedCouriers((prev) => ({ ...prev, [shipmentId]: courierId }));
  }

  function handleShipmentFilterChange(
    field: keyof ShipmentFilters,
    value: string
  ) {
    setShipmentFilters((prev) => ({ ...prev, [field]: value || undefined }));
  }

  function handleAuditFilterChange(
    field: keyof AuditLogFilters,
    value: string
  ) {
    setAuditFilters((prev) => ({
      ...prev,
      [field]:
        field === "sortOrder" ? (value as AuditLogFilters["sortOrder"]) : value
    }));
  }

  async function handleAssignCourier(shipmentId: string) {
    const courierId = selectedCouriers[shipmentId];
    if (!courierId) return;

    setAssigningId(shipmentId);
    setFeedback(null);

    try {
      await assignCourierToShipment(shipmentId, courierId);

      const refreshedShipments = await fetchShipments({
        ...shipmentFilters,
        limit: 100
      });
      setShipments(refreshedShipments.data);

      const refreshedAuditLogs = await fetchAuditLogs(auditFilters);
      setAuditLogs(refreshedAuditLogs);

      setFeedback({
        type: "success",
        message: "Courier assigned successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to assign courier."
      });
    } finally {
      setAssigningId(null);
    }
  }

  function handleRoleSelect(userId: string, role: string) {
    setSelectedRoles((prev) => ({ ...prev, [userId]: role }));
  }

  async function handleUpdateUserRole(userId: string) {
    const role = selectedRoles[userId];
    if (!role) return;

    setUpdatingUserId(userId);
    setFeedback(null);

    try {
      await updateUserRole(userId, role);

      const refreshedUsers = await fetchUsers();
      setUsers(refreshedUsers);

      const refreshedCouriers = await fetchCouriers();
      setCouriers(refreshedCouriers);

      const refreshedAuditLogs = await fetchAuditLogs(auditFilters);
      setAuditLogs(refreshedAuditLogs);

      setFeedback({
        type: "success",
        message: "User role updated successfully."
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update user role."
      });
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleInspectUser(user: AdminUser) {
    setSelectedUser(user);
    setActiveTab("users");

    try {
      const relatedLogs = await fetchAuditLogs({
        targetType: "User",
        targetId: user.id,
        sortOrder: "desc"
      });
      setSelectedUserAuditLogs(relatedLogs.slice(0, 5));
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load related audit logs."
      });
    }
  }

  const activeShipments = useMemo(
    () =>
      shipments.filter((s) =>
        ["CREATED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELAYED"].includes(
          s.status
        )
      ),
    [shipments]
  );
  const pendingAssignments = useMemo(
    () =>
      shipments.filter((s) => s.status === "CREATED" && !s.assignedCourierId),
    [shipments]
  );
  const overviewPreview = useMemo(() => {
    const delayedOrTransit = shipments.filter((s) =>
      ["IN_TRANSIT", "DELAYED"].includes(s.status)
    );
    return pendingAssignments
      .concat(
        delayedOrTransit.filter(
          (s) => !pendingAssignments.some((p) => p.id === s.id)
        )
      )
      .slice(0, 4);
  }, [shipments, pendingAssignments]);

  return {
    metrics,
    loading,
    shipments,
    couriers,
    selectedCouriers,
    assigningId,
    users,
    selectedRoles,
    updatingUserId,
    feedback,
    shipmentFilters,
    auditFilters,
    auditLogs,
    selectedUser,
    selectedUserAuditLogs,
    activeTab,
    activeShipments,
    pendingAssignments,
    overviewPreview,
    setActiveTab,
    handleCourierSelect,
    handleShipmentFilterChange,
    handleAuditFilterChange,
    handleAssignCourier,
    handleRoleSelect,
    handleUpdateUserRole,
    handleInspectUser
  };
}
