import { firm } from "@/content/site";
import { ArrowUpRight, Phone } from "./icons";
import { BrandMark, Container } from "./ui";

const links = [
  { label: "The Firm", href: "#firm" },
  { label: "Practice Areas", href: "#practice" },
  { label: "Sectors", href: "#sectors" },
  { label: "Our Partners", href: "#partners" },
  { label: "Emergency Protocol", href: "#emergency" },
  { label: "Contact", href: "#contact" },
];

const headingClass = "text-[11px] font-medium uppercase tracking-[0.16em] text-gold";
const linkClass = "text-white/90 transition-colors hover:text-gold";

export function Footer() {
  return (
    <footer className="bg-navy text-sm text-slate-light">
      <Container>
        <div className="grid gap-8 py-10 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-14 lg:py-12">
          {/* Brand and address */}
          <div>
            <a href="#top" aria-label={`${firm.name} home`} className="inline-block">
              <BrandMark light />
            </a>
            <address className="mt-5 max-w-[17rem] not-italic leading-[1.7]">{firm.address.join(", ")}</address>
            <a
              href={firm.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-2 inline-flex items-center gap-1.5 font-medium ${linkClass}`}
            >
              View location
              <ArrowUpRight className="size-3.5 text-gold" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          {/* Site links — hidden on phones, where the menu already offers them. */}
          <nav aria-label="Footer" className="hidden sm:block">
            <h3 className={headingClass}>Explore</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className={headingClass}>Contact</h3>
            <dl className="mt-4 grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-2.5">
              <dt>Tel</dt>
              <dd>
                <a href={`tel:${firm.phoneTel}`} className={linkClass}>
                  {firm.phone}
                </a>
              </dd>
              <dt>Fax</dt>
              <dd className="text-white/90">{firm.fax}</dd>
              <dt>Email</dt>
              <dd className="break-words">
                <a href={`mailto:${firm.email}`} className={linkClass}>
                  {firm.email}
                </a>
              </dd>
            </dl>
            <a
              href={`tel:${firm.hotlineTel}`}
              className="mt-5 inline-flex items-center gap-2.5 font-medium text-gold transition-colors hover:text-white"
            >
              <Phone className="size-4" />
              24/7 Ex Parte Hotline · {firm.hotline}
            </a>
          </div>
        </div>

        {/* Legal. Right padding keeps the text clear of the floating back-to-top button. */}
        <div className="grid gap-1.5 border-t border-white/10 py-5 pr-16 text-xs leading-[1.7] text-slate-light/80 sm:pr-20 lg:grid-cols-[auto_minmax(0,42rem)] lg:justify-between lg:gap-12">
          <p>© {new Date().getFullYear()} A&amp;Q Law Chambers (Advocates &amp; Solicitors). All rights reserved.</p>
          <p>
            The information on this website is for general purposes only and does not constitute legal advice. No
            lawyer–client relationship is created by accessing this website or contacting the firm through it.
          </p>
        </div>
      </Container>
    </footer>
  );
}
