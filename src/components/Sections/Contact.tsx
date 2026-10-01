import { ChambersCard } from "@/components/Cards/ChambersCard";
import { EnquiryForm } from "@/components/Forms/EnquiryForm";
import { ArrowRight } from "@/components/Icons";
import { Container } from "@/components/Layout/Container";
import { ContactDetails } from "@/components/Lists/ContactDetails";
import { Reveal } from "@/components/Motion/Reveal";
import { SectionHeading } from "@/components/Typography/SectionHeading";

export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-7 lg:grid-cols-2 lg:items-end lg:gap-20">
          <SectionHeading
            eyebrow="Start a conversation"
            title={
              <>
                Good counsel starts
                <br />
                with a conversation.
              </>
            }
          />
          <Reveal className="max-w-md text-base leading-[1.8] text-slate lg:pb-2">
            Tell us what matters to you. We’ll help you understand your options
            and the next steps.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* Enquiry form */}
          <Reveal className="border border-line p-6 sm:p-10 lg:col-span-7">
            <EnquiryForm />
          </Reveal>

          {/* Chambers details */}
          <Reveal delay={100} className="flex flex-col gap-8 lg:col-span-5">
            <ChambersCard />

            <ContactDetails />
            <a
              href="#emergency"
              className="group -mt-8 flex items-center justify-between gap-4 border-b border-line py-5"
            >
              <span>
                <span className="block text-xs font-medium tracking-[0.14em] text-gold-ink uppercase">
                  Urgent matter?
                </span>
                <span className="mt-1 block text-[15px]">
                  24/7 Ex Parte Injunction Hotline
                </span>
              </span>
              <ArrowRight className="size-4 text-gold-ink transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
