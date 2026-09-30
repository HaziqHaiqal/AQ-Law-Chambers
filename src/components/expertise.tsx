"use client";

import { useEffect } from "react";
import { practiceAreas, sectors } from "@/content/site";
import { Plus } from "./icons";
import { Reveal } from "./reveal";
import { ArrowLink, Container, SectionHeading } from "./ui";

type Item = { id: string; title: string; subtitle?: string; body: string };

function ExpertiseList({
  id,
  label,
  caption,
  items,
}: {
  id: string;
  label: string;
  caption: string;
  items: readonly Item[];
}) {
  return (
    <Reveal>
      <div id={id}>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3 border-b border-navy pb-5">
          <h3 className="text-sm font-medium">{label}</h3>
          <span className="text-[9px] uppercase tracking-[0.13em] text-slate">
            {caption}
          </span>
        </div>
        {items.map((item, index) => (
          <details
            key={item.id}
            id={item.id}
            className="expertise-item group border-b border-line"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-start gap-4 py-6">
              <span className="pt-1 text-[10px] text-gold-ink">
                0{index + 1}
              </span>
              <h4 className="flex-1 font-serif text-[23px] leading-[1.35] tracking-[-0.025em] transition-colors group-hover:text-gold-ink">
                {item.title}
              </h4>
              <Plus className="mt-1.5 size-4 shrink-0 text-gold-ink transition-transform group-open:rotate-45" />
            </summary>
            <div className="pb-7 pl-[30px] pr-6">
              {item.subtitle && (
                <p className="mb-3 text-[10px] font-medium uppercase leading-relaxed tracking-[0.07em] text-gold-ink">
                  {item.subtitle}
                </p>
              )}
              <p className="text-[13px] leading-[1.85] text-slate">
                {item.body}
              </p>
              <div className="mt-5">
                <ArrowLink href="#contact">Discuss your matter</ArrowLink>
              </div>
            </div>
          </details>
        ))}
      </div>
    </Reveal>
  );
}

export function Expertise() {
  useEffect(() => {
    function revealArea(hash: string) {
      const target = document.getElementById(hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    }
    function revealLinkedArea() {
      revealArea(window.location.hash);
    }
    function onAnchorClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (link) revealArea(link.hash);
    }
    revealLinkedArea();
    window.addEventListener("hashchange", revealLinkedArea);
    document.addEventListener("click", onAnchorClick);
    return () => {
      window.removeEventListener("hashchange", revealLinkedArea);
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return (
    <section
      id="expertise"
      className="border-y border-line bg-mist py-20 sm:py-24 lg:py-28"
    >
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
          <Reveal className="max-w-md text-[14px] leading-[1.9] text-slate lg:pb-1">
            The right remedy starts with understanding your world. Explore our
            capabilities by legal practice or by the industries we serve.
          </Reveal>
        </div>
        <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-2 lg:gap-20">
          <ExpertiseList
            id="practice"
            label="Practice Areas"
            caption="Local & statutory"
            items={practiceAreas}
          />
          <ExpertiseList
            id="sectors"
            label="Sectors"
            caption="International & corporate"
            items={sectors}
          />
        </div>
      </Container>
    </section>
  );
}
