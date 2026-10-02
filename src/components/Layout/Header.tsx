"use client";

import { useEffect, useRef, useState } from "react";
import { firm, nav, practiceAreas, sectors } from "@/data/site";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  User,
} from "@/components/Icons";
import { MobileMenu } from "@/components/Navigation/MobileMenu";
import { BrandMark } from "@/components/Brand/BrandMark";
import { Container } from "@/components/Layout/Container";

const menus = [
  {
    ...nav.practice,
    caption: "Local & statutory expertise",
    items: practiceAreas,
  },
  {
    ...nav.sectors,
    caption: "International & corporate focus",
    items: sectors,
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  // Where the header ends on screen; the open menu starts just below it.
  const [menuOffset, setMenuOffset] = useState(0);
  const header = useRef<HTMLElement>(null);
  const mobileMenu = useRef<HTMLDivElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !header.current?.contains(target) &&
        !mobileMenu.current?.contains(target)
      ) {
        setOpen(false);
        setActiveMenu(null);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeMenu) {
        header.current
          ?.querySelector<HTMLButtonElement>(`[data-menu="${activeMenu}"]`)
          ?.focus();
        setActiveMenu(null);
      } else if (open) {
        setOpen(false);
        mobileTrigger.current?.focus();
      }
    };
    const onResize = () => {
      setOpen(false);
      setActiveMenu(null);
    };
    const media = window.matchMedia("(min-width: 1200px)");
    media.addEventListener("change", onResize);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      media.removeEventListener("change", onResize);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, activeMenu]);

  // Stop the page scrolling behind the open mobile menu.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  function closeNavigation() {
    setOpen(false);
    setActiveMenu(null);
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Desktop-only info bar; on smaller screens the hotline lives in the menu. */}
      <div className="hidden border-b border-line bg-mist text-[11px] text-slate xl:block">
        <Container className="flex min-h-9 items-center justify-between gap-4">
          <p className="hidden tracking-[0.04em] sm:block">
            Advocates &amp; Solicitors · Shah Alam, Malaysia
          </p>
          <a
            href={`tel:${firm.hotlineTel}`}
            className="flex min-h-9 items-center gap-2.5 hover:text-navy"
          >
            <span
              className="size-1.5 rounded-full bg-gold-ink"
              aria-hidden="true"
            />
            24/7 Emergency Hotline{" "}
            <span className="font-semibold text-navy">{firm.hotline}</span>
            <ArrowUpRight className="size-3" />
          </a>
        </Container>
      </div>
      <header
        ref={header}
        className={`site-header sticky top-0 border-b backdrop-blur-xl transition-colors duration-300 ${
          open
            ? "z-[70] border-white/10 bg-navy"
            : "z-50 border-line bg-white/95"
        }`}
      >
        <Container className="flex h-[84px] items-center justify-between gap-6">
          <a
            href="#top"
            aria-label={`${firm.name} home`}
            className="shrink-0"
            onClick={closeNavigation}
          >
            <BrandMark light={open} />
          </a>
          <nav
            id="primary-navigation"
            aria-label="Primary"
            className="site-navigation"
          >
            <ul className="navigation-list">
              <li>
                <a href="#firm" onClick={closeNavigation} className="nav-link">
                  The Firm
                </a>
              </li>
              {menus.map((menu) => (
                <li
                  key={menu.href}
                  className="nav-dropdown"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                      setActiveMenu(null);
                  }}
                >
                  <button
                    type="button"
                    className="nav-link w-full justify-between"
                    data-menu={menu.label}
                    aria-expanded={activeMenu === menu.label}
                    aria-controls={`menu-${menu.href.slice(1)}`}
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === menu.label ? null : menu.label,
                      )
                    }
                  >
                    {menu.label}
                    <ChevronDown
                      className={`size-3.5 text-slate transition-transform duration-200 ${activeMenu === menu.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={`menu-${menu.href.slice(1)}`}
                    className="nav-dropdown-panel"
                    hidden={activeMenu !== menu.label}
                  >
                    <p className="px-3 pt-2.5 pb-2 text-[10px] font-semibold tracking-[0.16em] text-gold-ink uppercase">
                      {menu.caption}
                    </p>
                    <ul>
                      {menu.items.map((item, index) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={closeNavigation}
                            className="group flex items-start gap-3 rounded-lg px-3 py-2.5 text-[13.5px] leading-snug text-navy transition-colors hover:bg-mist"
                          >
                            <span className="mt-px w-5 shrink-0 text-[11px] leading-5 text-slate tabular-nums transition-colors group-hover:text-gold-ink">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1">{item.title}</span>
                            <ArrowRight className="mt-0.5 size-3.5 shrink-0 -translate-x-1 text-gold-ink opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={menu.href}
                      onClick={closeNavigation}
                      className="mt-1.5 flex items-center justify-between border-t border-line px-3 pt-3.5 pb-2.5 text-[13px] font-medium text-navy transition-colors hover:text-gold-ink"
                    >
                      View all {menu.label.toLowerCase()}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </li>
              ))}
              <li>
                <a
                  href="#partners"
                  onClick={closeNavigation}
                  className="nav-link"
                >
                  Our Partners
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={closeNavigation}
                  className="nav-link"
                >
                  Contact
                </a>
              </li>
            </ul>
            <div className="header-sign-in">
              <a href="/login" className="nav-link">
                <User className="size-4" />
                Sign in
              </a>
            </div>
          </nav>
          <button
            ref={mobileTrigger}
            id="mobile-menu-toggle"
            type="button"
            className={`mobile-menu-trigger -mr-2.5 size-11 place-items-center transition-colors duration-300 ${open ? "text-white" : "text-navy"}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              if (!open)
                setMenuOffset(
                  Math.max(
                    0,
                    header.current?.getBoundingClientRect().bottom ?? 0,
                  ),
                );
              setOpen(!open);
              setActiveMenu(null);
            }}
          >
            {/* Two lines that rotate into an X when the menu opens. */}
            <span
              aria-hidden="true"
              className={`menu-toggle-icon ${open ? "is-open" : ""}`}
            >
              <span />
              <span />
            </span>
          </button>
        </Container>
      </header>
      <MobileMenu
        ref={mobileMenu}
        open={open}
        offsetTop={menuOffset}
        onClose={closeNavigation}
      />
    </>
  );
}
