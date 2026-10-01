import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";
import { Reveal } from "./reveal";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1320px] px-6 sm:px-10 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] ${tone === "light" ? "text-gold" : "text-gold-ink"}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <div>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      </div>
      <h2
        className={`mt-5 text-balance font-serif text-[2.1rem] font-normal leading-[1.14] tracking-[-0.025em] sm:text-[2.6rem] lg:text-[2.9rem] ${
          tone === "light" ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 max-w-xl text-base leading-[1.8] ${tone === "light" ? "text-slate-light" : "text-slate"}`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

const buttonBase =
  "group inline-flex min-h-12 items-center justify-center gap-6 rounded-[2px] px-6 py-3.5 text-[12px] font-medium tracking-[0.02em] transition-colors duration-200";

export const buttonStyles = {
  primary: `${buttonBase} bg-navy text-white hover:bg-navy-3`,
  gold: `${buttonBase} bg-gold text-navy hover:bg-[#c29f2c]`,
  light: `${buttonBase} bg-white text-navy hover:bg-mist`,
  outlineLight: `${buttonBase} border border-white/40 text-white hover:border-white hover:bg-white/5`,
  outlineDark: `${buttonBase} border border-navy/25 text-navy hover:border-navy`,
};

export function ButtonArrow() {
  return (
    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
  );
}

/** Text link with an arrow, used for "Learn more"-style actions. */
export function ArrowLink({
  href,
  children,
  tone = "dark",
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 text-[15px] font-medium ${
        tone === "light"
          ? "text-white hover:text-gold"
          : "text-navy hover:text-gold-ink"
      }`}
    >
      <span className="border-b border-current/30 pb-0.5 group-hover:border-current">
        {children}
      </span>
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}

/** The official A&Q crest (extracted from the firm logo). `light` is the reversed version for navy backgrounds. */
export function Crest({
  light = false,
  className = "",
  preload = false,
}: {
  light?: boolean;
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={light ? "/brand/logo-light.png" : "/brand/logo-dark.png"}
      alt="A&Q Law Chambers crest"
      width={453}
      height={536}
      preload={preload}
      sizes="(max-width: 640px) 160px, 288px"
      className={`h-auto ${className}`}
    />
  );
}

/** Crest beside the logo's wordmark: "A&Q" over a gold rule and "LAW · CHAMBERS", set in Cinzel to match. */
export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Crest light={light} preload className="w-9 sm:w-10" />
      <span className={`flex flex-col items-center font-display leading-none ${light ? "text-white" : "text-navy"}`}>
        <span className="text-[1.4rem] font-bold tracking-[0.06em] sm:text-[1.55rem]">A&amp;Q</span>
        <span aria-hidden="true" className="mt-1 flex w-full items-center gap-1">
          <span className="h-px flex-1 bg-gold" />
          <span className="size-[3px] rounded-full bg-gold" />
          <span className="h-px flex-1 bg-gold" />
        </span>
        <span className="mt-1 flex items-center gap-1 text-[0.5rem] font-semibold tracking-[0.14em] sm:text-[0.55rem]">
          LAW
          <span aria-hidden="true" className="size-[3px] rounded-full bg-gold" />
          CHAMBERS
        </span>
      </span>
    </span>
  );
}
