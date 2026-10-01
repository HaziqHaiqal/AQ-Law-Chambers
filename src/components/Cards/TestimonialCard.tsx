import type { testimonials } from "@/data/site";

type TestimonialCardProps = {
  testimonial: (typeof testimonials)[number];
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="flex h-full flex-col border-t-2 border-gold bg-white p-8 lg:p-10">
      <span
        aria-hidden="true"
        className="font-serif text-6xl leading-[0.6] text-gold"
      >
        “
      </span>
      <blockquote
        lang={testimonial.lang}
        className="mt-6 flex-1 font-serif text-xl leading-[1.55] tracking-[-0.01em]"
      >
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-8 border-t border-line pt-5">
        <p className="font-medium">{testimonial.name}</p>
        <p className="mt-1 text-sm text-slate">{testimonial.role}</p>
      </figcaption>
    </figure>
  );
}
