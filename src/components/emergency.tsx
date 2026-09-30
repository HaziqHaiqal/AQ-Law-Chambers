import { emergencySteps, firm } from "@/content/site";
import { ArrowUpRight, Phone } from "./icons";
import { Reveal } from "./reveal";
import { Container, SectionHeading } from "./ui";

export function Emergency() {
  return (
    <section id="emergency" className="bg-navy py-20 text-white sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            tone="light"
            eyebrow="When time is critical"
            title={
              <>
                Urgent matters.
                <br />
                <em className="font-normal text-gold">Immediate attention.</em>
              </>
            }
            intro="If assets are being moved or digital evidence is at risk, speak to us immediately. Our emergency hotline is available around the clock."
          />
          <a
            href={`tel:${firm.hotlineTel}`}
            className="group mt-8 inline-flex items-center gap-5"
          >
            <span className="grid size-12 place-items-center rounded-full border border-gold/40">
              <Phone className="size-5 text-gold" />
            </span>
            <span>
              <span className="block text-[9px] uppercase tracking-[0.14em] text-slate-light">
                24/7 Ex Parte Injunction Hotline
              </span>
              <span className="mt-1.5 block text-[26px] font-medium tracking-[0.01em]">
                {firm.hotline}
              </span>
            </span>
            <ArrowUpRight className="ml-2 size-5 text-gold transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
          <p className="mt-6 text-[11px] text-slate-light">
            For an urgent matter, calling is the fastest way to reach us.
          </p>
        </div>
        <ol className="border-t border-white/20 lg:mt-1">
          {emergencySteps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 60}
              className="flex gap-5 border-b border-white/15 py-5"
            >
              <span className="pt-1 font-serif text-lg italic text-gold">
                0{index + 1}
              </span>
              <div>
                <h3 className="text-[13px] font-medium">{step.title}</h3>
                <p className="mt-2 text-xs leading-[1.85] text-slate-light">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
