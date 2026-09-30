"use client";

import { useState, type FormEvent } from "react";
import { firm, practiceAreas, sectors } from "@/content/site";
import { ArrowUpRight, Mail } from "./icons";
import { Reveal } from "./reveal";
import { ButtonArrow, Container, SectionHeading, buttonStyles } from "./ui";

const inputClass = "enquiry-input";
const labelClass = "text-[11px] font-medium text-navy";

export function Contact() {
  const [draft, setDraft] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `Name: ${String(data.get("name")).trim()}`,
      `Email: ${String(data.get("email")).trim()}`,
      `Phone: ${String(data.get("phone") || "Not provided").trim()}`,
      `Area: ${data.get("area") || "General enquiry"}`,
      "",
      String(data.get("message")).trim(),
    ].join("\n");
    const href = `mailto:${firm.email}?subject=${encodeURIComponent(`Website enquiry — ${data.get("area") || "General enquiry"}`)}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    window.location.href = href;
  }

  return (
    <section id="contact" className="py-20 sm:py-24 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
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
          <Reveal className="mt-10">
            <a
              href={`mailto:${firm.email}`}
              className="group flex items-center justify-between gap-4 border-y border-line py-5 text-[14px]"
            >
              <span className="break-all">{firm.email}</span>
              <ArrowUpRight className="size-4 shrink-0 text-gold-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={`tel:${firm.hotlineTel}`}
              className="group flex items-center justify-between gap-4 border-b border-line py-5 text-[14px]"
            >
              {firm.phone}
              <ArrowUpRight className="size-4 text-gold-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-gold-ink">
                  Visit our chambers
                </p>
                <address className="mt-3 text-xs not-italic leading-[1.9] text-slate">
                  {firm.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={firm.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex min-h-8 items-center gap-2 text-[11px] font-medium"
                >
                  Get directions <ArrowUpRight className="size-3" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-gold-ink">
                  Office hours
                </p>
                <p className="mt-3 text-xs leading-[1.9] text-slate">
                  Monday – Friday
                  <br />
                  9:00am – 6:00pm
                </p>
                <p className="mt-3 text-[11px] text-slate">
                  Emergency hotline available 24/7
                </p>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={100} className="bg-mist p-6 sm:p-9 lg:p-10">
          <h3 className="font-serif text-[27px] tracking-[-0.03em]">
            How can we help?
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate">
            A little context helps us point you in the right direction.
          </p>
          <form
            onSubmit={onSubmit}
            onChange={() => setDraft(null)}
            className="mt-7 grid gap-x-5 gap-y-5 sm:grid-cols-2"
          >
            <label className="grid gap-2">
              <span className={labelClass}>
                Full name <span className="text-gold-ink">*</span>
              </span>
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Your full name"
                className={inputClass}
              />
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
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                placeholder="Your contact number"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2">
              <span className={labelClass}>Area of enquiry</span>
              <select name="area" defaultValue="" className={inputClass}>
                <option value="">Please select</option>
                <optgroup label="Practice areas">
                  {practiceAreas.map((area) => (
                    <option key={area.id}>{area.title}</option>
                  ))}
                </optgroup>
                <optgroup label="Sectors">
                  {sectors.map((sector) => (
                    <option key={sector.id}>{sector.title}</option>
                  ))}
                </optgroup>
                <option>Other / not sure</option>
              </select>
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className={labelClass}>
                Your message <span className="text-gold-ink">*</span>
              </span>
              <textarea
                name="message"
                rows={4}
                required
                maxLength={1500}
                placeholder="Briefly tell us about your matter…"
                className={`${inputClass} resize-y`}
              />
            </label>
            <p className="text-[10px] leading-[1.8] text-slate sm:col-span-2">
              Please do not include confidential documents. An enquiry does not
              establish a lawyer–client relationship.
            </p>
            <button
              type="submit"
              className={`${buttonStyles.primary} sm:col-span-2`}
            >
              Continue to email
              <ButtonArrow />
            </button>
            <p className="text-[10px] leading-relaxed text-slate sm:col-span-2">
              Opens a draft in your email app for you to review and send.
            </p>
            {draft && (
              <div
                role="status"
                className="border-t border-line pt-4 text-xs leading-relaxed text-slate sm:col-span-2"
              >
                <p>
                  Your enquiry is ready. Send it from your email app to complete
                  your enquiry.
                </p>
                <a
                  href={draft}
                  className="mt-3 inline-flex items-center gap-2 font-medium text-navy underline underline-offset-4"
                >
                  <Mail className="size-3.5" />
                  Open email draft again
                </a>
              </div>
            )}
          </form>
        </Reveal>
      </Container>
    </section>
  );
}
