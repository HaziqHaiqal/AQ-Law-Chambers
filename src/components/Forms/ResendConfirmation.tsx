"use client";

import { useActionState } from "react";
import { resendConfirmation, type ResendState } from "@/app/(auth)/actions";
import { BusyLabel } from "@/components/Status/BusyLabel";

export function ResendConfirmation({ email }: { email: string }) {
  const [state, action, pending] = useActionState<ResendState, FormData>(
    resendConfirmation,
    {},
  );

  return (
    <form
      action={action}
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]"
    >
      <input type="hidden" name="email" value={email} />
      <span className="text-slate">Didn&rsquo;t get the email?</span>
      <button
        type="submit"
        disabled={pending}
        className="font-medium text-navy underline underline-offset-2 hover:text-gold-ink disabled:cursor-wait disabled:opacity-50"
      >
        {pending ? <BusyLabel>Sending…</BusyLabel> : "Resend link"}
      </button>
      {state.sent && (
        <span role="status" className="w-full text-gold-ink">
          Sent. Check your inbox and spam folder.
        </span>
      )}
      {state.error && (
        <span role="alert" className="w-full text-[#b4372c]">
          {state.error}
        </span>
      )}
    </form>
  );
}
