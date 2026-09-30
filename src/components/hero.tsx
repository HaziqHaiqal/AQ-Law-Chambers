import { Fragment } from "react";
import { firm } from "@/content/site";
import { HotlineStatus } from "./hotline-status";
import { ArrowRight } from "./icons";
import { ButtonArrow, Container, Crest, Eyebrow, buttonStyles } from "./ui";

// Each line of the headline, as words that rise in turn; the last group is set in gold italics.
const headline: { text: string; em?: boolean }[][] = [
  [{ text: "Clarity" }, { text: "in" }, { text: "complexity." }],
  // "it matters." is one unit so it never splits across lines.
  [{ text: "Resolve" }, { text: "when" }, { text: "it matters.", em: true }],
];

const capabilities = [
  "Mareva injunctions",
  "Anton Piller orders",
  "Worldwide freezing orders",
  "Bankers Trust orders",
  "Norwich Pharmacal relief",
  "Digital evidence & discovery",
  "Crypto & Web3 asset recovery",
  "ESG & carbon fraud litigation",
  "Cloud & technology disputes",
];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading">
      <Container className="grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:pb-20 lg:pt-20">
        <div className="hero-copy">
          <Eyebrow>Rooted in Malaysia. Reaching beyond.</Eyebrow>
          <h1
            id="hero-heading"
            className="mt-7 font-serif text-[clamp(2.75rem,5.4vw,4.75rem)] font-normal leading-[1.06] tracking-[-0.035em]"
          >
            {headline.map((line, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {line.map((word, wi) => {
                  const position = headline.slice(0, li).reduce((n, l) => n + l.length, 0) + wi;
                  const delay = 120 + position * 70;
                  return (
                    <Fragment key={word.text}>
                      {wi > 0 && " "}
                      <span className="word-mask whitespace-nowrap">
                        <span
                          className={word.em ? "italic text-gold-ink" : undefined}
                          style={{ animationDelay: `${delay}ms` }}
                        >
                          {word.text}
                        </span>
                      </span>
                    </Fragment>
                  );
                })}
              </Fragment>
            ))}
          </h1>
          <p className="mt-7 max-w-[32rem] text-lg leading-[1.7] text-slate">
            Cross-Border Digital Asset Recovery, Emergency Mareva Injunctions
            &amp; Specialised High Court Litigation.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a href="#contact" className={buttonStyles.primary}>
              Speak to a partner <ButtonArrow />
            </a>
            <a
              href="#expertise"
              className="group inline-flex min-h-11 items-center gap-2.5 text-sm font-medium transition-colors hover:text-gold-ink"
            >
              Explore our expertise
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Crest panel — also carries the 24/7 hotline required in the hero. */}
        <div className="hero-art relative isolate flex min-h-[500px] flex-col overflow-hidden bg-navy text-white lg:min-h-[560px]">
          <div className="hero-arch" aria-hidden="true" />
          <div className="flex flex-1 flex-col items-center justify-center px-8 pb-6 pt-12">
            <Crest light preload className="w-[118px] sm:w-[140px] lg:w-[156px]" />
            <p className="mt-6 font-display text-lg font-semibold tracking-[0.06em] sm:text-xl">
              A&amp;Q LAW CHAMBERS
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-slate-light">
              Advocates &amp; Solicitors
            </p>
          </div>

          <a
            href={`tel:${firm.hotlineTel}`}
            className="group relative border-t border-white/12 bg-navy/60 px-7 py-6 backdrop-blur-sm transition-colors hover:bg-navy-2 sm:px-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold">
                24/7 Ex Parte Injunction Hotline
              </p>
              <HotlineStatus />
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <span className="font-serif text-[2.1rem] leading-none tracking-[-0.01em]">
                {firm.hotline}
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-navy">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </a>
        </div>
      </Container>

      {/* Capability ticker */}
      <div className="border-y border-line">
        <div className="ticker overflow-hidden py-5" aria-label="Key capabilities">
          <ul className="ticker-track">
            {[0, 1].map((copy) =>
              capabilities.map((c) => (
                <li
                  key={`${copy}-${c}`}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center gap-8 pr-8 font-serif text-xl italic text-slate sm:text-[1.35rem]"
                >
                  {c}
                  <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
                </li>
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
