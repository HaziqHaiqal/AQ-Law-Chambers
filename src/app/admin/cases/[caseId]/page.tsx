import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewInvoiceButton } from "@/components/Buttons/NewInvoiceButton";
import { SectionCard } from "@/components/Cards/SectionCard";
import { CaseDetailsForm } from "@/components/Forms/CaseDetailsForm";
import { CaseUpdateForm } from "@/components/Forms/CaseUpdateForm";
import { DocumentUploadForm } from "@/components/Forms/DocumentUploadForm";
import { TaskForm } from "@/components/Forms/TaskForm";
import { CaseUpdateFeed } from "@/components/Lists/CaseUpdateFeed";
import { ClientAccessList } from "@/components/Lists/ClientAccessList";
import {
  ManagedDocumentList,
  type Receipt,
} from "@/components/Lists/ManagedDocumentList";
import { ManagedInvoiceList } from "@/components/Lists/ManagedInvoiceList";
import { MilestoneChecklist } from "@/components/Lists/MilestoneChecklist";
import { TaskList } from "@/components/Lists/TaskList";
import { Tabs } from "@/components/Navigation/Tabs";
import { LiveIndicator } from "@/components/Status/LiveIndicator";
import { StatusBadge, caseStatusTone } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import {
  caseStatusLabel,
  caseTitle,
  formatDateTime,
  reliefTypeLabels,
} from "@/lib/format";
import { getThreads } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Client Workspace" };

const TABS = ["documents", "progress", "billing", "tasks", "client"] as const;
type Tab = (typeof TABS)[number];

