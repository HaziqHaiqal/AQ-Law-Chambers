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
      className={`flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] ${tone === "light" ? "text-gold" : "text-gold-ink"}`}
    >
      <span aria-hidden="true" className="h-px w-7 bg-current" />
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
        className={`mt-5 font-serif text-[2.25rem] font-normal leading-[1.14] tracking-[-0.035em] sm:text-[2.75rem] lg:text-[3.15rem] ${
          tone === "light" ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 max-w-xl text-[0.94rem] leading-[1.85] ${tone === "light" ? "text-slate-light" : "text-slate"}`}
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
      className={`group inline-flex items-center gap-2 text-sm font-semibold ${
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
      src={light ? "/brand/crest-light.png" : "/brand/crest.png"}
      alt="A&Q Law Chambers crest"
      width={245}
      height={294}
      preload={preload}
      sizes="(max-width: 640px) 160px, 245px"
      className={`h-auto ${className}`}
    />
  );
}

/** Crest + wordmark set in Cinzel, matching the logo lockup. */
export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <Crest light={light} preload className="w-9 sm:w-10" />
      <span className="leading-none">
        <span
          className={`block font-display text-[0.8rem] font-semibold tracking-[0.04em] sm:text-[0.93rem] ${light ? "text-white" : "text-navy"}`}
        >
          A&amp;Q LAW CHAMBERS
        </span>
        <span
          className={`mt-2 block text-[0.52rem] font-medium uppercase tracking-[0.2em] ${light ? "text-slate-light" : "text-slate"}`}
        >
          Advocates &amp; Solicitors
        </span>
      </span>
    </span>
  );
}
