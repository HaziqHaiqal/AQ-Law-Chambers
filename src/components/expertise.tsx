"use client";

import { useEffect, useState } from "react";
import { practiceAreas, sectors } from "@/content/site";
import { ArrowRight } from "./icons";
import { Reveal } from "./reveal";
import { ArrowLink, Container, SectionHeading } from "./ui";

export function Expertise() {
  const [active, setActive] = useState(practiceAreas[0].id);

  // Highlight the area currently being read in the sticky index.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current) setActive(current.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const area of practiceAreas) {
      const el = document.getElementById(area.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="expertise" className="border-y border-line bg-mist py-20 sm:py-24 lg:py-28">
      <Container>
        <div id="practice" className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Sticky introduction and index */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="Areas of expertise"
              title={
                <>
                  Specialist focus.
                  <br />A wider perspective.
                </>
              }
              intro="From dispute resolution to property and insurance, we advise and represent clients with the same care and precision."
            />
            <nav aria-label="Areas of expertise" className="mt-10 hidden lg:block">
              <ol className="border-t border-line">
                {practiceAreas.map((area, index) => {
                  const isActive = area.id === active;
                  return (
                    <li key={area.id}>
                      <a
                        href={`#${area.id}`}
                        aria-current={isActive ? "true" : undefined}
                        className={`group flex items-center gap-4 border-b border-line py-4 text-[15px] transition-colors ${
                          isActive ? "text-navy" : "text-slate hover:text-navy"
                        }`}
                      >
                        <span className="w-5 text-xs tabular-nums text-gold-ink">0{index + 1}</span>
                        <span
                          aria-hidden="true"
                          className={`h-px transition-all duration-500 ${isActive ? "w-8 bg-gold" : "w-3 bg-line group-hover:w-5"}`}
                        />
                        <span className={`flex-1 ${isActive ? "font-medium" : ""}`}>{area.title}</span>
                        <ArrowRight
                          className={`size-4 text-gold-ink transition-all duration-300 ${
                            isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                          }`}
                        />
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          {/* Areas in full */}
          <div>
            {practiceAreas.map((area, index) => (
              <article
                key={area.id}
                id={area.id}
                className="border-b border-line py-12 first:pt-0 last:border-b-0 last:pb-0 lg:py-14"
              >
                <Reveal>
                  <div className="flex items-center gap-5">
                    <span className="font-serif text-[2rem] leading-none italic text-gold-ink">0{index + 1}</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-line" />
                  </div>
                  <h3 className="mt-7 text-balance font-serif text-[1.9rem] leading-[1.2] tracking-[-0.02em] sm:text-[2.1rem]">
                    {area.title}
                  </h3>
                  {area.subtitle && (
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-gold-ink">{area.subtitle}</p>
                  )}
                  <div className="mt-6 space-y-4 text-base leading-[1.8] text-slate">
                    {area.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                  {area.list && (
                    <div className="mt-7">
                      <p className="text-sm font-medium text-navy">{area.list.label}</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {area.list.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-[2px] border border-line bg-white px-3 py-1.5 text-sm text-slate"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-8">
                    <ArrowLink href="#contact">Discuss your matter</ArrowLink>
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </div>

        {/* Sectors */}
        <Reveal className="mt-24 lg:mt-28">
          <div id="sectors" className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-navy pb-5">
            <h3 className="font-serif text-[1.65rem] tracking-[-0.02em]">Sectors we serve</h3>
            <p className="text-sm text-slate">International &amp; corporate focus</p>
          </div>
          <ul className="grid md:grid-cols-3">
            {sectors.map((sector, index) => (
              <li
                key={sector.id}
                id={sector.id}
                className={`border-b border-line py-8 md:border-b-0 md:py-9 md:pr-8 ${index > 0 ? "md:border-l md:pl-8" : ""}`}
              >
                <h4 className="text-balance font-serif text-xl leading-snug">{sector.title}</h4>
                <p className="mt-3 text-[15px] leading-[1.75] text-slate">{sector.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
