import type { ReactNode } from "react";
import { ArrowRight } from "@/components/Icons";

/** Text link with an arrow, used for "Learn more"-style actions. */
export function ArrowLink({
  href,
  children,
  tone = "dark",
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 text-[15px] font-medium ${
        tone === "light"
          ? "text-white hover:text-gold"
          : "text-navy hover:text-gold-ink"
      }`}
    >
      <span className="border-b border-current/30 pb-0.5 group-hover:border-current">
        {children}
      </span>
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}
