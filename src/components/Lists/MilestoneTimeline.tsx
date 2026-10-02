import { Check } from "@/components/Icons";
import {
  formatDateTime,
  milestoneLabels,
  milestoneOrder,
  milestoneState,
  type MilestoneState,
} from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

type Milestone = Pick<
  Tables<"case_milestones">,
  "stage" | "scheduled_for" | "completed_at" | "note"
>;

const stateLabel: Record<MilestoneState, string> = {
  done: "Completed",
  in_progress: "In progress",
  upcoming: "Upcoming",
};

export function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const byStage = new Map(milestones.map((m) => [m.stage, m]));
  const states = milestoneOrder.map((stage) => {
    const milestone = byStage.get(stage);
    return milestone ? milestoneState(milestone) : "upcoming";
  });

  return (
    <ol className="grid gap-0 md:grid-cols-4">
      {milestoneOrder.map((stage, index) => {
        const milestone = byStage.get(stage);
        const state = states[index];
        const nextDone =
          states[index + 1] === "done" || states[index + 1] === "in_progress";
        return (
          <li
            key={stage}
            aria-current={state === "in_progress" ? "step" : undefined}
            className="relative flex gap-4 pb-8 last:pb-0 md:block md:pr-6 md:pb-0"
          >
            {index < 3 && (
              <span
                aria-hidden="true"
                className={`absolute top-10 bottom-0 left-[19px] w-0.5 md:top-[19px] md:right-0 md:bottom-auto md:left-10 md:h-0.5 md:w-auto ${
                  state === "done" && nextDone ? "bg-gold" : "bg-line"
                }`}
              />
            )}
            <span
              className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                state === "done"
                  ? "bg-gold text-navy"
                  : state === "in_progress"
                    ? "bg-navy text-white ring-4 ring-navy/10"
                    : "border-2 border-line bg-white text-slate"
              }`}
            >
              {state === "done" ? (
                <Check className="size-5" strokeWidth={2.25} />
              ) : (
                index + 1
              )}
            </span>
            <div className="min-w-0 md:mt-4">
              <p
                className={`text-xs font-medium ${state === "done" ? "text-gold-ink" : state === "in_progress" ? "text-navy" : "text-slate"}`}
              >
                {stateLabel[state]}
              </p>
              <p className="mt-0.5 text-[15px] leading-snug font-semibold">
                {milestoneLabels[stage]}
              </p>
              <p className="mt-1 text-[13px] text-slate">
                {milestone?.completed_at
                  ? formatDateTime(milestone.completed_at)
                  : milestone?.scheduled_for
                    ? `Scheduled ${formatDateTime(milestone.scheduled_for)}`
                    : "Date to be confirmed"}
              </p>
              {milestone?.note && (
                <p className="mt-2 text-[13px] leading-relaxed text-navy">
                  {milestone.note}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
