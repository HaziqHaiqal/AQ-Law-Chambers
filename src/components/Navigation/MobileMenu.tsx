"use client";

import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type Ref,
} from "react";
import { firm, practiceAreas, sectors } from "@/data/site";
import { ArrowRight, Plus } from "@/components/Icons";
import { Container } from "@/components/Layout/Container";
import { Crest } from "@/components/Brand/Crest";

type Item = {
  label: string;
  href: string;
  children?: readonly { id: string; short: string }[];
};

const items: Item[] = [
  { label: "The Firm", href: "#firm" },
  { label: "Practice Areas", href: "#practice", children: practiceAreas },
  { label: "Sectors", href: "#sectors", children: sectors },
  { label: "Our Partners", href: "#partners" },
  { label: "Testimonials", href: "#testimonials" },
];

/**
 * Full-screen navy menu for screens below 1200px.
 * Sized to fit a single screen (no scrolling), even with a sub-list open.
 */
export function MobileMenu({
  open,
  offsetTop,
  onClose,
  ref,
}: {
  open: boolean;
  /** Where the site header ends on screen; the menu content starts below it. */
  offsetTop: number;
  onClose: () => void;
  ref: Ref<HTMLDivElement>;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  function close() {
    setExpanded(null);
    onClose();
  }

  // Keep keyboard focus within the menu and its toggle button (which stays in the header above).
  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || event.shiftKey) return;
    const focusable =
      event.currentTarget.querySelectorAll<HTMLElement>("a[href], button");
    if (document.activeElement === focusable[focusable.length - 1]) {
      event.preventDefault();
      document.getElementById("mobile-menu-toggle")?.focus();
    }
  }

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      onKeyDown={trapFocus}
      style={{ paddingTop: offsetTop }}
      className={`mobile-menu fixed inset-0 z-[60] flex flex-col overflow-hidden bg-navy text-white xl:hidden ${open ? "is-open" : ""}`}
    >
      <Crest
        light
        className="pointer-events-none absolute -right-16 -bottom-20 w-72 opacity-[0.04]"
      />

      <nav
        aria-label="Mobile"
        className="relative flex min-h-0 flex-1 flex-col"
      >
        <Container className="menu-body flex flex-1 flex-col pt-2 pb-6">
          <ul>
            {items.map((item, index) => {
              const isExpanded = expanded === item.label;
              const label = (
                <>
                  <span className="w-7 shrink-0 text-xs text-gold tabular-nums">
                    0{index + 1}
                  </span>
                  <span className="menu-label flex-1 font-serif leading-tight tracking-[-0.02em]">
                    {item.label}
                  </span>
                </>
              );
              return (
                <li
                  key={item.label}
                  className="menu-item border-b border-white/10"
                  style={{ "--i": index } as CSSProperties}
                >
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-${item.href.slice(1)}`}
                        onClick={() =>
                          setExpanded(isExpanded ? null : item.label)
                        }
                        className={`menu-row flex w-full items-center text-left transition-colors ${isExpanded ? "text-gold" : "hover:text-gold"}`}
                      >
                        {label}
                        <Plus
                          className={`size-5 shrink-0 text-gold transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}
                        />
                      </button>
                      <div
                        id={`mobile-${item.href.slice(1)}`}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <ul className="grid min-h-0 grid-cols-2 gap-x-4 overflow-hidden pl-7">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <a
                                href={`#${child.id}`}
                                onClick={close}
                                className="block py-1.5 text-[15px] leading-snug text-slate-light transition-colors hover:text-white"
                              >
                                {child.short}
                              </a>
                            </li>
                          ))}
                          <li>
                            <a
                              href={item.href}
                              onClick={close}
                              className="inline-flex items-center gap-1.5 py-1.5 text-[15px] font-medium text-gold"
                            >
                              View all
                              <ArrowRight className="size-3.5" />
                            </a>
                          </li>
                          <li aria-hidden="true" className="col-span-2 h-3" />
                        </ul>
                      </div>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={close}
                      className="menu-row flex items-center transition-colors hover:text-gold"
                    >
                      {label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div
            className="menu-item mt-auto pt-5"
            style={{ "--i": items.length } as CSSProperties}
          >
            <div className="grid grid-cols-2 gap-3">
              <a
                href="#contact"
                onClick={close}
                className="group flex min-h-12 items-center justify-between border-t border-white/15 px-1 text-base font-medium text-white transition-colors hover:text-gold"
              >
                Get in touch
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/login"
                className="group flex min-h-12 items-center justify-between border-t border-white/15 px-1 text-base font-medium text-gold transition-colors hover:text-white"
              >
                Sign in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
            <a
              href={`tel:${firm.hotlineTel}`}
              className="mt-4 flex items-baseline justify-between gap-4 transition-colors hover:text-gold"
            >
              <span className="text-[11px] font-medium tracking-[0.16em] text-gold uppercase">
                24/7 Hotline
              </span>
              <span className="font-serif text-2xl leading-none">
                {firm.hotline}
              </span>
            </a>
          </div>
        </Container>
      </nav>
    </div>
  );
}
