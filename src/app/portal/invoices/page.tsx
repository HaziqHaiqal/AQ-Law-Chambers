import type { Metadata } from "next";
import { SectionCard } from "@/components/Cards/SectionCard";
import { InvoiceList } from "@/components/Lists/InvoiceList";
import { LiveIndicator } from "@/components/Status/LiveIndicator";
import { CaseSelector } from "@/components/Portal/CaseSelector";
import { PortalCaseSetupState } from "@/components/Portal/PortalCaseSetupState";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { notFound } from "next/navigation";
import { caseTitle } from "@/lib/format";
import { getClientCases, getSelectedClientCase } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Invoices" };

export default async function PortalInvoicesPage({
  searchParams,
}: PageProps<"/portal/invoices">) {
  await requireRole("client");
  const { case: caseParam } = await searchParams;
  const supabase = await createClient();
  const cases = await getClientCases(supabase);
  const selectedCase = getSelectedClientCase(cases, caseParam);
  if (caseParam !== undefined && !selectedCase) notFound();
  const visibleCases = selectedCase ? [selectedCase] : cases;
  const scopedCase = selectedCase ?? (cases.length === 1 ? cases[0] : null);
  const { data: invoices } = visibleCases.length
    ? await supabase
        .from("invoices")
        .select(
          "id, case_id, invoice_number, description, issued_on, due_on, tax_amount, total, currency, status, paid_at, file_path",
        )
        .in(
          "case_id",
          visibleCases.map((item) => item.id),
        )
        .order("issued_on", { ascending: false })
    : { data: [] };
  const caseNames = new Map(
    cases.map((item) => [item.id, caseTitle(item.title)]),
  );
  const visibleInvoices = (invoices ?? []).map((invoice) => ({
    ...invoice,
    caseTitle: scopedCase ? undefined : caseNames.get(invoice.case_id),
  }));

  return (
    <>
      <PageHeading
        eyebrow="My account"
        title="Invoices"
        actions={
          <LiveIndicator
            channel="portal-invoices"
            subscriptions={[{ table: "invoices" }]}
          />
        }
      >
        {scopedCase
          ? `Invoices for ${caseTitle(scopedCase.title)}.`
          : cases.length > 1
            ? "Review invoices across your cases. Each invoice shows which case it belongs to."
            : "Invoices from the firm will appear here."}
      </PageHeading>
      <CaseSelector cases={cases} selectedCaseId={selectedCase?.id ?? null} />
      <div className="grid grid-cols-1 gap-6">
        {visibleCases.length === 0 ? (
          <SectionCard>
            <PortalCaseSetupState records="invoices" />
          </SectionCard>
        ) : (
          <SectionCard
            title={scopedCase ? caseTitle(scopedCase.title) : "All cases"}
            flush
          >
            <InvoiceList invoices={visibleInvoices} />
          </SectionCard>
        )}
      </div>
    </>
  );
}
