"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Close, Menu } from "@/components/Icons";
import { AppNav } from "@/components/Navigation/AppNav";
import type { AppNavItem } from "@/lib/navigation";

export function MobileAppMenu({
  items,
  footer,
}: {
  items: AppNavItem[];
  footer: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="app-menu"
        className="-ml-2 grid size-10 place-items-center rounded-lg text-navy hover:bg-mist"
      >
        <Menu className="size-5" />
      </button>
      <div
        className={`fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        id="app-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-navy px-3 py-4 text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-lg text-slate-light hover:bg-white/10 hover:text-white"
          >
            <Close className="size-5" />
          </button>
        </div>
        <nav aria-label="Main" className="flex-1">
          <AppNav items={items} onNavigate={() => setOpen(false)} />
        </nav>
        {footer}
      </div>
    </div>
  );
}
