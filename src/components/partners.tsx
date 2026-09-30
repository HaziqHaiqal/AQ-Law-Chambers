import { firm, partners, teamMembers } from "@/content/site";
import { ArrowUpRight, Plus } from "./icons";
import { Reveal } from "./reveal";
import { Container, SectionHeading } from "./ui";

export function Partners() {
  return (
    <section id="partners" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-7 lg:grid-cols-2 lg:items-end lg:gap-20">
          <SectionHeading
            eyebrow="Our partners & legal team"
            title={
              <>
                Your matter.
                <br />
                Our personal commitment.
              </>
            }
          />
          <Reveal className="max-w-md text-[14px] leading-[1.9] text-slate lg:pb-1">
            Direct access to the people leading your case. From the first
            conversation to the next critical step, our partners remain
            personally involved.
          </Reveal>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:mt-14 lg:gap-20">
          {partners.map((partner, index) => (
            <Reveal key={partner.name} delay={index * 100} className="h-full">
              <article className="flex h-full flex-col border-t border-navy pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-medium uppercase tracking-[0.17em] text-gold-ink">
                    Partner / 0{index + 1}
                  </p>
                  <span
                    aria-hidden="true"
                    className="grid size-12 place-items-center rounded-full border border-line font-serif text-lg italic text-gold-ink"
                  >
                    {partner.initials}
                  </span>
                </div>
                <h3 className="mt-5 max-w-sm font-serif text-[29px] leading-[1.2] tracking-[-0.03em] md:min-h-[70px]">
                  {partner.name}
                </h3>
                <p className="mt-3 text-[11px] text-gold-ink">
                  Advocate &amp; Solicitor
                </p>
                <p className="mb-6 mt-5 text-[13px] leading-[1.85] text-slate">
                  {partner.bio}
                </p>
                <details className="group mt-auto border-y border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[11px] font-medium">
                    Experience &amp; qualifications
                    <Plus className="size-4 text-gold-ink transition-transform group-open:rotate-45" />
                  </summary>
                  <div className="pb-5">
                    <ul className="space-y-2 text-xs leading-relaxed text-slate">
                      {partner.expertise.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1 shrink-0 bg-gold-ink"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 border-t border-line pt-4 text-xs text-slate">
                      {partner.qualifications[0]}
                    </p>
                  </div>
                </details>
                <a
                  href={`mailto:${firm.email}?subject=${encodeURIComponent(`Attention: ${partner.name}`)}`}
                  className="group mt-5 flex min-h-8 items-center justify-between text-[11px] font-medium"
                >
                  Contact {index === 0 ? "Nur Afiqah" : "Nur Qisdina"}
                  <ArrowUpRight className="size-4 text-gold-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-10">
          {teamMembers.map((member, index) => (
            <Reveal
              key={member.name}
              delay={(index % 3) * 80}
              className="h-full"
            >
              <article className="flex h-full flex-col border-t border-line pt-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gold-ink">
                    {member.role}
                  </p>
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-line font-serif text-base italic text-gold-ink"
                  >
                    {member.initials}
                  </span>
                </div>
                <h3 className="mb-6 mt-5 font-serif text-[25px] leading-[1.3] tracking-[-0.025em]">
                  {member.name}
                </h3>
                <a
                  href={`mailto:${firm.email}?subject=${encodeURIComponent(`Attention: ${member.name}`)}`}
                  aria-label={`Email ${member.name}`}
                  className="group mt-auto flex min-h-11 items-center justify-between gap-4 border-t border-line pt-3 text-[11px] font-medium"
                >
                  Contact {member.contactName}
                  <ArrowUpRight className="size-4 shrink-0 text-gold-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
