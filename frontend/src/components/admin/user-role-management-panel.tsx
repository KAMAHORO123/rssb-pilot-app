import { AdminUser } from "../../lib/api";

type UserRoleManagementPanelProps = {
  users: AdminUser[];
  selectedRoles: Record<string, string>;
  updatingUserId: string | null;
  onSelectRole: (userId: string, role: string) => void;
  onUpdateRole: (userId: string) => void;
  onInspectUser: (user: AdminUser) => void;
};

export default function UserRoleManagementPanel({
  users,
  selectedRoles,
  updatingUserId,
  onSelectRole,
  onUpdateRole,
  onInspectUser
}: UserRoleManagementPanelProps) {
  if (users.length === 0) {
    return <p className="text-sm text-slate-500">No users found.</p>;
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="admin-panel p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-950">
                {user.email}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Role: {user.role}</span>
                <span>Courier: {user.courier ? "Provisioned" : "None"}</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onInspectUser(user)}
                className="admin-btn-secondary px-3 py-1.5 text-xs"
              >
                Inspect
              </button>

              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none"
                value={selectedRoles[user.id] || user.role}
                onChange={(e) => onSelectRole(user.id, e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="COURIER">COURIER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <button
                type="button"
                onClick={() => onUpdateRole(user.id)}
                disabled={updatingUserId === user.id}
                className="admin-btn-primary px-3 py-1.5 text-xs"
              >
                {updatingUserId === user.id ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
