import { emergencySteps, firm } from "@/content/site";
import { HotlineStatus } from "./hotline-status";
import { ArrowRight, Phone } from "./icons";
import { Reveal } from "./reveal";
import { Container, SectionHeading } from "./ui";

export function Emergency() {
  return (
    <section id="emergency" className="relative isolate overflow-hidden bg-navy py-20 text-white sm:py-24 lg:py-28">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] -z-10 select-none font-serif text-[clamp(10rem,24vw,21rem)] leading-none tracking-[-0.04em] text-white/[0.035]"
      >
        24/7
      </span>
      <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
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
          <Reveal className="mt-10 max-w-md">
            <a
              href={`tel:${firm.hotlineTel}`}
              className="group block border border-white/15 p-6 transition-colors hover:border-gold/60 sm:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold">
                  24/7 Ex Parte Injunction Hotline
                </p>
                <HotlineStatus />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="flex items-center gap-4">
                  <Phone className="size-6 text-gold" />
                  <span className="font-serif text-[2.1rem] leading-none">{firm.hotline}</span>
                </span>
                <ArrowRight className="size-5 text-gold transition-transform group-hover:translate-x-1" />
              </div>
            </a>
            <p className="mt-4 text-sm text-slate-light">
              For an urgent matter, calling is the fastest way to reach us.
            </p>
          </Reveal>
        </div>

        <ol className="border-t border-white/20 lg:mt-2">
          {emergencySteps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 70}
              className="grid grid-cols-[3rem_1fr] border-b border-white/15 py-7"
            >
              <span className="pt-0.5 font-serif text-xl italic text-gold">0{index + 1}</span>
              <div>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.75] text-slate-light">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
