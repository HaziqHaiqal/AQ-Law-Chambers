"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthFormState } from "@/app/(auth)/actions";
import { FieldError } from "@/components/Forms/FieldError";
import { FormAlert } from "@/components/Forms/FormAlert";
import { PasswordField } from "@/components/Forms/PasswordField";
import { ResendConfirmation } from "@/components/Forms/ResendConfirmation";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import { TextField } from "@/components/Forms/TextField";
import { Mail, Phone, User } from "@/components/Icons";

export function SignupForm() {
  const [state, action] = useActionState<AuthFormState, FormData>(signUp, {});

  if (state.notice)
    return (
      <div className="grid gap-3">
        <FormAlert tone="success">{state.notice}</FormAlert>
        {state.unconfirmedEmail && (
          <ResendConfirmation email={state.unconfirmedEmail} />
        )}
      </div>
    );

  return (
    <form action={action} noValidate className="grid gap-4">
      <FormAlert>{state.error}</FormAlert>
      <TextField
        label="Full name"
        name="full_name"
        icon={User}
        autoComplete="name"
        required
        maxLength={100}
        placeholder="As it appears on your IC or passport"
        defaultValue={state.values?.full_name}
        error={state.fieldErrors?.full_name}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
          defaultValue={state.values?.email}
          error={state.fieldErrors?.email}
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          icon={Phone}
          autoComplete="tel"
          optional
          maxLength={40}
          placeholder="+60 12-345 6789"
          defaultValue={state.values?.phone}
          error={state.fieldErrors?.phone}
        />
      </div>
      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        showRules
        error={state.fieldErrors?.password}
      />
      <PasswordField
        label="Confirm password"
        name="confirm_password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirm_password}
      />
      <div className="grid gap-1.5 pt-1">
        <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-slate">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={state.fieldErrors?.consent ? true : undefined}
            aria-describedby={
              state.fieldErrors?.consent ? "consent-error" : undefined
            }
            className="mt-0.5 size-4 shrink-0 rounded accent-navy"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="font-medium text-navy underline underline-offset-2"
            >
              Privacy Notice
            </Link>{" "}
            and consent to my personal data being processed under the Personal
            Data Protection Act 2010.
          </span>
        </label>
        <FieldError id="consent-error">{state.fieldErrors?.consent}</FieldError>
      </div>
      <SubmitButton
        pendingLabel="Creating account…"
        className="mt-1 min-h-11 w-full text-sm"
      >
        Create account
      </SubmitButton>
      <p className="border-t border-line pt-5 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-navy hover:text-gold-ink"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
