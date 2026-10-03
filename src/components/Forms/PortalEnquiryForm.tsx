"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormAlert } from "@/components/Forms/FormAlert";
import { SelectField } from "@/components/Forms/SelectField";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import { TextAreaField } from "@/components/Forms/TextAreaField";
import { Phone } from "@/components/Icons";
import { firm } from "@/data/site";
import { enquiryTopics } from "@/data/site";
import {
  submitPortalEnquiry,
  type EnquiryFormState,
} from "@/lib/actions/enquiries";

export function PortalEnquiryForm({
  email,
  phone,
}: {
  email: string;
  phone: string | null;
}) {
  const [state, action] = useActionState<EnquiryFormState, FormData>(
    submitPortalEnquiry,
    {},
  );
  const values = state.values ?? {};

  return (
    <form action={action} noValidate className="grid gap-4">
      {state.sent && (
        <FormAlert tone="success">
          Your enquiry has been sent. The firm will reply using the contact
          details below.
        </FormAlert>
      )}
      <FormAlert>{state.error}</FormAlert>
      <div className="flex items-center gap-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3">
        <Phone className="size-4 shrink-0 text-gold-ink" />
        <p className="text-[13px] leading-relaxed text-navy">
          Immediate risk to assets? Call the 24/7 Hotline{" "}
          <a
            href={`tel:${firm.hotlineTel}`}
            className="font-semibold underline decoration-navy/30 underline-offset-2 hover:decoration-navy"
          >
            {firm.hotline}
          </a>
          .
        </p>
      </div>
      <SelectField
        label="What can we help with?"
        name="area"
        defaultValue={values.area ?? ""}
        options={[{ value: "", label: "Choose an area" }, ...enquiryTopics]}
      />
      <TextAreaField
        label="Your message"
        name="message"
        rows={5}
        required
        maxLength={1500}
        placeholder="Briefly tell us what happened and what you need."
        defaultValue={values.message}
        error={state.fieldErrors?.message}
      />
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-navy">
        <input
          type="checkbox"
          name="urgent"
          defaultChecked={values.urgent === "on"}
          className="mt-1 size-4 shrink-0 accent-navy"
        />
        This is urgent: funds or evidence could be moved soon
      </label>
      <p className="text-xs leading-relaxed text-slate">
        We&rsquo;ll reply to {email}
        {phone ? ` or ${phone}` : ""}.{" "}
        <Link href="/account" className="font-medium text-gold-ink">
          Update details
        </Link>
      </p>
      <SubmitButton pendingLabel="Sending…" className="justify-self-start">
        Send enquiry
      </SubmitButton>
    </form>
  );
}
