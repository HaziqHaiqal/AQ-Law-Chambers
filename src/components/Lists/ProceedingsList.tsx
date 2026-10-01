import type { proceedings } from "@/data/site";
import { Reveal } from "@/components/Motion/Reveal";

type ProceedingsListProps = {
  stages: readonly (typeof proceedings)[number][];
};

export function ProceedingsList({ stages }: ProceedingsListProps) {
  return (
    <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-0">
      {stages.map((stage, index) => (
        <Reveal
          as="li"
          key={stage.step}
          delay={index * 70}
          className="relative lg:pr-12"
        >
          <div className="flex items-center gap-5">
            <span className="font-serif text-[2rem] leading-none text-gold-ink italic">
              {stage.step}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </div>
          <h3 className="mt-7 text-lg font-medium">{stage.title}</h3>
          <p className="mt-3 text-[15px] leading-[1.8] text-slate">
            {stage.body}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
