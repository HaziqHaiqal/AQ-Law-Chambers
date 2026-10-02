import type { ReactNode } from "react";

export function EmptyState({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="px-6 py-10 text-center">
      {title && <p className="text-sm font-medium text-navy">{title}</p>}
      {children && (
        <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-slate">
          {children}
        </p>
      )}
    </div>
  );
}
