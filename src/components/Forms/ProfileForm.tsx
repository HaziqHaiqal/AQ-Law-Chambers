"use client";

import { useActionState } from "react";
import { updateProfile, type AccountFormState } from "@/lib/actions/account";
import { FormAlert } from "@/components/Forms/FormAlert";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import { TextField } from "@/components/Forms/TextField";
import type { Tables } from "@/lib/supabase/database.types";

export function ProfileForm({ profile }: { profile: Tables<"profiles"> }) {
  const [state, action] = useActionState<AccountFormState, FormData>(
    updateProfile,
    {},
  );
  return (
    <form action={action} noValidate className="grid gap-5">
      <FormAlert>{state.error}</FormAlert>
      <FormAlert tone="success">{state.success}</FormAlert>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          name="full_name"
          autoComplete="name"
          required
          maxLength={100}
          defaultValue={profile.full_name}
          error={state.fieldErrors?.full_name}
        />
        <TextField
          label="Email address"
          name="email"
          type="email"
          value={profile.email}
          readOnly
          disabled
          hint="Contact the firm to change your login email."
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          optional
          maxLength={40}
          placeholder="+60 12-345 6789"
          defaultValue={profile.phone ?? ""}
          error={state.fieldErrors?.phone}
        />
        <TextField
          label="Organisation"
          name="organisation"
          autoComplete="organization"
          optional
          maxLength={150}
          defaultValue={profile.organisation ?? ""}
          error={state.fieldErrors?.organisation}
        />
      </div>
      <div>
        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}
