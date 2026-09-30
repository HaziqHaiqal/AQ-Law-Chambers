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

const headingClass = "text-xs font-medium uppercase tracking-[0.16em] text-gold-ink";

export function Footer() {
  return (
    <footer className="border-t border-line bg-mist">
      <Container className="pt-16 sm:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#top" aria-label={`${firm.name} home`} className="inline-block">
              <BrandMark />
            </a>
            <p className="mt-6 max-w-[260px] text-[15px] leading-[1.75] text-slate">
              Clear thinking. Considered counsel. When it matters most.
            </p>
          </div>

          <div>
            <h3 className={headingClass}>Explore</h3>
            <ul className="mt-5 grid gap-3 text-[15px]">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-gold-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>Our chambers</h3>
            <address className="mt-5 text-[15px] not-italic leading-[1.75] text-slate">
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
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold-ink"
            >
              View location
              <ArrowUpRight className="size-3.5 text-gold-ink" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <div>
            <h3 className={headingClass}>Get in touch</h3>
            <ul className="mt-5 grid gap-3 text-[15px]">
              <li>
                <a href={`tel:${firm.hotlineTel}`} className="transition-colors hover:text-gold-ink">
                  {firm.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${firm.email}`} className="break-all transition-colors hover:text-gold-ink">
                  {firm.email}
                </a>
              </li>
              <li className="text-sm text-slate">24/7 Ex Parte Injunction Hotline</li>
            </ul>
          </div>
        </div>

        {/* Bottom-right is left clear for the floating back-to-top button. */}
        <div className="mt-14 border-t border-line pb-24 pt-6 sm:pb-14">
          <div className="grid max-w-3xl gap-2 text-[13px] leading-[1.7] text-slate">
            <p>
              © {new Date().getFullYear()} A&amp;Q Law Chambers (Advocates &amp; Solicitors). All rights reserved.
            </p>
            <p>
              The information on this website is for general purposes only and does not constitute legal advice. No
              lawyer–client relationship is created by accessing this website or contacting the firm through it.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
