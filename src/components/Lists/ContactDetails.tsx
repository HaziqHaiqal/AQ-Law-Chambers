import { firm } from "@/data/site";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "@/components/Icons";

const iconClass = "mt-0.5 size-[18px] shrink-0 text-gold-ink";
const linkClass = "transition-colors hover:text-gold-ink";

export function ContactDetails() {
  return (
    <ul className="grid gap-5 text-[15px] leading-relaxed text-navy">
      <li className="flex gap-4">
        <Phone className={iconClass} />
        <a href={`tel:${firm.phoneTel}`} className={linkClass}>
          {firm.phone}
        </a>
      </li>
      <li className="flex gap-4">
        <Mail className={iconClass} />
        <a
          href={`mailto:${firm.email}`}
          className={`min-w-0 break-words ${linkClass}`}
        >
          {firm.email}
        </a>
      </li>
      <li className="flex gap-4">
        <MapPin className={iconClass} />
        <div>
          <address className="not-italic">
            {/* Non-breaking hyphen keeps "Al-Farabi" together. */}
            {firm.address.slice(0, -1).join(", ").replaceAll("-", "‑")}
            <br />
            {firm.address.at(-1)}
          </address>
          <a
            href={firm.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-ink transition-colors hover:text-navy"
          >
            Get directions
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </li>
      <li className="flex gap-4">
        <Clock className={iconClass} />
        Monday – Friday, 9:00am – 6:00pm
      </li>
    </ul>
  );
}
