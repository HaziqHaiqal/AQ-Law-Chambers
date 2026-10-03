"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
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
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const trigger = openButton.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable.item(0);
      const last = focusable.item(focusable.length - 1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        ref={openButton}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="app-menu"
        className="-ml-2 grid size-10 place-items-center rounded-lg text-navy hover:bg-mist"
      >
        <Menu className="size-5" />
      </button>
      {mounted &&
        createPortal(
          <>
            <div
              className={`fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              id="app-menu"
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              aria-hidden={!open}
              inert={!open}
              className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-navy px-3 py-4 text-white transition-transform duration-300 ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  ref={closeButton}
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-lg text-slate-light hover:bg-white/10 hover:text-white"
                >
                  <Close className="size-5" />
                </button>
              </div>
              <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto">
                <AppNav items={items} onNavigate={() => setOpen(false)} />
              </nav>
              {footer}
            </div>
          </>,
          // The header's backdrop blur would otherwise clip this fixed panel to the header.
          document.body,
        )}
    </div>
  );
}
