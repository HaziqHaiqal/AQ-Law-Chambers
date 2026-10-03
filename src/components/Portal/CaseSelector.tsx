"use client";

import { usePathname, useRouter } from "next/navigation";
import { caseTitle } from "@/lib/format";

type CaseOption = { id: number; title: string | null };

export function CaseSelector({
  cases,
  selectedCaseId,
}: {
  cases: CaseOption[];
  selectedCaseId: number | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (cases.length < 2) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
      <label htmlFor="case-filter" className="text-[13px] font-medium">
        Case
      </label>
      <select
        id="case-filter"
        value={selectedCaseId ?? "all"}
        onChange={(event) => {
          const params = new URLSearchParams(window.location.search);
          if (event.target.value === "all") params.delete("case");
          else params.set("case", event.target.value);
          params.delete("document");
          const query = params.toString();
          router.push(query ? `${pathname}?${query}` : pathname);
        }}
        className="min-h-10 min-w-48 rounded-lg border border-line bg-white px-3 text-[13px] text-navy outline-none focus:border-gold-ink focus:ring-2 focus:ring-gold/25"
      >
        <option value="all">All cases</option>
        {cases.map((item) => (
          <option key={item.id} value={item.id}>
            {caseTitle(item.title)}
          </option>
        ))}
      </select>
    </div>
  );
}
