type AdminCommandHeroProps = {
  activeShipments: number;
  pendingAssignments: number;
  usersCount: number;
};

export default function AdminCommandHero({
  activeShipments,
  pendingAssignments,
  usersCount
}: AdminCommandHeroProps) {
  return (
    <section className="admin-hero px-6 py-6 md:px-8 md:py-8">
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="admin-display text-2xl font-semibold text-slate-950">
          Admin Dashboard
        </h1>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Active
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {activeShipments}
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Pending
            </p>
            <p className="mt-1 text-2xl font-semibold text-amber-950">
              {pendingAssignments}
            </p>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50/85 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Users
            </p>
            <p className="mt-1 text-2xl font-semibold text-sky-950">
              {usersCount}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
