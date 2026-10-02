import type { ReactNode } from "react";
import { EmptyState } from "@/components/Status/EmptyState";
import { formatDateTime, updateCategoryLabels } from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

export type LogUpdate = Pick<
  Tables<"case_updates">,
  "id" | "title" | "body" | "category" | "occurred_at"
> & {
  author: { full_name: string } | null;
};

export function ActionLog({
  updates,
  renderControls,
}: {
  updates: LogUpdate[];
  renderControls?: (update: LogUpdate) => ReactNode;
}) {
  if (updates.length === 0)
    return (
      <EmptyState title="No updates yet">
        Every step taken on your case will appear here, time-stamped.
      </EmptyState>
    );

  return (
    <ol className="relative">
      {updates.map((update, index) => (
        <li key={update.id} className="relative pb-6 pl-7 last:pb-0">
          {index < updates.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute top-4 bottom-0 left-[5px] w-px bg-line"
            />
          )}
          <span
            aria-hidden="true"
            className={`absolute top-1.5 left-0 size-[11px] rounded-full border-2 ${index === 0 ? "border-gold bg-gold" : "border-slate-light bg-white"}`}
          />
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate">
            <time
              dateTime={update.occurred_at}
              className="font-medium text-navy"
            >
              {formatDateTime(update.occurred_at)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{updateCategoryLabels[update.category]}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed">
            <span className="font-semibold">{update.title}.</span>{" "}
            <span className="whitespace-pre-line text-navy/85">
              {update.body}
            </span>
          </p>
          {update.author && (
            <p className="mt-1 text-xs text-slate">{update.author.full_name}</p>
          )}
          {renderControls?.(update)}
        </li>
      ))}
    </ol>
  );
}
