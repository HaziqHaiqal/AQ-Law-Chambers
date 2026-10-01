import { proceedings } from "@/data/site";
import { ProceedingsList } from "@/components/Lists/ProceedingsList";
import { Container } from "@/components/Layout/Container";
import { SectionHeading } from "@/components/Typography/SectionHeading";

export function Proceedings() {
  return (
    <section
      id="process"
      className="border-t border-line py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="The way forward"
          title="Clarity at every stage."
          intro="Urgent proceedings can feel unfamiliar. We guide you through the process, so you understand what happens next."
        />
        <ProceedingsList stages={proceedings} />
      </Container>
    </section>
  );
}
