"use client";

import { useActionState, useOptimistic, useTransition } from "react";
import {
  setMilestoneCompleted,
  updateMilestoneDetails,
} from "@/lib/actions/admin/milestones";
import type { FormState } from "@/lib/actions/admin/shared";
import { Button } from "@/components/Buttons/Button";
import { FieldLabel } from "@/components/Forms/FieldLabel";
import { Check } from "@/components/Icons";
import { BusyLabel } from "@/components/Status/BusyLabel";
import {
  formatDateTime,
  milestoneLabels,
  milestoneOrder,
  milestoneState,
  toDateTimeInput,
} from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

type Milestone = Pick<
  Tables<"case_milestones">,
  "stage" | "scheduled_for" | "completed_at" | "note"
> & {
  completer: { full_name: string } | null;
};

function MilestoneRow({
  caseId,
  milestone,
  index,
}: {
  caseId: number;
  milestone: Milestone;
  index: number;
}) {
  const [done, setDone] = useOptimistic(Boolean(milestone.completed_at));
  const [, startTransition] = useTransition();
  const [state, action, saving] = useActionState<FormState, FormData>(
    updateMilestoneDetails,
    {},
  );
  const live = milestoneState(milestone);

  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={`${milestoneLabels[milestone.stage]} completed`}
          onClick={() =>
            startTransition(async () => {
              setDone(!done);
              await setMilestoneCompleted(caseId, milestone.stage, !done);
            })
          }
          className={`grid size-7 shrink-0 place-items-center rounded-lg border-2 transition-colors focus-visible:ring-4 focus-visible:ring-navy/15 ${
            done
              ? "border-gold bg-gold text-navy"
              : "border-slate-light bg-white hover:border-navy"
          }`}
        >
          {done ? (
            <Check className="size-4" strokeWidth={2.75} />
          ) : (
            <span className="text-xs font-semibold text-slate">
              {index + 1}
            </span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {milestoneLabels[milestone.stage]}
          </p>
          <p className="mt-0.5 text-xs text-slate">
            {milestone.completed_at
              ? `Completed ${formatDateTime(milestone.completed_at)}${milestone.completer ? ` by ${milestone.completer.full_name}` : ""}`
              : live === "in_progress"
                ? "In progress: scheduled date has passed"
                : milestone.scheduled_for
                  ? `Scheduled ${formatDateTime(milestone.scheduled_for)}`
                  : "Not started"}
          </p>
          <details className="group mt-2">
            <summary className="w-fit text-xs font-medium text-gold-ink hover:text-navy">
              Date &amp; note for the client
            </summary>
            <form
              action={action}
              className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr_auto] sm:items-end"
            >
              <input type="hidden" name="case_id" value={caseId} />
              <input type="hidden" name="stage" value={milestone.stage} />
              <label className="grid gap-1.5">
                <FieldLabel>Scheduled for</FieldLabel>
                <input
                  type="datetime-local"
                  name="scheduled_for"
                  defaultValue={toDateTimeInput(milestone.scheduled_for)}
                  className="field-input"
                />
              </label>
              <label className="grid gap-1.5">
                <FieldLabel>Note on the timeline</FieldLabel>
                <input
                  name="note"
                  maxLength={500}
                  defaultValue={milestone.note ?? ""}
                  placeholder="e.g. Before the duty judge, Court 3A"
                  className="field-input"
                />
              </label>
              <Button type="submit" variant="appSecondary" disabled={saving}>
                {saving ? <BusyLabel>Saving…</BusyLabel> : "Save"}
              </Button>
              {(state.error || state.success) && (
                <p
                  role="status"
                  className={`text-xs sm:col-span-3 ${state.error ? "text-[#b4372c]" : "text-gold-ink"}`}
                >
                  {state.error ?? "Saved"}
                </p>
              )}
            </form>
          </details>
        </div>
      </div>
    </li>
  );
}

export function MilestoneChecklist({
  caseId,
  milestones,
}: {
  caseId: number;
  milestones: Milestone[];
}) {
  const byStage = new Map(milestones.map((m) => [m.stage, m]));
  return (
    <ol className="divide-y divide-line">
      {milestoneOrder.map((stage, index) => {
        const milestone = byStage.get(stage);
        return milestone ? (
          <MilestoneRow
            key={stage}
            caseId={caseId}
            milestone={milestone}
            index={index}
          />
        ) : null;
      })}
    </ol>
  );
}
