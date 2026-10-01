import type { ReactNode } from "react";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1320px] px-6 sm:px-10 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}
