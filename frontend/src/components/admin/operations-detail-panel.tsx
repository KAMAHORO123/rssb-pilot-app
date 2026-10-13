import { AdminUser, AuditLog } from "../../lib/api";

type OperationsDetailPanelProps = {
  user: AdminUser | null;
  relatedLogs: AuditLog[];
};

export default function OperationsDetailPanel({
  user,
  relatedLogs
}: OperationsDetailPanelProps) {
  if (!user) {
    return (
      <div className="admin-surface border-dashed p-5 text-sm text-slate-500">
        Select a user to inspect their profile.
      </div>
    );
  }

  return (
    <div className="admin-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">Account Detail</h2>
        <span className="text-xs text-slate-500">{user.email}</span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="admin-panel p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            User
          </h3>
          <div className="mt-2 space-y-1 text-sm text-slate-700">
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
            <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="admin-panel p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Courier
          </h3>
          {user.courier ? (
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p>Vehicle: {user.courier.vehicleType ?? "Not set"}</p>
              <p>{user.courier.availability ? "Available" : "Unavailable"}</p>
              <p>Shipments: {user.courier._count?.shipments ?? 0}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No courier profile.</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Recent Audit
        </h3>
        {relatedLogs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No recent events.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {relatedLogs.map((log) => (
              <div
                key={log.id}
                className="admin-panel flex items-center justify-between p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {log.actionType}
                  </p>
                  <p className="text-xs text-slate-500">{log.targetType}</p>
                </div>
                <p className="text-xs text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
