import { proceedings } from "@/content/site";
import { Reveal } from "./reveal";
import { Container, SectionHeading } from "./ui";

export function Proceedings() {
  return (
    <section id="process" className="border-t border-line py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="The way forward"
          title="Clarity at every stage."
          intro="Urgent proceedings can feel unfamiliar. We guide you through the process, so you understand what happens next."
        />
        <ol className="mt-12 grid gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {proceedings.map((stage, index) => (
            <Reveal
              as="li"
              key={stage.step}
              delay={index * 70}
              className="relative lg:pr-9"
            >
              <div className="flex items-center gap-4">
                <span className="font-serif text-[28px] italic text-gold-ink">
                  {stage.step}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-5 text-[13px] font-medium">{stage.title}</h3>
              <p className="mt-3 text-xs leading-[1.9] text-slate">
                {stage.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
