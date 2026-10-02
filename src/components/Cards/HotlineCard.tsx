import { firm } from "@/data/site";
import { ArrowRight, Phone } from "@/components/Icons";
import { HotlineStatus } from "@/components/Status/HotlineStatus";

export function HotlineCard() {
  return (
    <a
      href={`tel:${firm.hotlineTel}`}
      className="group block border border-white/15 p-6 transition-colors hover:border-gold/60 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="text-xs font-medium tracking-[0.16em] text-gold uppercase">
          24/7 Injunction Hotline
        </p>
        <HotlineStatus />
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="flex items-center gap-4">
          <Phone className="size-6 text-gold" />
          <span className="font-serif text-[2.1rem] leading-none">
            {firm.hotline}
          </span>
        </span>
        <ArrowRight className="size-5 text-gold transition-transform group-hover:translate-x-1" />
      </div>
    </a>
  );
}
