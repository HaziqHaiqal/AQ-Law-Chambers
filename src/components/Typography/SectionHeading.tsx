import type { ReactNode } from "react";
import { Reveal } from "@/components/Motion/Reveal";
import { Eyebrow } from "./Eyebrow";

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
        className={`mt-5 font-serif text-[2.1rem] leading-[1.14] font-normal tracking-[-0.025em] text-balance sm:text-[2.6rem] lg:text-[2.9rem] ${
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
