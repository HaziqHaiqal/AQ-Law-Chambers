"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Grid,
  Inbox,
  ListChecks,
  User,
  Users,
} from "@/components/Icons";
import { Spinner } from "@/components/Status/Spinner";
import type { AppNavIcon, AppNavItem } from "@/lib/navigation";

const icons: Record<AppNavIcon, typeof Briefcase> = {
  dashboard: Grid,
  cases: Briefcase,
  tasks: ListChecks,
  clients: Users,
  enquiries: Inbox,
  account: User,
};

function NavItemEnd({ badge }: { badge?: number }) {
  const { pending } = useLinkStatus();
  if (pending) return <Spinner className="size-4 text-gold" />;
  if (!badge) return null;
  return (
    <span className="grid min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[11px] leading-5 font-semibold text-navy">
      {badge}
    </span>
  );
}

export function AppNav({
  items,
  onNavigate,
}: {
  items: AppNavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className="grid gap-1">
      {items.map((item) => {
        const Icon = icons[item.icon];
        const under = item.exact ? item.alsoUnder : `${item.href}/`;
        const active =
          pathname === item.href ||
          (under !== undefined && pathname.startsWith(under));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                active
                  ? "bg-white/10 font-medium text-white"
                  : "text-slate-light hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-gold"
                />
              )}
              <Icon
                className={`size-[18px] shrink-0 ${active ? "text-gold" : ""}`}
              />
              <span className="flex-1">{item.label}</span>
              <NavItemEnd badge={item.badge} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
