import type { ComponentProps, ReactNode } from "react";
import { FieldError } from "@/components/Forms/FieldError";
import { FieldLabel } from "@/components/Forms/FieldLabel";

export function SelectField({
  label,
  name,
  options,
  error,
  hint,
  className = "",
  ...select
}: Omit<ComponentProps<"select">, "name" | "children"> & {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
  hint?: ReactNode;
}) {
  const errorId = `${name}-error`;
  return (
    <label className={`grid grid-cols-1 content-start gap-1.5 ${className}`}>
      <FieldLabel>{label}</FieldLabel>
      <select
        {...select}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="field-input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <span className="text-xs leading-relaxed text-slate">{hint}</span>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </label>
  );
}
