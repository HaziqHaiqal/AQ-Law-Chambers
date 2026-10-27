"use client";

import { useActionState, useOptimistic, useTransition } from "react";
import {
  setMilestoneStepCompleted,
  updateMilestoneDetails,
} from "@/lib/actions/admin/milestones";
import type { FormState } from "@/lib/actions/admin/shared";
import { Button } from "@/components/Buttons/Button";
import { FieldLabel } from "@/components/Forms/FieldLabel";
import { Check } from "@/components/Icons";
import { BusyLabel } from "@/components/Status/BusyLabel";
import {
  formatDateTime,
  milestoneGoals,
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

type Step = Pick<
  Tables<"case_milestone_steps">,
  "id" | "stage" | "title" | "detail" | "completed_at"
>;

function MilestoneRow({
  caseId,
  milestone,
  steps,
  index,
  courtReference,
}: {
  caseId: number;
  milestone: Milestone;
  steps: Step[];
  index: number;
  courtReference: string | null;
}) {
  // Ticks shown straight away; the stage itself completes in the database.
  const [pending, setPending] = useOptimistic<
    Record<number, boolean>,
    [number, boolean]
  >({}, (current, [id, completed]) => ({ ...current, [id]: completed }));
  const [, startTransition] = useTransition();
  const [state, action, saving] = useActionState<FormState, FormData>(
    updateMilestoneDetails,
    {},
  );
  const live = milestoneState(milestone);
  const isTicked = (step: Step) =>
    pending[step.id] ?? Boolean(step.completed_at);
  const ticked = steps.filter(isTicked).length;
  const done = steps.length
    ? ticked === steps.length
    : Boolean(milestone.completed_at);

  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-4">
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-lg border-2 transition-colors ${
            done
              ? "border-gold bg-gold text-navy"
              : "border-slate-light bg-white"
          }`}
        >
          {done ? (
            <Check className="size-4" strokeWidth={2.75} />
          ) : (
            <span className="text-xs font-semibold text-slate">
              {index + 1}
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {milestoneLabels[milestone.stage]}
            {milestone.stage === "cause_papers" && courtReference && (
              <span className="font-normal text-slate">
                {" "}
                (Civil Suit No.: {courtReference})
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-slate">
            {done
              ? milestone.completed_at
                ? `Completed ${formatDateTime(milestone.completed_at)}${milestone.completer ? ` by ${milestone.completer.full_name}` : ""}`
                : "Completed"
              : live === "in_progress"
                ? "In progress: scheduled date has passed"
                : milestone.scheduled_for
                  ? `Scheduled ${formatDateTime(milestone.scheduled_for)}`
                  : ticked
                    ? "In progress"
                    : "Not started"}
            {!done &&
              steps.length > 0 &&
              ` · ${ticked} of ${steps.length} steps done`}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-slate">
            <span className="font-medium text-navy">Goal:</span>{" "}
            {milestoneGoals[milestone.stage]}
          </p>

          {steps.length > 0 && (
            <ul className="mt-3 grid gap-3">
              {steps.map((step) => {
                const checked = isTicked(step);
                return (
                  <li key={step.id} className="flex items-start gap-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      aria-label={step.title}
                      onClick={() =>
                        startTransition(async () => {
                          setPending([step.id, !checked]);
                          await setMilestoneStepCompleted(
                            caseId,
                            step.id,
                            !checked,
                          );
                        })
                      }
                      className={`mt-px grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors focus-visible:ring-4 focus-visible:ring-navy/15 ${
                        checked
                          ? "border-gold bg-gold text-navy"
                          : "border-slate-light bg-white hover:border-navy"
                      }`}
                    >
                      {checked && (
                        <Check className="size-3.5" strokeWidth={3} />
                      )}
                    </button>
                    <div className="min-w-0 text-[13px] leading-relaxed">
                      <p className="font-medium">{step.title}</p>
                      {step.detail && (
                        <p className="whitespace-pre-line text-slate">
                          {step.detail}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <details className="group mt-3">
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
  steps,
  courtReference,
}: {
  caseId: number;
  milestones: Milestone[];
  steps: Step[];
  courtReference: string | null;
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
            steps={steps.filter((step) => step.stage === stage)}
            index={index}
            courtReference={courtReference}
          />
        ) : null;
      })}
    </ol>
  );
}