export default async function CaseWorkspace({
  params,
  searchParams,
}: PageProps<"/admin/cases/[caseId]">) {
  const profile = await requireRole("admin");
  const caseId = Number((await params).caseId);
  const { tab: rawTab, document } = await searchParams;
  if (!Number.isInteger(caseId)) notFound();
  const tab: Tab = TABS.includes(rawTab as Tab) ? (rawTab as Tab) : "documents";

  const supabase = await createClient();
  const [
    { data: overview },
    { data: caseRecord },
    { data: milestones },
    { data: documents },
    { data: updates },
    { data: invoices },
    { data: tasks },
    { data: members },
    { data: people },
    { data: downloads },
    { count: invoiceCount },
  ] = await Promise.all([
    supabase.from("case_overview").select("*").eq("id", caseId).maybeSingle(),
    supabase.from("cases").select("*").eq("id", caseId).maybeSingle(),
    supabase
      .from("case_milestones")
      .select(
        "stage, scheduled_for, completed_at, note, completer:profiles!case_milestones_completed_by_fkey(full_name)",
      )
      .eq("case_id", caseId),
    supabase
      .from("documents")
      .select(
        "id, title, category, exhibit_label, file_name, size_bytes, is_published, published_at, created_at, uploader:profiles!documents_uploaded_by_fkey(full_name)",
      )
      .eq("case_id", caseId)
      .order("created_at", { ascending: false }),
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
      .order("created_at", { ascending: false }),
    supabase
      .from("tasks")
      .select(
        "id, title, details, status, due_at, case_id, assigned_to, case:cases(title)",
      )
      .eq("case_id", caseId)
      .order("due_at", { ascending: true, nullsFirst: false }),
    supabase.from("case_members").select("client_id").eq("case_id", caseId),
    supabase
      .from("profiles")
      .select("id, full_name, email, organisation, role, last_sign_in_at")
      .order("full_name"),
    supabase
      .from("audit_events")
      .select(
        "document_id, created_at, actor:profiles!audit_events_actor_id_fkey(full_name, role)",
      )
      .eq("case_id", caseId)
      .eq("action", "document_downloaded")
      .order("created_at", { ascending: false }),
    supabase.from("invoices").select("id", { count: "exact", head: true }),
  ]);

  if (!overview || !caseRecord) notFound();

  const memberIds = new Set((members ?? []).map((m) => m.client_id));
  const partners = (people ?? []).filter((p) => p.role === "admin");
  const clients = (people ?? []).filter((p) => p.role === "client");
  const linked = clients.filter((c) => memberIds.has(c.id));
  const partnerNames = Object.fromEntries(
    partners.map((p) => [p.id, p.full_name]),
  );
  const docs = documents ?? [];
  const openTasks = (tasks ?? []).filter((t) => t.status !== "done");

  const clientDownloads = (downloads ?? []).filter(
    (event) => event.actor?.role === "client",
  );
  const receipts: Record<number, Receipt[]> = {};
  for (const event of clientDownloads) {
    if (event.document_id && event.actor)
      (receipts[event.document_id] ??= []).push({
        name: event.actor.full_name,
        at: event.created_at,
      });
  }

  const status = caseStatusLabel(overview);
  const href = (next: Tab) =>
    `/admin/cases/${caseId}${next === "documents" ? "" : `?tab=${next}`}`;
  const lastLogin = linked
    .map((client) => client.last_sign_in_at)
    .filter((value): value is string => value !== null)
    .sort()
    .at(-1);
  const facts = [
    { label: "Client", value: overview.client_names ?? "Not linked" },
    {
      label: "Assigned Lawyer",
      value:
        (caseRecord.lead_partner_id &&
          partnerNames[caseRecord.lead_partner_id]) ||
        "Not assigned",
    },
    { label: "Action Required", value: overview.next_task_title ?? "—" },
    {
      label: "Client Last Login",
      value: lastLogin ? formatDateTime(lastLogin) : "Not yet",
    },
  ];

  return (
    <>
      <PageHeading
        back={{ href: "/admin", label: "Dashboard" }}
        eyebrow="Client Workspace"
        title={caseTitle(overview.title)}
        actions={
          <LiveIndicator
            channel={`admin-case-${caseId}`}
            subscriptions={[
              { table: "document_comments" },
              { table: "documents", filter: `case_id=eq.${caseId}` },
              { table: "case_milestones", filter: `case_id=eq.${caseId}` },
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
            <span className="text-[13px]">{caseRecord.court_reference}</span>
          )}
        </div>
      </PageHeading>

      <dl className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label} className="bg-white px-5 py-4">
            <dt className="text-xs text-slate">{fact.label}</dt>
            <dd
              className="mt-1 truncate text-sm font-medium"
              title={fact.value}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <Tabs
        label="Workspace sections"
        items={[
          {
            label: "Document Manager",
            href: href("documents"),
            active: tab === "documents",
            count: docs.length,
          },
          {
            label: "Milestones & Updates",
            href: href("progress"),
            active: tab === "progress",
          },
          {
            label: "Invoices",
            href: href("billing"),
            active: tab === "billing",
            count: invoices?.length ?? 0,
          },
          {
            label: "Tasks",
            href: href("tasks"),
            active: tab === "tasks",
            count: openTasks.length,
          },
          {
            label: "Client & Case Details",
            href: href("client"),
            active: tab === "client",
          },
        ]}
      />

      {tab === "documents" && (
        <div className="grid gap-6">
          <SectionCard
            title="Internal File Drop"
            description="Files stay internal until you switch on “Publish to Client Repository”."
          >
            <DocumentUploadForm caseId={caseId} />
          </SectionCard>
          <SectionCard
            title="Uploaded Documents"
            description={`${docs.filter((d) => d.is_published).length} of ${docs.length} published to the client`}
          >
            <ManagedDocumentList
              caseId={caseId}
              documents={docs}
              threads={await getThreads(
                supabase,
                docs.map((d) => d.id),
              )}
              receipts={receipts}
              viewerId={profile.id}
              openDocumentId={
                typeof document === "string" ? Number(document) : undefined
              }
            />
          </SectionCard>
        </div>
      )}

      {tab === "progress" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Milestone Controller"
            description="Tick a stage and the client's timeline advances immediately."
            className="h-fit"
          >
            <MilestoneChecklist caseId={caseId} milestones={milestones ?? []} />
          </SectionCard>
          <div className="grid content-start gap-6">
            <SectionCard
              title="Status Update Broadcaster"
              description="Posts to the client's Real-Time Action Log and notifies them."
            >
              <CaseUpdateForm caseId={caseId} />
            </SectionCard>
            <SectionCard title="Chronological Update Feed">
              <CaseUpdateFeed caseId={caseId} updates={updates ?? []} />
            </SectionCard>
          </div>
        </div>
      )}

      {tab === "billing" && (
        <SectionCard
          title="Invoices"
          description="Drafts are internal. Issued invoices appear in the client's portal."
          flush
        >
          <div className="border-t border-line">
            <ManagedInvoiceList caseId={caseId} invoices={invoices ?? []} />
          </div>
          <div className="border-t border-line p-5 sm:p-6">
            <NewInvoiceButton
              caseId={caseId}
              suggestedNumber={`INV-${new Date().getFullYear()}-${String((invoiceCount ?? 0) + 1).padStart(4, "0")}`}
            />
          </div>
        </SectionCard>
      )}

      {tab === "tasks" && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <SectionCard
            title="Case Tasks"
            description="The earliest open task shows as “Action Required” on the dashboard."
            flush
          >
            <div className="border-t border-line">
              <TaskList
                tasks={tasks ?? []}
                partnerNames={partnerNames}
                showCase={false}
                emptyText="No tasks on this case."
              />
            </div>
          </SectionCard>
          <SectionCard title="Assign a Task" className="h-fit">
            <TaskForm
              partners={partners.map((p) => ({
                value: p.id,
                label:
                  p.id === profile.id ? `${p.full_name} (me)` : p.full_name,
              }))}
              fixedCaseId={caseId}
              defaultAssignee={profile.id}
            />
          </SectionCard>
        </div>
      )}

      {tab === "client" && (
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="grid content-start gap-6">
            <SectionCard title="Client Access">
              <ClientAccessList
                caseId={caseId}
                linked={linked}
                available={clients.filter((c) => !memberIds.has(c.id))}
              />
            </SectionCard>
            <SectionCard
              title="Read Receipts"
              description="Proof of delivery before filing in court."
              flush
            >
              {clientDownloads.length ? (
                <ul className="divide-y divide-line border-t border-line">
                  {clientDownloads.slice(0, 12).map((event) => (
                    <li
                      key={`${event.document_id}-${event.created_at}`}
                      className="px-5 py-3 sm:px-6"
                    >
                      <p className="truncate text-[13px] font-medium">
                        {docs.find((d) => d.id === event.document_id)?.title ??
                          "Deleted document"}
                      </p>
                      <p className="text-xs text-slate">
                        {event.actor?.full_name} ·{" "}
                        {formatDateTime(event.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="border-t border-line px-5 py-4 text-[13px] text-slate sm:px-6">
                  No downloads yet.
                </p>
              )}
            </SectionCard>
          </div>
          <SectionCard title="Case Details">
            <CaseDetailsForm
              caseId={caseId}
              values={caseRecord}
              partners={partners}
            />
          </SectionCard>
        </div>
      )}
    </>
  );
}
