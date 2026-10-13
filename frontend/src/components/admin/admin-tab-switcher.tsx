type AdminTabKey = "overview" | "shipments" | "users" | "audit";

type AdminTabSwitcherProps = {
  activeTab: AdminTabKey;
  onChange: (tab: AdminTabKey) => void;
};

const tabs: Array<{ key: AdminTabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "shipments", label: "Shipments" },
  { key: "users", label: "Users" },
  { key: "audit", label: "Audit" }
];

export default function AdminTabSwitcher({
  activeTab,
  onChange
}: AdminTabSwitcherProps) {
  return (
    <div className="admin-surface p-2">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "segment-active text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
