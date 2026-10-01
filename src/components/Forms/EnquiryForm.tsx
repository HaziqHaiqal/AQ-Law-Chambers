"use client";

import { useState, type FormEvent } from "react";
import { firm, practiceAreas, sectors } from "@/data/site";
import { Button } from "@/components/Buttons/Button";
import { ButtonArrow } from "@/components/Buttons/ButtonArrow";
import { Mail } from "@/components/Icons";

const inputClass = "enquiry-input";
const labelClass = "text-sm font-medium text-navy";

const topics = [
  ...[...practiceAreas, ...sectors].map((item) => ({
    value: item.title,
    label: item.short,
  })),
  { value: "General enquiry", label: "Something else" },
];

export function EnquiryForm() {
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

  return (
    <form
      onSubmit={onSubmit}
      onChange={() => setDraft(null)}
      className="grid gap-7"
    >
      <fieldset>
        <legend className={labelClass}>What can we help with?</legend>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <label key={topic.value} className="cursor-pointer">
              <input
                type="radio"
                name="area"
                value={topic.value}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-10 items-center rounded-[2px] border border-line px-3.5 text-sm text-slate transition-colors peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-ink hover:border-navy/40 hover:text-navy">
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
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
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
            className={inputClass}
          />
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
          Opens a draft in your email app to review and send. Please don’t
          include confidential documents; an enquiry does not create a
          lawyer–client relationship.
        </p>
        <Button type="submit" className="shrink-0">
          Continue to email
          <ButtonArrow />
        </Button>
      </div>

      {draft && (
        <div
          role="status"
          className="bg-mist px-5 py-4 text-sm leading-relaxed text-slate"
        >
          <p>
            Your enquiry is ready — send it from your email app to complete it.
          </p>
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
  );
}
