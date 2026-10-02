import { BrandMark } from "@/components/Brand/BrandMark";
import { Spinner } from "@/components/Status/Spinner";

export function Loader({
  label = "Loading…",
  variant = "section",
}: {
  label?: string;
  variant?: "page" | "section" | "inline";
}) {
  if (variant === "inline")
    return (
      <span
        role="status"
        className="inline-flex items-center gap-2 text-sm text-slate"
      >
        <Spinner className="size-4 text-gold-ink" />
        {label}
      </span>
    );

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-4 text-center ${
        variant === "page" ? "min-h-dvh flex-1 bg-white" : "w-full py-24"
      }`}
    >
      {variant === "page" && (
        <div className="mb-2">
          <BrandMark />
        </div>
      )}
      <Spinner
        className={`text-gold ${variant === "page" ? "size-9" : "size-8"}`}
      />
      <p className="text-[13px] font-medium text-slate">{label}</p>
    </div>
  );
}
