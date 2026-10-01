import { firm } from "@/data/site";
import { Crest } from "@/components/Brand/Crest";
import { ArrowUpRight } from "@/components/Icons";

export function ChambersCard() {
  return (
    <div className="relative isolate overflow-hidden bg-navy p-7 text-white sm:p-9">
      <Crest
        light
        className="pointer-events-none absolute -right-6 -bottom-10 -z-10 w-44 opacity-[0.07]"
      />
      <p className="text-xs font-medium tracking-[0.16em] text-gold uppercase">
        Visit our chambers
      </p>
      <address className="mt-5 font-serif text-xl leading-[1.4] tracking-[-0.01em] not-italic sm:text-2xl">
        {firm.address.map((line) => (
          <span key={line} className="block">
            {/* Non-breaking hyphen keeps "Al-Farabi" together. */}
            {line.replaceAll("-", "\u2011")}
          </span>
        ))}
      </address>
      <a
        href={firm.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="group mt-7 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
      >
        Get directions
        <ArrowUpRight className="size-3.5 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
