type AuthSidePanelProps = {
  title: string;
  subtitle?: string;
};

export default function AuthSidePanel({ title, subtitle }: AuthSidePanelProps) {
  return (
    <div className="relative z-10 flex h-full flex-col items-start justify-between">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21M3.375 14.25h-.375a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3h8.25m5.625 0H18a3 3 0 0 1 3 3v4.5a3 3 0 0 1-3 3h-.375m-13.5 0h13.5"
            />
          </svg>
        </div>

        <h1 className="landing-display mt-6 text-3xl leading-tight text-slate-950 md:text-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="landing-muted mt-4 max-w-sm text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="auth-side-visual mt-12 w-full flex-1 rounded-xl bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-slate-600">
              Real-time shipment tracking
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-sm font-medium text-slate-600">
              Role-based dashboards
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span className="text-sm font-medium text-slate-600">
              Courier coordination
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
