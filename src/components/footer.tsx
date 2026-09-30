import { firm } from "@/content/site";
import { ArrowUpRight } from "./icons";
import { BrandMark, Container } from "./ui";

const links = [
  { label: "The Firm", href: "#firm" },
  { label: "Practice Areas", href: "#practice" },
  { label: "Sectors", href: "#sectors" },
  { label: "Our Partners", href: "#partners" },
  { label: "Emergency Protocol", href: "#emergency" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-mist">
      <Container className="pb-7 pt-14 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-16">
          <div>
            <a
              href="#top"
              aria-label={`${firm.name} home`}
              className="inline-block"
            >
              <BrandMark />
            </a>
            <p className="mt-5 max-w-[240px] text-xs leading-[1.9] text-slate">
              Clear thinking. Considered counsel.
              <br />
              When it matters most.
            </p>
          </div>
          <div>
            <h3 className="text-[9px] font-medium uppercase tracking-[0.16em] text-gold-ink">
              Explore
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 text-[11px]">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-gold-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[9px] font-medium uppercase tracking-[0.16em] text-gold-ink">
              Our chambers
            </h3>
            <address className="mt-5 text-[11px] not-italic leading-[1.9] text-slate">
              {firm.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={firm.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[11px]"
            >
              View location
              <ArrowUpRight className="size-3 text-gold-ink" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[9px] leading-relaxed text-slate">
          <p>
            © {new Date().getFullYear()} A&amp;Q Law Chambers (Advocates &amp;
            Solicitors). All rights reserved.
          </p>
          <a
            href="#top"
            className="inline-flex min-h-8 items-center gap-2 text-navy"
          >
            Back to top <ArrowUpRight className="size-3 -rotate-45" />
          </a>
        </div>
        <p className="mt-3 max-w-3xl text-[9px] leading-[1.8] text-slate">
          The information on this website is for general purposes only and does
          not constitute legal advice. No lawyer–client relationship is created
          by accessing this website or contacting the firm through it.
        </p>
      </Container>
    </footer>
  );
}
