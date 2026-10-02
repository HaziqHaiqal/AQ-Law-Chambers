import type { ComponentProps, ComponentType, ReactNode, SVGProps } from "react";
import { FieldError } from "@/components/Forms/FieldError";
import { FieldLabel } from "@/components/Forms/FieldLabel";

export function TextField({
  label,
  name,
  error,
  hint,
  icon: Icon,
  optional = false,
  className = "",
  ...input
}: Omit<ComponentProps<"input">, "name"> & {
  label: string;
  name: string;
  error?: string;
  hint?: ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  optional?: boolean;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  return (
    <label className={`grid content-start gap-1.5 ${className}`}>
      <FieldLabel required={input.required} optional={optional}>
        {label}
      </FieldLabel>
      <span className="relative block">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-slate-light" />
        )}
        <input
          {...input}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error && errorId, hint && hintId].filter(Boolean).join(" ") ||
            undefined
          }
          className={`field-input ${Icon ? "pl-11" : ""}`}
        />
      </span>
      {hint && !error && (
        <span id={hintId} className="text-xs leading-relaxed text-slate">
          {hint}
        </span>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </label>
  );
}
