"use client";

import { useEffect, useRef, useState } from "react";
import { firm, nav, practiceAreas, sectors } from "@/content/site";
import { ArrowUpRight, ChevronDown, Close, Menu, Phone } from "./icons";
import { BrandMark, Container, buttonStyles } from "./ui";

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
  const header = useRef<HTMLElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
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

  function closeNavigation() {
    setOpen(false);
    setActiveMenu(null);
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="border-b border-line bg-mist text-[10px] text-slate">
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
        className="site-header sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-xl"
      >
        <Container className="flex h-[84px] items-center justify-between gap-6">
          <a
            href="#top"
            aria-label={`${firm.name} home`}
            className="shrink-0"
            onClick={closeNavigation}
          >
            <BrandMark />
          </a>
          <nav
            id="primary-navigation"
            aria-label="Primary"
            className={`site-navigation ${open ? "is-open" : ""}`}
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
                      className={`size-3 transition-transform ${activeMenu === menu.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={`menu-${menu.href.slice(1)}`}
                    className="nav-dropdown-panel"
                    hidden={activeMenu !== menu.label}
                  >
                    <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.16em] text-gold-ink">
                      {menu.caption}
                    </p>
                    <a
                      href={menu.href}
                      onClick={closeNavigation}
                      className="mb-2 flex items-center justify-between border-b border-line pb-4 text-sm font-medium"
                    >
                      Explore {menu.label.toLowerCase()}
                      <ArrowUpRight className="size-4" />
                    </a>
                    {menu.items.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={closeNavigation}
                        className="block py-3 text-xs leading-relaxed text-slate hover:text-gold-ink"
                      >
                        {item.title}
                      </a>
                    ))}
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
              <li className="navigation-contact">
                <a
                  href="#contact"
                  onClick={closeNavigation}
                  className={`${buttonStyles.primary} w-full`}
                >
                  Get in touch
                  <ArrowUpRight className="size-4" />
                </a>
              </li>
            </ul>
            <a href={`tel:${firm.hotlineTel}`} className="mobile-nav-hotline">
              <Phone className="size-4 text-gold-ink" />
              24/7 Hotline: {firm.hotline}
            </a>
          </nav>
          <button
            ref={mobileTrigger}
            type="button"
            className="mobile-menu-trigger grid size-11 place-items-center border border-line"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => {
              setOpen(!open);
              setActiveMenu(null);
            }}
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </Container>
      </header>
    </>
  );
}
