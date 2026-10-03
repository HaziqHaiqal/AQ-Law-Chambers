"use client";

import { useActionState } from "react";
import { createCase } from "@/lib/actions/admin/cases";
import type { FormState } from "@/lib/actions/admin/shared";
import { CaseFields } from "@/components/Forms/CaseFields";
import { FormAlert } from "@/components/Forms/FormAlert";
import { SelectField } from "@/components/Forms/SelectField";
import { SubmitButton } from "@/components/Forms/SubmitButton";

export function NewCaseForm({
  partners,
  clients,
  defaultClientId,
  defaultPartnerId,
  fromEnquiry,
}: {
  partners: { id: string; full_name: string }[];
  clients: {
    id: string;
    full_name: string;
    email: string;
    organisation: string | null;
  }[];
  defaultClientId: string;
  defaultPartnerId: string;
  fromEnquiry?: {
    id: number;
    full_name: string;
    email: string;
    client_id: string | null;
  } | null;
}) {
  const [state, action] = useActionState<FormState, FormData>(createCase, {});

  return (
    <form action={action} noValidate className="grid gap-5">
      <FormAlert>{state.error}</FormAlert>
      {fromEnquiry && (
        <input type="hidden" name="enquiry_id" value={fromEnquiry.id} />
      )}
      {fromEnquiry && !fromEnquiry.client_id ? (
        <div className="grid gap-1 rounded-lg bg-mist px-4 py-3 text-[13px] leading-relaxed">
          <p className="font-medium text-navy">
            Client: {fromEnquiry.full_name} · {fromEnquiry.email}
          </p>
          <p className="text-slate">
            No account yet. You can create the case now; if they sign up later
            with this email, it will link automatically.
          </p>
        </div>
      ) : (
        <SelectField
          label="Client"
          name="client_id"
          defaultValue={defaultClientId}
          hint="Clients appear here once they've created an account."
          options={[
            { value: "", label: "Link a client later" },
            ...clients.map((client) => ({
              value: client.id,
              label: `${client.organisation ?? client.full_name} · ${client.email}`,
            })),
          ]}
        />
      )}
      <CaseFields
        values={{
          title: null,
          court_reference: null,
          court: null,
          summary: null,
          status: "intake",
          lead_partner_id: defaultPartnerId,
          relief_types: [],
        }}
        partners={partners}
        errors={state.fieldErrors}
        allowClosed={false}
      />
      <div className="flex justify-end border-t border-line pt-5">
        <SubmitButton pendingLabel="Creating…">Create case</SubmitButton>
      </div>
    </form>
  );
}
