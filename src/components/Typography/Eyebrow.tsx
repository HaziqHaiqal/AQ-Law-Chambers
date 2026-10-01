import type { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase ${tone === "light" ? "text-gold" : "text-gold-ink"}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}
