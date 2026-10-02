import { Alert } from "@/components/Icons";

export function FieldError({
  id,
  children,
}: {
  id: string;
  children?: string;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      className="flex items-start gap-1.5 text-[13px] leading-snug text-[#b4372c]"
    >
      <Alert className="mt-px size-3.5 shrink-0" />
      {children}
    </p>
  );
}
