import { proceedings } from "@/content/site";
import { Reveal } from "./reveal";
import { Container, SectionHeading } from "./ui";

export function Proceedings() {
  return (
    <section id="process" className="border-t border-line py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="The way forward"
          title="Clarity at every stage."
          intro="Urgent proceedings can feel unfamiliar. We guide you through the process, so you understand what happens next."
        />
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-0">
          {proceedings.map((stage, index) => (
            <Reveal as="li" key={stage.step} delay={index * 70} className="relative lg:pr-12">
              <div className="flex items-center gap-5">
                <span className="font-serif text-[2rem] leading-none italic text-gold-ink">{stage.step}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-7 text-lg font-medium">{stage.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-slate">{stage.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
