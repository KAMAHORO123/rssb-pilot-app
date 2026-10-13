"use client";

import AdminMetricsCards from "../../components/admin/metrics-cards";
import StatusMixChart from "../../components/admin/status-mix-chart";
import ShipmentAssignmentPanel from "../../components/admin/shipment-assignment-panel";
import UserRoleManagementPanel from "../../components/admin/user-role-management-panel";
import FeedbackAlert from "../../components/feedback-alert";
import ShipmentFiltersToolbar from "../../components/admin/shipment-filters-toolbar";
import AuditLogPanel from "../../components/admin/audit-log-panel";
import OperationsDetailPanel from "../../components/admin/operations-detail-panel";
import AdminCommandHero from "../../components/admin/admin-command-hero";
import AdminTabSwitcher from "../../components/admin/admin-tab-switcher";
import AdminSectionShell from "../../components/admin/admin-section-shell";
import AdminAttentionList from "../../components/admin/attention-list";
import useAdminDashboard from "../../hooks/use-admin-dashboard";

export default function AdminDashboardPage() {
  const {
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
  } = useAdminDashboard();

  return (
    <main className="admin-experience px-4 py-6 md:px-8 md:py-8">
      <div className="admin-page-shell">
        <AdminCommandHero
          activeShipments={activeShipments.length}
          pendingAssignments={pendingAssignments.length}
          usersCount={users.length}
        />

        <div className="mt-4">
          <AdminTabSwitcher activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <FeedbackAlert feedback={feedback} />

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading...</p>
        ) : !metrics ? (
          <p className="mt-4 text-sm text-slate-500">No metrics available.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {activeTab === "overview" ? (
              <>
                <AdminSectionShell
                  title="Overview"
                  aside={
                    <span className="text-xs text-slate-500">
                      {pendingAssignments.length} awaiting dispatch
                    </span>
                  }
                >
                  <AdminMetricsCards metrics={metrics} />
                </AdminSectionShell>

                <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
                  <StatusMixChart metrics={metrics} />

                  <AdminSectionShell title="Attention Required">
                    <AdminAttentionList shipments={overviewPreview} />
                  </AdminSectionShell>
                </div>
              </>
            ) : null}

            {activeTab === "shipments" ? (
              <>
                <AdminSectionShell title="Filters">
                  <ShipmentFiltersToolbar
                    filters={shipmentFilters}
                    couriers={couriers}
                    onChange={handleShipmentFilterChange}
                  />
                </AdminSectionShell>

                <ShipmentAssignmentPanel
                  shipments={shipments}
                  couriers={couriers}
                  selectedCouriers={selectedCouriers}
                  assigningId={assigningId}
                  onSelectCourier={handleCourierSelect}
                  onAssignCourier={handleAssignCourier}
                />
              </>
            ) : null}

            {activeTab === "users" ? (
              <>
                <AdminSectionShell
                  title="Users"
                  aside={
                    <span className="text-xs text-slate-500">
                      {users.length} accounts
                    </span>
                  }
                >
                  <UserRoleManagementPanel
                    users={users}
                    selectedRoles={selectedRoles}
                    updatingUserId={updatingUserId}
                    onSelectRole={handleRoleSelect}
                    onUpdateRole={handleUpdateUserRole}
                    onInspectUser={handleInspectUser}
                  />
                </AdminSectionShell>

                <OperationsDetailPanel
                  user={selectedUser}
                  relatedLogs={selectedUserAuditLogs}
                />
              </>
            ) : null}

            {activeTab === "audit" ? (
              <AdminSectionShell title="Audit Log">
                <AuditLogPanel
                  logs={auditLogs}
                  users={users}
                  filters={auditFilters}
                  onChange={handleAuditFilterChange}
                />
              </AdminSectionShell>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
