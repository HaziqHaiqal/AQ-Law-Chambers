import { EnquiryForm } from "@/components/Forms/EnquiryForm";
import { Container } from "@/components/Layout/Container";
import { ContactDetails } from "@/components/Lists/ContactDetails";
import { Reveal } from "@/components/Motion/Reveal";
import { SectionHeading } from "@/components/Typography/SectionHeading";

export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12">
          <SectionHeading
            className="lg:col-span-5"
            eyebrow="Start a conversation"
            title={
              <>
                Good counsel starts
                <br />
                with a conversation.
              </>
            }
            intro="Tell us what matters to you. We’ll help you understand your options and the next steps."
          />
          <Reveal
            delay={100}
            className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1"
          >
            <EnquiryForm />
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
            <ContactDetails />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
