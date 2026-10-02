"use client";

import { useState, useTransition } from "react";
import { deleteCaseUpdate } from "@/lib/actions/admin/updates";
import { CaseUpdateForm } from "@/components/Forms/CaseUpdateForm";
import { ActionLog, type LogUpdate } from "@/components/Lists/ActionLog";

export function CaseUpdateFeed({
  caseId,
  updates,
}: {
  caseId: number;
  updates: LogUpdate[];
}) {
  const [editing, setEditing] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <ActionLog
      updates={updates}
      renderControls={(update) =>
        editing === update.id ? (
          <div className="mt-3 rounded-lg bg-mist p-4">
            <CaseUpdateForm
              caseId={caseId}
              update={update}
              onDone={() => setEditing(null)}
            />
          </div>
        ) : (
          <div className="mt-1.5 flex gap-3 text-xs">
            <button
              type="button"
              onClick={() => setEditing(update.id)}
              className="font-medium text-slate hover:text-navy"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (confirm("Remove this update from the client's feed?"))
                  startTransition(() => deleteCaseUpdate(update.id, caseId));
              }}
              className="font-medium text-slate hover:text-[#b4372c]"
            >
              Delete
            </button>
          </div>
        )
      }
    />
  );
}
