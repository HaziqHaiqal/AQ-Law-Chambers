import type { ReactNode } from "react";

const tones = {
  active: { badge: "bg-navy/[0.07] text-navy", dot: "bg-navy" },
  pending: { badge: "bg-gold/20 text-[#6b5617]", dot: "bg-gold-ink" },
  muted: { badge: "bg-mist text-slate", dot: "bg-slate-light" },
  danger: { badge: "bg-[#b4372c]/[0.08] text-[#8c2a21]", dot: "bg-[#b4372c]" },
  neutral: { badge: "bg-white text-slate ring-1 ring-line", dot: "" },
};

export type BadgeTone = keyof typeof tones;

export function StatusBadge({
  tone = "neutral",
  dot = tone !== "neutral",
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs leading-none font-medium whitespace-nowrap ${tones[tone].badge}`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full ${tones[tone].dot}`}
        />
      )}
      {children}
    </span>
  );
}

export function caseStatusTone(label: string): BadgeTone {
  if (label.startsWith("Pending") || label === "Being set up") return "pending";
  if (label === "Closed") return "muted";
  return "active";
}
