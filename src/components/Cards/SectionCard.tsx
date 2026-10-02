import type { ReactNode } from "react";

export function SectionCard({
  id,
  title,
  description,
  actions,
  flush = false,
  className = "",
  children,
}: {
  id?: string;
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
  flush?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id && title ? `${id}-title` : undefined}
      className={`scroll-mt-24 rounded-xl border border-line bg-white shadow-[0_1px_2px_rgb(10_25_47/4%)] ${className}`}
    >
      {title && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id={id ? `${id}-title` : undefined}
              className="text-[15px] font-semibold"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-slate">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div
        className={
          flush
            ? ""
            : `px-5 pb-5 sm:px-6 sm:pb-6 ${title ? "" : "pt-5 sm:pt-6"}`
        }
      >
        {children}
      </div>
    </section>
  );
}
