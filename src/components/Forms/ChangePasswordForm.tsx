"use client";

import { useActionState } from "react";
import { changePassword, type AccountFormState } from "@/lib/actions/account";
import { FormAlert } from "@/components/Forms/FormAlert";
import { PasswordField } from "@/components/Forms/PasswordField";
import { SubmitButton } from "@/components/Forms/SubmitButton";

export function ChangePasswordForm() {
  const [state, action] = useActionState<AccountFormState, FormData>(
    changePassword,
    {},
  );
  return (
    <form
      key={state.savedAt}
      action={action}
      noValidate
      className="grid max-w-md gap-5"
    >
      <FormAlert>{state.error}</FormAlert>
      <FormAlert tone="success">{state.success}</FormAlert>
      <PasswordField
        label="Current password"
        name="current_password"
        autoComplete="current-password"
        error={state.fieldErrors?.current_password}
      />
      <PasswordField
        label="New password"
        name="new_password"
        autoComplete="new-password"
        showRules
        error={state.fieldErrors?.new_password}
      />
      <PasswordField
        label="Confirm new password"
        name="confirm_password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirm_password}
      />
      <div>
        <SubmitButton pendingLabel="Updating…">Update password</SubmitButton>
      </div>
    </form>
  );
}
