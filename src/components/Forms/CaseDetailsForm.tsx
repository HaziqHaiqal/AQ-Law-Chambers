"use client";

import { useActionState } from "react";
import { updateCase } from "@/lib/actions/admin/cases";
import type { FormState } from "@/lib/actions/admin/shared";
import {
  CaseFields,
  type CaseFieldValues,
} from "@/components/Forms/CaseFields";
import { FormAlert } from "@/components/Forms/FormAlert";
import { SubmitButton } from "@/components/Forms/SubmitButton";

export function CaseDetailsForm({
  caseId,
  values,
  partners,
}: {
  caseId: number;
  values: CaseFieldValues;
  partners: { id: string; full_name: string }[];
}) {
  const [state, action] = useActionState<FormState, FormData>(updateCase, {});
  return (
    <form action={action} noValidate className="grid gap-5">
      <input type="hidden" name="case_id" value={caseId} />
      <FormAlert>{state.error}</FormAlert>
      <FormAlert tone="success">{state.success}</FormAlert>
      <CaseFields
        values={values}
        partners={partners}
        errors={state.fieldErrors}
        allowClosed
      />
      <div>
        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}
