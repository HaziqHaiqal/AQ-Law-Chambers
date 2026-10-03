import type { Metadata } from "next";
import { SectionCard } from "@/components/Cards/SectionCard";
import { ClientDocumentList } from "@/components/Lists/ClientDocumentList";
import { CaseSelector } from "@/components/Portal/CaseSelector";
import { LiveIndicator } from "@/components/Status/LiveIndicator";
import { PortalCaseSetupState } from "@/components/Portal/PortalCaseSetupState";
import { PageHeading } from "@/components/Typography/PageHeading";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { caseTitle } from "@/lib/format";
import {
  getClientCases,
  getSelectedClientCase,
  getThreads,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Documents" };

export default async function PortalDocumentsPage({
  searchParams,
}: PageProps<"/portal/documents">) {
  const profile = await requireRole("client");
  const { case: caseParam, document } = await searchParams;
  const supabase = await createClient();
  const cases = await getClientCases(supabase);
  const selectedCase = getSelectedClientCase(cases, caseParam);
  if (caseParam !== undefined && !selectedCase) notFound();
  const visibleCases = selectedCase ? [selectedCase] : cases;
  const { data: documents } = visibleCases.length
    ? await supabase
        .from("documents")
        .select(
          "id, case_id, title, category, exhibit_label, file_name, size_bytes, published_at, created_at",
        )
        .in(
          "case_id",
          visibleCases.map((item) => item.id),
        )
        .order("published_at", { ascending: false })
    : { data: [] };
  const docs = documents ?? [];
  const caseNames = Object.fromEntries(
    cases.map((item) => [item.id, caseTitle(item.title)]),
  ) as Record<number, string>;
  const threads = await getThreads(
    supabase,
    docs.map((d) => d.id),
  );

  return (
    <>
      <PageHeading
        eyebrow="My account"
        title="Documents"
        actions={
          <LiveIndicator
            channel="portal-documents"
            subscriptions={[
              { table: "documents" },
              { table: "document_comments" },
            ]}
          />
        }
      >
        {selectedCase
          ? `Files shared for ${caseTitle(selectedCase.title)}. Download a copy or leave a private comment. Downloads are logged as proof that you received the file.`
          : "Files shared across your cases. Each file shows which case it belongs to."}
      </PageHeading>
      <CaseSelector cases={cases} selectedCaseId={selectedCase?.id ?? null} />
      <div className="grid grid-cols-1 gap-6">
        {visibleCases.length === 0 ? (
          <SectionCard>
            <PortalCaseSetupState records="documents" />
          </SectionCard>
        ) : (
          <SectionCard
            title={
              selectedCase
                ? caseTitle(selectedCase.title)
                : cases.length > 1
                  ? "All cases"
                  : "Shared files"
            }
            flush
          >
            <ClientDocumentList
              documents={docs}
              threads={threads}
              viewerId={profile.id}
              caseNames={
                cases.length > 1 && !selectedCase ? caseNames : undefined
              }
              openDocumentId={
                typeof document === "string" ? Number(document) : undefined
              }
            />
          </SectionCard>
        )}
      </div>
    </>
  );
}
