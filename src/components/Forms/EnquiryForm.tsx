"use client";

import { useActionState } from "react";
import { practiceAreas, sectors, firm } from "@/data/site";
import { ButtonArrow } from "@/components/Buttons/ButtonArrow";
import { FieldError } from "@/components/Forms/FieldError";
import { FormAlert } from "@/components/Forms/FormAlert";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import { ChevronDown, Phone } from "@/components/Icons";
import { submitEnquiry, type EnquiryFormState } from "@/lib/actions/enquiries";

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
  const [state, action] = useActionState<EnquiryFormState, FormData>(
    submitEnquiry,
    {},
  );
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  if (state.sent)
    return (
      <div role="status" className="grid gap-4 bg-mist px-6 py-7">
        <p className="font-serif text-2xl">
          Thank you. Your enquiry has been sent.
        </p>
        <p className="text-sm leading-relaxed text-slate">
          It has gone straight to the partners, who will be in touch by email or
          phone. If assets are at risk of being moved right now, don&rsquo;t
          wait for a reply. Call the 24/7 hotline.
        </p>
        <a
          href={`tel:${firm.hotlineTel}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-navy"
        >
          <Phone className="size-4 text-gold-ink" />
          {firm.hotline}
        </a>
      </div>
    );

  return (
    <form action={action} noValidate className="grid gap-6">
      <FormAlert>{state.error}</FormAlert>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid content-start gap-2">
          <span className={labelClass}>Full name</span>
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "enquiry-name-error" : undefined}
            className={inputClass}
          />
          <FieldError id="enquiry-name-error">{errors.name}</FieldError>
        </label>
        <label className="grid content-start gap-2">
          <span className={labelClass}>Email address</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "enquiry-email-error" : undefined}
            className={inputClass}
          />
          <FieldError id="enquiry-email-error">{errors.email}</FieldError>
        </label>
        <label className="grid content-start gap-2">
          <span className={labelClass}>
            Phone <span className="font-normal text-slate">(optional)</span>
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            defaultValue={values.phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "enquiry-phone-error" : undefined}
            className={inputClass}
          />
          <FieldError id="enquiry-phone-error">{errors.phone}</FieldError>
        </label>
        <label className="grid content-start gap-2">
          <span className={labelClass}>What can we help with?</span>
          <span className="relative">
            <select
              name="area"
              defaultValue={values.area ?? ""}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">Choose an area</option>
              {topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate" />
          </span>
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className={labelClass}>Your message</span>
          <textarea
            name="message"
            rows={4}
            required
            maxLength={1500}
            placeholder="Briefly tell us about your matter…"
            defaultValue={values.message}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? "enquiry-message-error" : undefined
            }
            className={`${inputClass} resize-y`}
          />
          <FieldError id="enquiry-message-error">{errors.message}</FieldError>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-navy sm:col-span-2">
          <input
            type="checkbox"
            name="urgent"
            defaultChecked={values.urgent === "on"}
            className="mt-1 size-4 shrink-0 accent-navy"
          />
          This is urgent: funds or evidence could be moved soon
        </label>
        {/* Honeypot for spam bots; hidden from people. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label>
            Company website
            <input name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <SubmitButton
          variant="primary"
          pendingLabel="Sending…"
          className="shrink-0 disabled:cursor-wait disabled:opacity-60"
        >
          Send enquiry
          <ButtonArrow />
        </SubmitButton>
        <p className="text-[13px] leading-[1.7] text-slate">
          Please don&rsquo;t include confidential documents.
        </p>
      </div>
    </form>
  );
}
