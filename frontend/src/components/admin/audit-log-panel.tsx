import { AdminUser, AuditLog } from "../../lib/api";
import { AuditLogFilters } from "../../lib/types";

type AuditLogPanelProps = {
  logs: AuditLog[];
  users: AdminUser[];
  filters: AuditLogFilters;
  onChange: (field: keyof AuditLogFilters, value: string) => void;
};

export default function AuditLogPanel({
  logs,
  users,
  filters,
  onChange
}: AuditLogPanelProps) {
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
          placeholder="Filter by action type"
          value={filters.actionType}
          onChange={(e) => onChange("actionType", e.target.value)}
        />

        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
          value={filters.targetType}
          onChange={(e) => onChange("targetType", e.target.value)}
        >
          <option value="">All targets</option>
          <option value="Shipment">Shipment</option>
          <option value="User">User</option>
          <option value="Courier">Courier</option>
        </select>

        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
          value={filters.actorUserId}
          onChange={(e) => onChange("actorUserId", e.target.value)}
        >
          <option value="">All actors</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
          value={filters.sortOrder}
          onChange={(e) =>
            onChange(
              "sortOrder",
              e.target.value as AuditLogFilters["sortOrder"]
            )
          }
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {logs.length} matching events
      </p>

      {logs.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No events found.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="admin-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">
                    {log.actionType}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {log.targetType} · {log.actor?.email ?? "System"} ·{" "}
                    {log.targetId ? `Target: ${log.targetId.slice(0, 8)}` : ""}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>

              {log.metadata ? (
                <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
