import type { ReactNode } from "react";
import { Alert, Check } from "@/components/Icons";

export function FormAlert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success";
  children?: ReactNode;
}) {
  if (!children) return null;
  const error = tone === "error";
  return (
    <div
      role={error ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm leading-relaxed ${
        error ? "bg-[#b4372c]/[0.07] text-[#8c2a21]" : "bg-gold/15 text-navy"
      }`}
    >
      {error ? (
        <Alert className="mt-0.5 size-4 shrink-0" />
      ) : (
        <Check
          className="mt-0.5 size-4 shrink-0 text-gold-ink"
          strokeWidth={2}
        />
      )}
      <div>{children}</div>
    </div>
  );
}
