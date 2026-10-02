"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/Buttons/Button";
import { BusyLabel } from "@/components/Status/BusyLabel";

export function SubmitButton({
  children,
  pendingLabel,
  variant = "appPrimary",
  ...props
}: ButtonProps & { pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}
      variant={variant}
      type="submit"
      disabled={pending || props.disabled}
      aria-disabled={pending}
    >
      {pending ? <BusyLabel>{pendingLabel}</BusyLabel> : children}
    </Button>
  );
}
