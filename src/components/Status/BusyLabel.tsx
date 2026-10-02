import type { ReactNode } from "react";
import { Spinner } from "@/components/Status/Spinner";

export function BusyLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Spinner className="size-4" />
      {children}
    </span>
  );
}
