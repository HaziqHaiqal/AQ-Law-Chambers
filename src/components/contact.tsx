"use client";

import { useState, type FormEvent } from "react";
import { firm, practiceAreas, sectors } from "@/content/site";
import { ArrowRight, ArrowUpRight, Clock, Mail, Phone } from "./icons";
import { Reveal } from "./reveal";
import { ButtonArrow, Container, Crest, SectionHeading, buttonStyles } from "./ui";

const inputClass = "enquiry-input";
const labelClass = "text-sm font-medium text-navy";

const topics = [
  ...[...practiceAreas, ...sectors].map((item) => ({ value: item.title, label: item.short })),
  { value: "General enquiry", label: "Something else" },
];

export function Contact() {
  const [draft, setDraft] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const area = String(data.get("area") || "General enquiry");
    const body = [
      `Name: ${String(data.get("name")).trim()}`,
      `Email: ${String(data.get("email")).trim()}`,
      `Phone: ${String(data.get("phone") || "Not provided").trim()}`,
      `Area: ${area}`,
      "",
      String(data.get("message")).trim(),
    ].join("\n");
    const href = `mailto:${firm.email}?subject=${encodeURIComponent(`Website enquiry — ${area}`)}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    window.location.href = href;
  }

  const details = [
    { icon: Mail, label: "Email", value: firm.email, href: `mailto:${firm.email}` },
    { icon: Phone, label: "Telephone", value: firm.phone, href: `tel:${firm.hotlineTel}` },
    { icon: Clock, label: "Office hours", value: "Monday – Friday, 9:00am – 6:00pm" },
  ];

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
            Tell us what matters to you. We’ll help you understand your options and the next steps.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* Enquiry form */}
          <Reveal className="border border-line p-6 sm:p-10 lg:col-span-7">
            <form onSubmit={onSubmit} onChange={() => setDraft(null)} className="grid gap-7">
              <fieldset>
                <legend className={labelClass}>What can we help with?</legend>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <label key={topic.value} className="cursor-pointer">
                      <input type="radio" name="area" value={topic.value} className="peer sr-only" />
                      <span className="inline-flex min-h-10 items-center rounded-[2px] border border-line px-3.5 text-sm text-slate transition-colors hover:border-navy/40 hover:text-navy peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-ink">
                        {topic.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className={labelClass}>
                    Full name <span className="text-gold-ink">*</span>
                  </span>
                  <input name="name" autoComplete="name" required maxLength={100} className={inputClass} />
                </label>
                <label className="grid gap-2">
                  <span className={labelClass}>
                    Email address <span className="text-gold-ink">*</span>
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2">
                  <span className={labelClass}>
                    Phone <span className="font-normal text-slate">(optional)</span>
                  </span>
                  <input name="phone" type="tel" autoComplete="tel" maxLength={40} className={inputClass} />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className={labelClass}>
                    Your message <span className="text-gold-ink">*</span>
                  </span>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    maxLength={1500}
                    placeholder="Briefly tell us about your matter…"
                    className={`${inputClass} resize-y`}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-[13px] leading-[1.7] text-slate">
                  Opens a draft in your email app to review and send. Please don’t include confidential documents;
                  an enquiry does not create a lawyer–client relationship.
                </p>
                <button type="submit" className={`${buttonStyles.primary} shrink-0`}>
                  Continue to email
                  <ButtonArrow />
                </button>
              </div>

              {draft && (
                <div role="status" className="bg-mist px-5 py-4 text-sm leading-relaxed text-slate">
                  <p>Your enquiry is ready — send it from your email app to complete it.</p>
                  <a
                    href={draft}
                    className="mt-2 inline-flex items-center gap-2 font-medium text-navy underline underline-offset-4"
                  >
                    <Mail className="size-3.5" />
                    Open email draft again
                  </a>
                </div>
              )}
            </form>
          </Reveal>

          {/* Chambers details */}
          <Reveal delay={100} className="flex flex-col gap-8 lg:col-span-5">
            <div className="relative isolate overflow-hidden bg-navy p-7 text-white sm:p-9">
              <Crest
                light
                className="pointer-events-none absolute -bottom-10 -right-6 -z-10 w-44 opacity-[0.07]"
              />
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold">Visit our chambers</p>
              <address className="mt-5 font-serif text-xl not-italic leading-[1.4] tracking-[-0.01em] sm:text-2xl">
                {firm.address.map((line) => (
                  <span key={line} className="block">
                    {/* Non-breaking hyphen keeps "Al-Farabi" together. */}
                    {line.replaceAll("-", "\u2011")}
                  </span>
                ))}
              </address>
              <a
                href={firm.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
              >
                Get directions
                <ArrowUpRight className="size-3.5 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            <dl className="divide-y divide-line border-y border-line">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4 py-5">
                  <dt className="contents">
                    <Icon className="row-span-2 mt-0.5 size-[18px] text-gold-ink" />
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate">{label}</span>
                  </dt>
                  <dd className="col-start-2 mt-1 break-words text-[15px]">
                    {href ? (
                      <a href={href} className="transition-colors hover:text-gold-ink">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href="#emergency"
              className="group -mt-8 flex items-center justify-between gap-4 border-b border-line py-5"
            >
              <span>
                <span className="block text-xs font-medium uppercase tracking-[0.14em] text-gold-ink">
                  Urgent matter?
                </span>
                <span className="mt-1 block text-[15px]">24/7 Ex Parte Injunction Hotline</span>
              </span>
              <ArrowRight className="size-4 text-gold-ink transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
