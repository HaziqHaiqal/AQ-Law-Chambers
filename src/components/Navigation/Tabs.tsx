import Link from "next/link";

export type TabItem = {
  label: string;
  href: string;
  active: boolean;
  count?: number;
};

export function Tabs({ label, items }: { label: string; items: TabItem[] }) {
  return (
    <nav
      aria-label={label}
      className="mb-6 overflow-x-auto border-b border-line"
    >
      <ul className="flex min-w-max gap-6">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              scroll={false}
              aria-current={item.active ? "page" : undefined}
              className={`-mb-px flex min-h-11 items-center gap-2 border-b-2 text-sm transition-colors ${
                item.active
                  ? "border-gold font-medium text-navy"
                  : "border-transparent text-slate hover:text-navy"
              }`}
            >
              {item.label}
              {item.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none tabular-nums ${
                    item.active ? "bg-navy text-white" : "bg-mist text-slate"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
