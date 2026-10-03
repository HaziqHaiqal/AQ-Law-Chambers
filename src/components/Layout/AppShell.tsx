import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/Brand/BrandMark";
import { SignOutButton } from "@/components/Buttons/SignOutButton";
import { Phone } from "@/components/Icons";
import { AppNav } from "@/components/Navigation/AppNav";
import { MobileAppMenu } from "@/components/Navigation/MobileAppMenu";
import { NotificationBell } from "@/components/Navigation/NotificationBell";
import { firm } from "@/data/site";
import { getCurrentProfile } from "@/lib/auth";
import { formatLongDate, initials, openEnquiryStatuses } from "@/lib/format";
import { appNav } from "@/lib/navigation";
import { getNotifications } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export async function AppShell({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const isPartner = profile.role === "admin";
  const [notifications, openTasks, openEnquiries, unpaidInvoices] =
    await Promise.all([
      getNotifications(supabase),
      isPartner
        ? supabase
            .from("tasks")
            .select("id", { count: "exact", head: true })
            .eq("assigned_to", profile.id)
            .neq("status", "done")
            .then(({ count }) => count ?? 0)
        : 0,
      isPartner
        ? supabase
            .from("enquiries")
            .select("id", { count: "exact", head: true })
            .in("status", openEnquiryStatuses)
            .then(({ count }) => count ?? 0)
        : 0,
      isPartner
        ? 0
        : supabase
            .from("invoices")
            .select("id", { count: "exact", head: true })
            .eq("status", "issued")
            .then(({ count }) => count ?? 0),
    ]);
  const nav = appNav(profile.role, {
    openTasks,
    openEnquiries,
    unpaidInvoices,
  });
  const home = nav[0].href;

  const userBlock = (
    <div className="flex items-center gap-3 border-t border-white/10 px-2 pt-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-[13px] font-semibold text-navy">
        {initials(profile.full_name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-white">
          {profile.full_name}
        </span>
        <span className="block truncate text-xs text-slate-light">
          {isPartner ? "Partner" : profile.email}
        </span>
      </span>
      <SignOutButton />
    </div>
  );

  const hotline = !isPartner && (
    <a
      href={`tel:${firm.hotlineTel}`}
      className="mx-1 mb-4 flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-3 transition-colors hover:bg-white/10"
    >
      <Phone className="size-[18px] shrink-0 text-gold" />
      <span>
        <span className="block text-[11px] text-slate-light">24/7 Hotline</span>
        <span className="text-sm font-medium text-white">{firm.hotline}</span>
      </span>
    </a>
  );

  return (
    <div className="flex min-h-dvh flex-1 bg-mist">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy px-3 pt-6 pb-4 lg:flex">
        <Link
          href={home}
          aria-label={`${firm.name} home`}
          className="mb-2 px-3"
        >
          <BrandMark light />
        </Link>
        <p className="mb-8 px-3 text-xs text-slate-light">
          {isPartner ? "Admin Portal" : "Client Portal"}
        </p>
        <nav aria-label="Main" className="flex-1">
          <AppNav items={nav} />
        </nav>
        {hotline}
        {userBlock}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-white/90 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-2">
            <MobileAppMenu
              items={nav}
              footer={
                <>
                  {hotline}
                  {userBlock}
                </>
              }
            />
            <Link
              href={home}
              aria-label={`${firm.name} home`}
              className="lg:hidden"
            >
              <BrandMark />
            </Link>
            <p className="hidden text-[13px] text-slate lg:block">
              {formatLongDate(new Date())}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {!isPartner && (
              <a
                href={`tel:${firm.hotlineTel}`}
                aria-label={`Call the 24/7 Hotline at ${firm.hotline}`}
                className="grid size-10 place-items-center rounded-lg text-gold-ink transition-colors hover:bg-mist lg:hidden"
              >
                <Phone className="size-5" />
              </a>
            )}
            <NotificationBell userId={profile.id} initial={notifications} />
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-8 sm:px-8 lg:py-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
