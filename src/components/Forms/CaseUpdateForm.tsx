"use client";

import { useActionState } from "react";
import { editCaseUpdate, postCaseUpdate } from "@/lib/actions/admin/updates";
import type { FormState } from "@/lib/actions/admin/shared";
import { Button } from "@/components/Buttons/Button";
import { FormAlert } from "@/components/Forms/FormAlert";
import { SelectField } from "@/components/Forms/SelectField";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import { TextAreaField } from "@/components/Forms/TextAreaField";
import { TextField } from "@/components/Forms/TextField";
import type { LogUpdate } from "@/components/Lists/ActionLog";
import { toDateTimeInput, updateCategoryLabels } from "@/lib/format";
import { Constants } from "@/lib/supabase/database.types";

export function CaseUpdateForm({
  caseId,
  update,
  onDone,
}: {
  caseId: number;
  update?: LogUpdate;
  onDone?: () => void;
}) {
  const [state, action] = useActionState<FormState, FormData>(
    async (prev, data) => {
      const result = await (update ? editCaseUpdate : postCaseUpdate)(
        prev,
        data,
      );
      if (result.success) onDone?.();
      return result;
    },
    {},
  );

  return (
    <form
      key={update ? undefined : state.savedAt}
      action={action}
      noValidate
      className="grid gap-4"
    >
      <input type="hidden" name="case_id" value={caseId} />
      {update && <input type="hidden" name="update_id" value={update.id} />}
      <FormAlert>{state.error}</FormAlert>
      {!update && <FormAlert tone="success">{state.success}</FormAlert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Category"
          name="category"
          defaultValue={update?.category ?? "execution"}
          options={Constants.public.Enums.update_category.map((value) => ({
            value,
            label: updateCategoryLabels[value],
          }))}
        />
        <TextField
          label="Time stamp"
          name="occurred_at"
          type="datetime-local"
          defaultValue={update ? toDateTimeInput(update.occurred_at) : ""}
          hint={update ? undefined : "Leave blank to use the current time"}
          error={state.fieldErrors?.occurred_at}
        />
      </div>
      <TextField
        label="Headline"
        name="title"
        maxLength={120}
        defaultValue={update?.title}
        placeholder="e.g. Execution Update"
        error={state.fieldErrors?.title}
      />
      <TextAreaField
        label="Update message"
        name="body"
        maxLength={4000}
        defaultValue={update?.body}
        placeholder="e.g. Reports from the supervising solicitor confirm the Anton Piller search is underway at the 1st Defendant's premises."
        error={state.fieldErrors?.body}
      />
      <div className="flex gap-2">
        <SubmitButton pendingLabel={update ? "Saving…" : "Sending…"}>
          {update ? "Save changes" : "Broadcast update"}
        </SubmitButton>
        {onDone && (
          <Button variant="appGhost" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
