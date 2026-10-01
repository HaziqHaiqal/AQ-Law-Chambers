import { TestimonialCard } from "@/components/Cards/TestimonialCard";
import { testimonials } from "@/data/site";
import { Reveal } from "@/components/Motion/Reveal";
import { Container } from "@/components/Layout/Container";
import { SectionHeading } from "@/components/Typography/SectionHeading";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-line bg-mist py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <div className="grid gap-7 lg:grid-cols-2 lg:items-end lg:gap-20">
          <SectionHeading
            eyebrow="Client testimonies"
            title="In our clients’ words."
          />
          <Reveal className="max-w-md text-base leading-[1.8] text-slate lg:pb-2">
            Every matter is personal. Here is what some of the clients we have
            represented say about working with us.
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <Reveal as="li" key={t.name} delay={index * 90} className="h-full">
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
