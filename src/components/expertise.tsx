"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { practiceAreas, sectors } from "@/content/site";
import { ArrowRight } from "./icons";
import { Reveal } from "./reveal";
import { ArrowLink, Container, SectionHeading } from "./ui";

type Item = { id: string; title: string; subtitle?: string; body: string };

const groups = {
  practice: { label: "Practice Areas", caption: "Local & statutory focus", items: practiceAreas as readonly Item[] },
  sectors: { label: "Sectors", caption: "International & corporate focus", items: sectors as readonly Item[] },
};
type GroupKey = keyof typeof groups;
const groupKeys = Object.keys(groups) as GroupKey[];

// Every in-page link that should open a specific tab and item.
const anchors: Record<string, { group: GroupKey; index: number }> = {
  expertise: { group: "practice", index: 0 },
  ...Object.fromEntries(
    groupKeys.flatMap((group) => [
      [group, { group, index: 0 }],
      ...groups[group].items.map((item, index) => [item.id, { group, index }]),
    ]),
  ),
};

/** Detail for one item. `compact` (inline on small screens) omits the heading already shown above it. */
function Detail({ group, index, item, compact = false }: { group: GroupKey; index: number; item: Item; compact?: boolean }) {
  return (
    <>
      {!compact && (
        <>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold-ink">
            {groups[group].label} · 0{index + 1} / 0{groups[group].items.length}
          </p>
          <h3 className="mt-4 text-balance font-serif text-[1.75rem] leading-[1.25] tracking-[-0.02em]">
            {item.title}
          </h3>
        </>
      )}
      {item.subtitle && (
        <p className={`${compact ? "" : "mt-3 "}text-sm font-medium text-gold-ink`}>{item.subtitle}</p>
      )}
      <p className={`${compact && !item.subtitle ? "" : compact ? "mt-3 " : "mt-6 "}text-base leading-[1.8] text-slate`}>
        {item.body}
      </p>
      <div className="mt-8">
        <ArrowLink href="#contact">Discuss your matter</ArrowLink>
      </div>
    </>
  );
}

export function Expertise() {
  const [group, setGroup] = useState<GroupKey>("practice");
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const items = groups[group].items;

  useEffect(() => {
    function select(hash: string) {
      const target = anchors[decodeURIComponent(hash.slice(1))];
      if (!target) return false;
      setGroup(target.group);
      setActive(target.index);
      section.current?.scrollIntoView({ block: "start" });
      return true;
    }
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (link && select(link.hash)) {
        event.preventDefault();
        history.pushState(null, "", link.hash);
      }
    }
    const frame = requestAnimationFrame(() => select(window.location.hash));
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
    };
  }, []);

  function switchGroup(next: GroupKey) {
    setGroup(next);
    setActive(0);
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const next = groupKeys[(groupKeys.indexOf(group) + 1) % groupKeys.length];
    switchGroup(next);
    document.getElementById(`tab-${next}`)?.focus();
  }

  return (
    <section id="expertise" ref={section} className="border-y border-line bg-mist py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-7 lg:grid-cols-2 lg:items-end lg:gap-20">
          <SectionHeading
            eyebrow="Our expertise"
            title={
              <>
                Specialist focus.
                <br />A wider perspective.
              </>
            }
          />
          <Reveal className="max-w-md text-base leading-[1.8] text-slate lg:pb-2">
            The right remedy starts with understanding your world. Explore our capabilities by legal practice or
            by the industries we serve.
          </Reveal>
        </div>

        <Reveal className="mt-14 lg:mt-16">
          {/* Anchor targets for #practice / #sectors links; kept off the buttons so the browser doesn't focus them. */}
          {groupKeys.map((key) => (
            <span key={key} id={key} aria-hidden="true" />
          ))}
          <div role="tablist" aria-label="Browse our expertise" className="flex items-end gap-8 border-b border-line">
            {groupKeys.map((key) => {
              const selected = key === group;
              return (
                <button
                  key={key}
                  id={`tab-${key}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="expertise-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => switchGroup(key)}
                  onKeyDown={onTabKey}
                  className={`relative -mb-px flex items-baseline gap-2 border-b-2 pb-4 text-base font-medium transition-colors ${
                    selected ? "border-gold text-navy" : "border-transparent text-slate hover:text-navy"
                  }`}
                >
                  {groups[key].label}
                  <span className="text-xs tabular-nums text-gold-ink">0{groups[key].items.length}</span>
                </button>
              );
            })}
            <span className="ml-auto hidden pb-4 text-xs uppercase tracking-[0.14em] text-slate sm:block">
              {groups[group].caption}
            </span>
          </div>

          <div
            id="expertise-panel"
            role="tabpanel"
            aria-labelledby={`tab-${group}`}
            className="grid lg:grid-cols-[1.1fr_1fr] lg:gap-16"
          >
            <ol key={group} className="fade-swap">
              {items.map((item, index) => {
                const isActive = index === active;
                return (
                  <li key={item.id} id={item.id} className="relative border-b border-line">
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-px left-0 h-px bg-navy transition-[width] duration-500 ease-out ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                    <button
                      type="button"
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      className="group flex w-full items-start gap-5 py-7 text-left"
                    >
                      <span className="w-6 shrink-0 pt-2.5 text-xs tabular-nums text-gold-ink">0{index + 1}</span>
                      <span
                        className={`flex-1 text-balance font-serif text-[1.5rem] leading-[1.25] tracking-[-0.02em] transition-colors duration-300 sm:text-[1.75rem] ${
                          isActive ? "text-navy" : "text-slate group-hover:text-navy"
                        }`}
                      >
                        {item.title}
                      </span>
                      <ArrowRight
                        className={`mt-2.5 size-5 shrink-0 text-gold-ink transition-all duration-300 ${
                          isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                        }`}
                      />
                    </button>
                    {/* Small screens: the detail opens inline under the chosen item. */}
                    {isActive && (
                      <div className="fade-swap -mt-2 pb-8 pl-11 lg:hidden">
                        <Detail group={group} index={index} item={item} compact />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Large screens: one detail panel beside the index. */}
            <div className="hidden pt-8 lg:block">
              <div
                key={`${group}-${active}`}
                className="fade-swap relative overflow-hidden border-t-2 border-gold bg-white p-10 xl:p-12"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-6 font-serif text-[8rem] leading-none text-mist select-none"
                >
                  0{active + 1}
                </span>
                <div className="relative">
                  <Detail group={group} index={active} item={items[active]} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
