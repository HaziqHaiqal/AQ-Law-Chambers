import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/Cards/SectionCard";
import { Mail, Phone } from "@/components/Icons";
import { ActionLog } from "@/components/Lists/ActionLog";
import { ClientDocumentList } from "@/components/Lists/ClientDocumentList";
import { InvoiceList } from "@/components/Lists/InvoiceList";
import { MilestoneTimeline } from "@/components/Lists/MilestoneTimeline";
import { LiveIndicator } from "@/components/Status/LiveIndicator";
import { StatusBadge, caseStatusTone } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { firm } from "@/data/site";
import { getCurrentProfile } from "@/lib/auth";
import {
  caseStatusLabel,
  caseTitle,
  initials,
  reliefTypeLabels,
} from "@/lib/format";
import { getThreads } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Case Dashboard" };

export default async function ClientCasePage({
  params,
  searchParams,
}: PageProps<"/portal/cases/[caseId]">) {
  const caseId = Number((await params).caseId);
  const { document } = await searchParams;
  if (!Number.isInteger(caseId)) notFound();

  const profile = await getCurrentProfile();
  const supabase = await createClient();

  const [
    { data: overview },
    { data: caseRecord },
    { data: milestones },
    { data: documents },
    { data: updates },
    { data: invoices },
  ] = await Promise.all([
    supabase.from("case_overview").select("*").eq("id", caseId).maybeSingle(),
    supabase
      .from("cases")
      .select(
        "summary, court, court_reference, relief_types, lead_partner:profiles!cases_lead_partner_id_fkey(full_name, email)",
      )
      .eq("id", caseId)
      .maybeSingle(),
    supabase
      .from("case_milestones")
      .select("stage, scheduled_for, completed_at, note")
      .eq("case_id", caseId),
    supabase
      .from("documents")
      .select(
        "id, title, category, exhibit_label, file_name, size_bytes, published_at, created_at",
      )
      .eq("case_id", caseId)
      .order("published_at", { ascending: false }),
    supabase
      .from("case_updates")
      .select(
        "id, title, body, category, occurred_at, author:profiles!case_updates_author_id_fkey(full_name)",
      )
      .eq("case_id", caseId)
      .order("occurred_at", { ascending: false }),
    supabase
      .from("invoices")
      .select(
        "id, invoice_number, description, issued_on, due_on, tax_amount, total, currency, status, paid_at, file_path",
      )
      .eq("case_id", caseId)
      .order("issued_on", { ascending: false }),
  ]);

  if (!overview || !caseRecord || !profile) notFound();

  const threads = await getThreads(
    supabase,
    (documents ?? []).map((d) => d.id),
  );
  const status = caseStatusLabel(overview);
  const partner = caseRecord.lead_partner;

  return (
    <>
      <PageHeading
        eyebrow="Case Dashboard"
        title={caseTitle(overview.title)}
        actions={
          <LiveIndicator
            channel={`portal-case-${caseId}`}
            subscriptions={[
              { table: "case_milestones", filter: `case_id=eq.${caseId}` },
              { table: "case_updates", filter: `case_id=eq.${caseId}` },
              { table: "documents", filter: `case_id=eq.${caseId}` },
              { table: "document_comments" },
              { table: "invoices", filter: `case_id=eq.${caseId}` },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={caseStatusTone(status)}>{status}</StatusBadge>
          {caseRecord.relief_types.map((relief) => (
            <StatusBadge key={relief}>{reliefTypeLabels[relief]}</StatusBadge>
          ))}
          {caseRecord.court_reference && (
            <span className="text-[13px]">
              Suit no. {caseRecord.court_reference}
            </span>
          )}
        </div>
        {caseRecord.summary && (
          <p className="mt-3 max-w-3xl">{caseRecord.summary}</p>
        )}
      </PageHeading>

      <div className="grid gap-6">
        <SectionCard
          id="timeline"
          title="Procedural Timeline"
          description="Where your emergency application stands."
        >
          <MilestoneTimeline milestones={milestones ?? []} />
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 content-start gap-6">
            <SectionCard
              id="documents"
              title="Document Repository"
              description="Cause papers and affidavits shared by the firm. Each download is recorded as proof of receipt."
              flush
            >
              <ClientDocumentList
                caseId={caseId}
                documents={documents ?? []}
                threads={threads}
                viewerId={profile.id}
                openDocumentId={
                  typeof document === "string" ? Number(document) : undefined
                }
              />
            </SectionCard>

            <SectionCard id="invoices" title="Invoices" flush>
              <InvoiceList invoices={invoices ?? []} />
            </SectionCard>
          </div>

          <div className="grid content-start gap-6">
            <SectionCard
              id="updates"
              title="Real-Time Action Log"
              description="Execution steps, service, supervising solicitor reports and compliance."
            >
              <ActionLog updates={updates ?? []} />
            </SectionCard>

            <SectionCard title="Assigned Lawyer">
              {partner ? (
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold text-white">
                    {initials(partner.full_name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {partner.full_name}
                    </p>
                    <p className="text-xs text-slate">
                      Advocate &amp; Solicitor
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate">
                  A lawyer will be assigned to your case shortly.
                </p>
              )}
              <div className="mt-4 grid gap-2 text-[13px]">
                {partner && (
                  <a
                    href={`mailto:${partner.email}`}
                    className="flex items-center gap-2.5 text-navy hover:text-gold-ink"
                  >
                    <Mail className="size-4 shrink-0 text-slate" />
                    <span className="truncate">{partner.email}</span>
                  </a>
                )}
                <a
                  href={`tel:${firm.phoneTel}`}
                  className="flex items-center gap-2.5 text-navy hover:text-gold-ink"
                >
                  <Phone className="size-4 shrink-0 text-slate" />
                  Office {firm.phone}
                </a>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}
