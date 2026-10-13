import { ReactNode } from "react";

type AuthShellProps = {
  sidePanel: ReactNode;
  formPanel: ReactNode;
};

export default function AuthShell({ sidePanel, formPanel }: AuthShellProps) {
  return (
    <main className="auth-experience px-6 py-8 md:px-8 md:py-10">
      <div className="auth-page-shell">
        <div className="auth-shell-card grid gap-6 p-5 md:p-7 xl:grid-cols-[1.02fr_0.98fr] xl:p-8">
          <div className="auth-side-panel p-6 md:p-8">{sidePanel}</div>
          <div className="auth-form-card p-6 md:p-8">{formPanel}</div>
        </div>
      </div>
    </main>
  );
}
