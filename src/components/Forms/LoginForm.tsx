"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthFormState } from "@/app/(auth)/actions";
import { FormAlert } from "@/components/Forms/FormAlert";
import { PasswordField } from "@/components/Forms/PasswordField";
import { ResendConfirmation } from "@/components/Forms/ResendConfirmation";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import { TextField } from "@/components/Forms/TextField";
import { Mail } from "@/components/Icons";
import { firm } from "@/data/site";

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, action] = useActionState<AuthFormState, FormData>(signIn, {});

  const message = state.error ?? notice;

  return (
    <div className="grid gap-5">
      {message && (
        <div className="grid gap-2.5">
          <FormAlert>{message}</FormAlert>
          {state.unconfirmedEmail && (
            <ResendConfirmation email={state.unconfirmedEmail} />
          )}
        </div>
      )}
      <form action={action} noValidate className="grid gap-5">
        <input type="hidden" name="next" value={next} />
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
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          error={state.fieldErrors?.password}
        />
        <SubmitButton
          pendingLabel="Signing in…"
          className="mt-1 min-h-11 w-full text-sm"
        >
          Sign in
        </SubmitButton>
        <p className="text-center text-[13px] leading-relaxed text-slate">
          Forgot your password? Call the firm on{" "}
          <a
            href={`tel:${firm.phoneTel}`}
            className="font-medium whitespace-nowrap text-navy hover:text-gold-ink"
          >
            {firm.phone}
          </a>
        </p>
        <p className="border-t border-line pt-5 text-center text-sm text-slate">
          New client?{" "}
          <Link
            href="/signup"
            className="font-medium text-navy hover:text-gold-ink"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
