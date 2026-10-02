import type { ComponentProps } from "react";
import { FieldError } from "@/components/Forms/FieldError";
import { FieldLabel } from "@/components/Forms/FieldLabel";

export function TextAreaField({
  label,
  name,
  error,
  optional = false,
  className = "",
  ...textarea
}: Omit<ComponentProps<"textarea">, "name"> & {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
}) {
  const errorId = `${name}-error`;
  return (
    <label className={`grid content-start gap-1.5 ${className}`}>
      <FieldLabel required={textarea.required} optional={optional}>
        {label}
      </FieldLabel>
      <textarea
        rows={3}
        {...textarea}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="field-input resize-y"
      />
      <FieldError id={errorId}>{error}</FieldError>
    </label>
  );
}
