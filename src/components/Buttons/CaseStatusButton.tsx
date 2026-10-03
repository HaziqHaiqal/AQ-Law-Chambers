"use client";

import { useRef, useTransition } from "react";
import { buttonStyles } from "@/components/Buttons/Button";
import { CircleCheck } from "@/components/Icons";
import { BusyLabel } from "@/components/Status/BusyLabel";
import { setCaseClosed } from "@/lib/actions/admin/cases";

export function CaseStatusButton({
  caseId,
  caseTitle,
  closed,
}: {
  caseId: number;
  caseTitle: string;
  closed: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const dialog = useRef<HTMLDialogElement>(null);

  if (closed)
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => setCaseClosed(caseId, false))}
        className={buttonStyles.appSecondary}
      >
        {pending ? <BusyLabel>Reopening…</BusyLabel> : "Reopen case"}
      </button>
    );

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => dialog.current?.showModal()}
        className={buttonStyles.appPrimary}
      >
        {pending ? (
          <BusyLabel>Closing…</BusyLabel>
        ) : (
          <>
            <CircleCheck className="size-4" />
            Close case
          </>
        )}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={`close-case-${caseId}`}
        className="m-auto w-[min(440px,calc(100vw-32px))] rounded-2xl bg-white p-0 text-navy shadow-[0_24px_60px_rgb(10_25_47/25%)] backdrop:bg-navy/40"
      >
        <div className="grid gap-5 p-6">
          <span className="grid size-11 place-items-center rounded-full bg-gold/20 text-gold-ink">
            <CircleCheck className="size-5" />
          </span>
          <div className="grid gap-2">
            <h2
              id={`close-case-${caseId}`}
              className="font-serif text-xl leading-snug"
            >
              Close this case?
            </h2>
            <p className="text-sm leading-relaxed text-slate">
              <span className="font-medium text-navy">{caseTitle}</span> will be
              marked Closed with today&rsquo;s date. The client can still see it
              in their account, and you can reopen it at any time.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className={buttonStyles.appSecondary}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                dialog.current?.close();
                startTransition(() => setCaseClosed(caseId, true));
              }}
              className={buttonStyles.appPrimary}
            >
              Close case
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
