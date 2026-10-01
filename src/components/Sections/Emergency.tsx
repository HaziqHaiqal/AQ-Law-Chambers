import { emergencySteps } from "@/data/site";
import { HotlineCard } from "@/components/Cards/HotlineCard";
import { EmergencySteps } from "@/components/Lists/EmergencySteps";
import { Reveal } from "@/components/Motion/Reveal";
import { Container } from "@/components/Layout/Container";
import { SectionHeading } from "@/components/Typography/SectionHeading";

export function Emergency() {
  return (
    <section
      id="emergency"
      className="relative isolate overflow-hidden bg-navy py-20 text-white sm:py-24 lg:py-28"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] -z-10 font-serif text-[clamp(10rem,24vw,21rem)] leading-none tracking-[-0.04em] text-white/[0.035] select-none"
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
            <HotlineCard />
            <p className="mt-4 text-sm text-slate-light">
              For an urgent matter, calling is the fastest way to reach us.
            </p>
          </Reveal>
        </div>

        <EmergencySteps steps={emergencySteps} />
      </Container>
    </section>
  );
}
