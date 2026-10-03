import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/Cards/SectionCard";
import { ArrowRight, Mail, Phone } from "@/components/Icons";
import { MilestoneTimeline } from "@/components/Lists/MilestoneTimeline";
import { CaseShortcuts } from "@/components/Portal/CaseShortcuts";
import { EmptyState } from "@/components/Status/EmptyState";
import { LiveIndicator } from "@/components/Status/LiveIndicator";
import { StatusBadge, caseStatusTone } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { firm } from "@/data/site";
import {
  caseTitle,
  clientCaseStatusLabel,
  formatDateTime,
  initials,
} from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Case overview" };

export default async function ClientCasePage({
  params,
}: PageProps<"/portal/cases/[caseId]">) {
  const caseId = Number((await params).caseId);
  if (!Number.isInteger(caseId)) notFound();

  const supabase = await createClient();
  const [
    { data: overview },
    { data: caseRecord },
    { data: milestones },
    { data: latestUpdate },
    { count: documentCount },
    { count: updateCount },
    { count: invoiceCount },
    { count: caseCount },
  ] = await Promise.all([
    supabase.from("case_overview").select("*").eq("id", caseId).maybeSingle(),
    supabase
      .from("cases")
      .select(
        "summary, court_reference, lead_partner:profiles!cases_lead_partner_id_fkey(full_name, email)",
      )
      .eq("id", caseId)
      .maybeSingle(),
    supabase
      .from("case_milestones")
      .select("stage, scheduled_for, completed_at, note")
      .eq("case_id", caseId),
    supabase
      .from("case_updates")
      .select("title, body, occurred_at")
      .eq("case_id", caseId)
      .order("occurred_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("case_id", caseId),
    supabase
      .from("case_updates")
      .select("id", { count: "exact", head: true })
      .eq("case_id", caseId),
    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("case_id", caseId),
    supabase.from("case_overview").select("id", { count: "exact", head: true }),
  ]);

  if (!overview || !caseRecord) notFound();

  const status = clientCaseStatusLabel(overview);
  const partner = caseRecord.lead_partner;

  return (
    <>
      <PageHeading
        eyebrow="Case overview"
        title={caseTitle(overview.title)}
        // With a single case, /portal redirects straight back here.
        back={
          (caseCount ?? 0) > 1
            ? { href: "/portal", label: "All cases" }
            : undefined
        }
        actions={
          <LiveIndicator
            channel={`portal-case-${caseId}`}
            subscriptions={[
              { table: "case_milestones", filter: `case_id=eq.${caseId}` },
              { table: "case_updates", filter: `case_id=eq.${caseId}` },
              { table: "documents", filter: `case_id=eq.${caseId}` },
              { table: "invoices", filter: `case_id=eq.${caseId}` },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={caseStatusTone(status)}>{status}</StatusBadge>
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
        <CaseShortcuts
          caseId={caseId}
          documentCount={documentCount ?? 0}
          updateCount={updateCount ?? 0}
          invoiceCount={invoiceCount ?? 0}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <SectionCard
            id="timeline"
            title="Case timeline"
            description="Key stages and dates for your case."
          >
            <MilestoneTimeline
              milestones={milestones ?? []}
              nextStage={overview.next_stage}
            />
          </SectionCard>

          <div className="grid content-start gap-6">
            <SectionCard title="Latest case update">
              {latestUpdate ? (
                <>
                  <p className="text-xs text-slate">
                    {formatDateTime(latestUpdate.occurred_at)}
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {latestUpdate.title}
                  </p>
                  <p className="mt-1 line-clamp-4 text-[13px] leading-relaxed text-slate">
                    {latestUpdate.body}
                  </p>
                  <Link
                    href={`/portal/action-log?case=${caseId}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-ink hover:text-navy"
                  >
                    View all case activity
                    <ArrowRight className="size-4" />
                  </Link>
                </>
              ) : (
                <EmptyState title="No updates yet">
                  The firm will post updates here as your case progresses.
                </EmptyState>
              )}
            </SectionCard>

            <SectionCard title="Your legal team">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-semibold text-white">
                  {partner ? initials(partner.full_name) : "A&Q"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {partner?.full_name ?? "To be assigned shortly"}
                  </p>
                  <p className="text-xs text-slate">Your lawyer</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 border-t border-line pt-4 text-[13px]">
                {partner && (
                  <a
                    href={`mailto:${partner.email}`}
                    className="flex min-w-0 items-center gap-2 text-navy hover:text-gold-ink"
                  >
                    <Mail className="size-4 shrink-0 text-slate" />
                    <span className="truncate">{partner.email}</span>
                  </a>
                )}
                <a
                  href={`tel:${firm.phoneTel}`}
                  className="flex items-center gap-2 text-navy hover:text-gold-ink"
                >
                  <Phone className="size-4 shrink-0 text-slate" />
                  {firm.phone}
                </a>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}
