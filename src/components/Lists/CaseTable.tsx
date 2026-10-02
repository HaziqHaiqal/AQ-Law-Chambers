import Link from "next/link";
import { EmptyState } from "@/components/Status/EmptyState";
import { StatusBadge, caseStatusTone } from "@/components/Status/StatusBadge";
import {
  caseStatusLabel,
  caseTitle,
  formatDateTime,
  initials,
  reliefTypeLabels,
} from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

export function CaseTable({
  cases,
  partnerNames,
}: {
  cases: Tables<"case_overview">[];
  partnerNames: Record<string, string>;
}) {
  if (cases.length === 0)
    return (
      <EmptyState title="No cases yet">Open one with “New case”.</EmptyState>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-y border-line bg-mist/70 text-xs text-slate">
            <th scope="col" className="px-6 py-3 font-medium">
              Client Name
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Case Reference
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Action Required
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {cases.map((row) => {
            const status = caseStatusLabel(row);
            const client = row.client_names ?? "[New Client]";
            return (
              <tr
                key={row.id}
                className="relative align-top transition-colors hover:bg-mist/60"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/20 text-xs font-semibold text-navy">
                      {initials(client) || "?"}
                    </span>
                    <span className="font-medium">{client}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/cases/${row.id}`}
                    className="font-medium after:absolute after:inset-0 hover:text-gold-ink"
                  >
                    <span className={row.title ? "italic" : "text-slate"}>
                      {caseTitle(row.title)}
                    </span>
                  </Link>
                  {row.relief_types && row.relief_types.length > 0 && (
                    <p className="mt-0.5 text-xs text-slate">
                      {row.relief_types
                        .map((r) => reliefTypeLabels[r])
                        .join(" / ")}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  {row.next_task_title ? (
                    <>
                      <p className="leading-snug">{row.next_task_title}</p>
                      <p className="mt-0.5 text-xs text-slate">
                        {row.next_task_assigned_to &&
                          partnerNames[row.next_task_assigned_to]}
                        {row.next_task_due_at &&
                          ` · due ${formatDateTime(row.next_task_due_at)}`}
                      </p>
                    </>
                  ) : (
                    <span className="text-slate">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge tone={caseStatusTone(status)}>
                    {status}
                  </StatusBadge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
