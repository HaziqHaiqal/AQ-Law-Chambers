"use client";

import { useActionState } from "react";
import { createTask } from "@/lib/actions/admin/tasks";
import type { FormState } from "@/lib/actions/admin/shared";
import { FormAlert } from "@/components/Forms/FormAlert";
import { SelectField } from "@/components/Forms/SelectField";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import { TextAreaField } from "@/components/Forms/TextAreaField";
import { TextField } from "@/components/Forms/TextField";

type Option = { value: string; label: string };

export function TaskForm({
  partners,
  cases,
  fixedCaseId,
  defaultAssignee,
}: {
  partners: Option[];
  cases?: Option[];
  fixedCaseId?: number;
  defaultAssignee: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(createTask, {});
  return (
    <form key={state.savedAt} action={action} noValidate className="grid gap-4">
      <FormAlert>{state.error}</FormAlert>
      <FormAlert tone="success">{state.success}</FormAlert>
      <TextField
        label="Task"
        name="title"
        maxLength={200}
        placeholder="e.g. Draft the Tactical Legal Strategy Memorandum"
        error={state.fieldErrors?.title}
      />
      <SelectField
        label="Assign to"
        name="assigned_to"
        defaultValue={defaultAssignee}
        options={partners}
      />
      {fixedCaseId ? (
        <input type="hidden" name="case_id" value={fixedCaseId} />
      ) : (
        <SelectField
          label="Case"
          name="case_id"
          defaultValue=""
          options={[
            { value: "", label: "General firm task" },
            ...(cases ?? []),
          ]}
        />
      )}
      <TextField
        label="Internal deadline"
        name="due_at"
        type="datetime-local"
        optional
        error={state.fieldErrors?.due_at}
      />
      <TextAreaField
        label="Details"
        name="details"
        optional
        rows={2}
        maxLength={2000}
        error={state.fieldErrors?.details}
      />
      <div>
        <SubmitButton pendingLabel="Assigning…">Assign task</SubmitButton>
      </div>
    </form>
  );
}
