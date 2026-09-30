import { firm } from "@/content/site";
import { ArrowRight, ArrowUpRight, Phone } from "./icons";
import { ButtonArrow, Container, Crest, Eyebrow, buttonStyles } from "./ui";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading">
      <Container className="grid items-center gap-12 pb-14 pt-12 sm:pb-16 sm:pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pb-20 lg:pt-16">
        <div className="hero-copy">
          <Eyebrow>Rooted in Malaysia. Reaching beyond.</Eyebrow>
          <h1
            id="hero-heading"
            className="mt-7 font-serif text-[clamp(3.2rem,5.7vw,5rem)] font-normal leading-[1.055] tracking-[-0.055em]"
          >
            Clarity in complexity.
            <br />
            Resolve when
            <br />
            <em className="font-normal text-gold-ink">it matters.</em>
          </h1>
          <p className="mt-7 max-w-[29rem] text-[15px] leading-[1.85] text-slate sm:text-base">
            Cross-Border Digital Asset Recovery, Emergency Mareva Injunctions
            &amp; Specialised High Court Litigation.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-5">
            <a href="#contact" className={buttonStyles.primary}>
              Speak to a partner <ButtonArrow />
            </a>
            <a
              href="#practice"
              className="group inline-flex min-h-11 items-center gap-3 text-xs font-medium"
            >
              Explore our expertise{" "}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <p className="mt-10 flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate">
            <span
              className="size-1 rounded-full bg-gold-ink"
              aria-hidden="true"
            />
            Partner-led counsel. Personal commitment.
          </p>
        </div>

        <div
          className="hero-art relative isolate flex aspect-[0.92] max-h-[530px] flex-col items-center justify-center overflow-hidden bg-navy text-white"
          aria-label="A&Q Law Chambers, Advocates and Solicitors"
        >
          <div className="hero-art-grid" aria-hidden="true" />
          <span className="absolute left-7 top-7 text-[9px] uppercase tracking-[0.22em] text-slate-light">
            Shah Alam · Malaysia
          </span>
          <span
            aria-hidden="true"
            className="absolute right-7 top-6 text-xl font-light text-gold/70"
          >
            +
          </span>
          <div className="hero-arch" aria-hidden="true" />
          <div className="hero-orbit" aria-hidden="true" />
          <div className="relative flex -translate-y-3 flex-col items-center">
            <Crest
              light
              preload
              className="w-[140px] sm:w-[170px] lg:w-[185px]"
            />
            <p className="mt-7 font-display text-lg font-semibold tracking-[0.06em] sm:text-xl">
              A&amp;Q LAW CHAMBERS
            </p>
            <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-slate-light">
              Advocates &amp; Solicitors
            </p>
          </div>
          <div className="absolute inset-x-7 bottom-6 flex items-end justify-between border-t border-white/15 pt-5">
            <p className="text-[9px] uppercase leading-[1.9] tracking-[0.2em] text-slate-light">
              Local knowledge.
              <br />
              <span className="text-white">Global perspective.</span>
            </p>
            <ArrowUpRight className="size-5 text-gold" />
          </div>
        </div>
      </Container>

      <div className="bg-navy text-white">
        <Container className="flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex items-start gap-4 sm:items-center">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/35 text-gold">
              <Phone className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-gold">
                24/7 Ex Parte Injunction Hotline
              </p>
              <p className="mt-1.5 text-[13px] text-slate-light">
                When assets or evidence are at risk, every moment matters.
              </p>
            </div>
          </div>
          <a
            href={`tel:${firm.hotlineTel}`}
            className="group flex shrink-0 items-center justify-between gap-7 border-t border-white/15 pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0"
          >
            <span>
              <span className="block text-[9px] uppercase tracking-[0.15em] text-slate-light">
                Speak with us now
              </span>
              <span className="mt-1 block text-xl font-medium tracking-[0.02em]">
                {firm.hotline}
              </span>
            </span>
            <ArrowRight className="size-5 text-gold transition-transform group-hover:translate-x-1" />
          </a>
        </Container>
      </div>
    </section>
  );
}
