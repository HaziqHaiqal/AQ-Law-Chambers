import { testimonials } from "@/content/site";
import { Reveal } from "./reveal";
import { Container, SectionHeading } from "./ui";

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-line bg-mist py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-7 lg:grid-cols-2 lg:items-end lg:gap-20">
          <SectionHeading eyebrow="Client testimonies" title="In our clients’ words." />
          <Reveal className="max-w-md text-base leading-[1.8] text-slate lg:pb-2">
            Every matter is personal. Here is what some of the clients we have represented say about working with us.
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <Reveal as="li" key={t.name} delay={index * 90} className="h-full">
              <figure className="flex h-full flex-col border-t-2 border-gold bg-white p-8 lg:p-10">
                <span aria-hidden="true" className="font-serif text-6xl leading-[0.6] text-gold">
                  “
                </span>
                <blockquote lang={t.lang} className="mt-6 flex-1 font-serif text-xl leading-[1.55] tracking-[-0.01em]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-line pt-5">
                  <p className="font-medium">{t.name}</p>
                  <p className="mt-1 text-sm text-slate">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
