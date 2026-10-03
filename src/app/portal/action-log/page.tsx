import type { Metadata } from "next";
import { SectionCard } from "@/components/Cards/SectionCard";
import { ActionLog } from "@/components/Lists/ActionLog";
import { CaseSelector } from "@/components/Portal/CaseSelector";
import { PortalCaseSetupState } from "@/components/Portal/PortalCaseSetupState";
import { LiveIndicator } from "@/components/Status/LiveIndicator";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { notFound } from "next/navigation";
import { caseTitle } from "@/lib/format";
import { getClientCases, getSelectedClientCase } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Case activity" };

export default async function PortalActionLogPage({
  searchParams,
}: PageProps<"/portal/action-log">) {
  await requireRole("client");
  const { case: caseParam } = await searchParams;
  const supabase = await createClient();
  const cases = await getClientCases(supabase);
  const selectedCase = getSelectedClientCase(cases, caseParam);
  if (caseParam !== undefined && !selectedCase) notFound();
  const visibleCases = selectedCase ? [selectedCase] : cases;
  const { data: updates } = visibleCases.length
    ? await supabase
        .from("case_updates")
        .select(
          "id, case_id, title, body, category, occurred_at, author:profiles!case_updates_author_id_fkey(full_name)",
        )
        .in(
          "case_id",
          visibleCases.map((item) => item.id),
        )
        .order("occurred_at", { ascending: false })
    : { data: [] };
  const caseNames = new Map(
    cases.map((item) => [item.id, caseTitle(item.title)]),
  );
  const activity = (updates ?? []).map((update) => ({
    ...update,
    caseTitle: selectedCase ? undefined : caseNames.get(update.case_id),
  }));

  return (
    <>
      <PageHeading
        eyebrow="My account"
        title="Case activity"
        actions={
          <LiveIndicator
            channel="portal-action-log"
            subscriptions={[{ table: "case_updates" }]}
          />
        }
      >
        {selectedCase
          ? `Dated updates for ${caseTitle(selectedCase.title)}, newest first.`
          : "Latest updates across your cases, with the case name shown on each one."}
      </PageHeading>
      <CaseSelector cases={cases} selectedCaseId={selectedCase?.id ?? null} />
      <SectionCard
        title={
          selectedCase
            ? caseTitle(selectedCase.title)
            : cases.length > 1
              ? "All cases"
              : undefined
        }
      >
        {visibleCases.length === 0 ? (
          <PortalCaseSetupState records="case updates" />
        ) : (
          <ActionLog updates={activity} clientView />
        )}
      </SectionCard>
    </>
  );
}
