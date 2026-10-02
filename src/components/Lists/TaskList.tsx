"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteTask, setTaskStatus } from "@/lib/actions/admin/tasks";
import { Check } from "@/components/Icons";
import { EmptyState } from "@/components/Status/EmptyState";
import { caseTitle, formatDateTime, initials } from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

export type TaskRow = Pick<
  Tables<"tasks">,
  "id" | "title" | "details" | "status" | "due_at" | "case_id" | "assigned_to"
> & {
  case: { title: string | null } | null;
};

export function TaskList({
  tasks,
  partnerNames,
  showCase = true,
  emptyText = "Nothing here.",
}: {
  tasks: TaskRow[];
  partnerNames: Record<string, string>;
  showCase?: boolean;
  emptyText?: string;
}) {
  const [pending, startTransition] = useTransition();
  if (tasks.length === 0) return <EmptyState>{emptyText}</EmptyState>;
  const now = new Date();

  return (
    <ul className="divide-y divide-line">
      {tasks.map((task) => {
        const done = task.status === "done";
        const overdue =
          !done && task.due_at !== null && new Date(task.due_at) < now;
        const assignee = partnerNames[task.assigned_to] ?? "Partner";
        return (
          <li
            key={task.id}
            className="group flex items-start gap-3 px-5 py-3.5 sm:px-6"
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={done}
              aria-label={
                done ? `Reopen “${task.title}”` : `Mark “${task.title}” done`
              }
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  setTaskStatus(task.id, task.case_id, done ? "todo" : "done"),
                )
              }
              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                done
                  ? "border-gold-ink bg-gold-ink text-white"
                  : "border-slate-light hover:border-navy"
              }`}
            >
              {done && <Check className="size-3.5" strokeWidth={3} />}
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm leading-snug ${done ? "text-slate line-through" : "font-medium"}`}
              >
                {task.title}
              </p>
              {task.details && (
                <p className="mt-0.5 text-[13px] leading-relaxed text-slate">
                  {task.details}
                </p>
              )}
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate">
                <span className="inline-flex items-center gap-1.5">
                  <span className="grid size-5 place-items-center rounded-full bg-navy text-[9px] font-semibold text-white">
                    {initials(assignee)}
                  </span>
                  {assignee}
                </span>
                {task.status === "in_progress" && (
                  <span className="font-medium text-navy">· In progress</span>
                )}
                {task.due_at && (
                  <span className={overdue ? "font-medium text-[#b4372c]" : ""}>
                    · {overdue ? "Overdue since" : "Due"}{" "}
                    {formatDateTime(task.due_at)}
                  </span>
                )}
                {showCase && task.case_id && (
                  <Link
                    href={`/admin/cases/${task.case_id}?tab=tasks`}
                    className="hover:text-navy hover:underline"
                  >
                    · {caseTitle(task.case?.title ?? null)}
                  </Link>
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
              {!done && task.status !== "in_progress" && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(() =>
                      setTaskStatus(task.id, task.case_id, "in_progress"),
                    )
                  }
                  className="rounded-md px-2 py-1 text-xs font-medium text-slate hover:bg-mist hover:text-navy"
                >
                  Start
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm("Delete this task?"))
                    startTransition(() => deleteTask(task.id, task.case_id));
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate hover:bg-[#b4372c]/5 hover:text-[#b4372c]"
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
