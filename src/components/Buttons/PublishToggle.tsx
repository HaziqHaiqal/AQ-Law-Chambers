"use client";

import { useOptimistic, useTransition } from "react";
import { setDocumentPublished } from "@/lib/actions/admin/documents";

export function PublishToggle({
  documentId,
  caseId,
  title,
  published,
  disabled = false,
}: {
  documentId: number;
  caseId: number;
  title: string;
  published: boolean;
  disabled?: boolean;
}) {
  const [on, setOn] = useOptimistic(published);
  const [, startTransition] = useTransition();

  return (
    <label
      className={`flex items-center gap-2.5 text-[13px] ${disabled ? "cursor-not-allowed text-slate/70" : "cursor-pointer text-navy"}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`Publish ${title} to Client Repository`}
        disabled={disabled}
        onClick={() =>
          startTransition(async () => {
            setOn(!on);
            await setDocumentPublished(documentId, caseId, !on);
          })
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:ring-4 focus-visible:ring-navy/15 disabled:opacity-40 ${
          on ? "bg-gold-ink" : "bg-slate-light/70"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}`}
        />
      </button>
      <span aria-hidden="true" className="whitespace-nowrap">
        {disabled ? "Internal only" : "Publish to Client Repository"}
      </span>
    </label>
  );
}
