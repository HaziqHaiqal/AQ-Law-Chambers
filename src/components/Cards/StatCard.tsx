import type { ComponentType, SVGProps } from "react";
import Link from "next/link";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-slate">{label}</p>
        <span className="grid size-9 place-items-center rounded-lg bg-mist text-gold-ink">
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate">{hint}</p>}
    </>
  );
  const className =
    "block rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgb(10_25_47/4%)] transition-colors";
  return href ? (
    <Link href={href} className={`${className} hover:border-navy/25`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
