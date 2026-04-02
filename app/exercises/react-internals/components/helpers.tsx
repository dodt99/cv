import type { ReactNode } from "react";

export function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {badge}
        </span>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

export function ConceptCard({
  color,
  title,
  children,
}: {
  color: "blue" | "emerald" | "violet" | "amber" | "rose";
  title: string;
  children: ReactNode;
}) {
  const colors = {
    blue: "border-blue-200 bg-blue-50/40",
    emerald: "border-emerald-200 bg-emerald-50/40",
    violet: "border-violet-200 bg-violet-50/40",
    amber: "border-amber-200 bg-amber-50/40",
    rose: "border-rose-200 bg-rose-50/40",
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <p className="text-xs font-semibold text-gray-700 mb-2">{title}</p>
      {children}
    </div>
  );
}
