import type { ReactNode } from "react";
import Link from "next/link";

export function PageHeading({
  title,
  eyebrow,
  back,
  actions,
  children,
}: {
  title: string;
  eyebrow?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-4 inline-flex text-[13px] font-medium text-slate hover:text-navy"
        >
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1.5 text-[13px] font-medium text-gold-ink">
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-[1.75rem] leading-tight tracking-[-0.02em] sm:text-[2rem]">
            {title}
          </h1>
          {children && (
            <div className="mt-2 text-sm leading-relaxed text-slate">
              {children}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
