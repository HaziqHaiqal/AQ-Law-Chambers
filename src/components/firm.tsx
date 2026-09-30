import { overview } from "@/content/site";
import { Globe, Pillar } from "./icons";
import { Reveal } from "./reveal";
import { ArrowLink, Container, SectionHeading } from "./ui";

export function Firm() {
  return (
    <section id="firm" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-9 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="The firm"
            title={
              <>
                Personal in approach.
                <br />
                Precise in action.
              </>
            }
          />
          <Reveal delay={80} className="lg:pt-9">
            <p className="text-base leading-[1.8] text-slate">
              {overview.paragraphs[0]}
            </p>
            <div className="mt-7">
              <ArrowLink href="#partners">
                Meet the partners behind your matter
              </ArrowLink>
            </div>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 sm:gap-12 lg:mt-16 lg:gap-20">
          <Reveal className="flex gap-5">
            <Pillar className="mt-1 size-7 shrink-0 text-gold-ink" />
            <div>
              <h3 className="font-serif text-2xl tracking-[-0.02em]">
                Local strength.
              </h3>
              <p className="mt-2.5 max-w-md text-[15px] leading-[1.75] text-slate">
                Focused High Court representation, with the urgency and
                preparation that freezing, search and disclosure applications
                demand.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100} className="flex gap-5">
            <Globe className="mt-1 size-7 shrink-0 text-gold-ink" />
            <div>
              <h3 className="font-serif text-2xl tracking-[-0.02em]">
                International perspective.
              </h3>
              <p className="mt-2.5 max-w-md text-[15px] leading-[1.75] text-slate">
                Digital asset tracing and cross-border recovery strategies that
                connect legal remedies with the technical evidence behind your
                case.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
