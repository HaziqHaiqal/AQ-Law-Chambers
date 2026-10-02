import type { ReactNode } from "react";

export function FieldLabel({
  children,
  required = false,
  optional = false,
}: {
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <span className="text-[13px] font-medium text-navy">
      {children}
      {required && <span className="text-gold-ink"> *</span>}
      {optional && <span className="font-normal text-slate"> (optional)</span>}
    </span>
  );
}
