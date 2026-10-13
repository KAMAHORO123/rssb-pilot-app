import { ReactNode } from "react";

type AdminSectionShellProps = {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
};

export default function AdminSectionShell({
  title,
  aside,
  children
}: AdminSectionShellProps) {
  return (
    <section className="admin-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        {aside ? <div>{aside}</div> : null}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}
