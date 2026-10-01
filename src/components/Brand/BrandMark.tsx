import { Crest } from "./Crest";

/** Crest beside the logo's wordmark: "A&Q" over a gold rule and "LAW · CHAMBERS", set in Cinzel to match. */
export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Crest light={light} preload className="w-9 sm:w-10" />
      <span
        className={`flex flex-col items-center font-display leading-none ${light ? "text-white" : "text-navy"}`}
      >
        <span className="text-[1.4rem] font-bold tracking-[0.06em] sm:text-[1.55rem]">
          A&amp;Q
        </span>
        <span
          aria-hidden="true"
          className="mt-1 flex w-full items-center gap-1"
        >
          <span className="h-px flex-1 bg-gold" />
          <span className="size-[3px] rounded-full bg-gold" />
          <span className="h-px flex-1 bg-gold" />
        </span>
        <span className="mt-1 flex items-center gap-1 text-[0.5rem] font-semibold tracking-[0.14em] sm:text-[0.55rem]">
          LAW
          <span
            aria-hidden="true"
            className="size-[3px] rounded-full bg-gold"
          />
          CHAMBERS
        </span>
      </span>
    </span>
  );
}
