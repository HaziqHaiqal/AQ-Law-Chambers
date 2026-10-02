import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/Buttons/Button";
import { SectionCard } from "@/components/Cards/SectionCard";
import { StatCard } from "@/components/Cards/StatCard";
import { NewCaseForm } from "@/components/Forms/NewCaseForm";
import { Briefcase, Inbox, ListChecks, Plus, Users } from "@/components/Icons";
import { Modal } from "@/components/Layout/Modal";
import { CaseTable } from "@/components/Lists/CaseTable";
import { TaskList } from "@/components/Lists/TaskList";
import { EmptyState } from "@/components/Status/EmptyState";
import { StatusBadge } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { formatDate, formatDateTime, initials } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Master Case Dashboard" };

const statusOrder = { active: 0, intake: 1, closed: 2 } as const;

export default async function AdminDashboard({
  searchParams,
}: PageProps<"/admin">) {
  const profile = await requireRole("admin");
  const { "new-case": newCase } = await searchParams;
  const supabase = await createClient();

  const [
    { data: cases },
    { data: people },
    { data: members },
    { data: myTasks },
    { data: enquiries },
  ] = await Promise.all([
    supabase
      .from("case_overview")
      .select("*")
      .order("opened_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, full_name, email, organisation, role, created_at")
      .order("full_name"),
    supabase.from("case_members").select("client_id"),
    supabase
      .from("tasks")
      .select(
        "id, title, details, status, due_at, case_id, assigned_to, case:cases(title)",
      )
      .eq("assigned_to", profile.id)
      .neq("status", "done")
      .order("due_at", { ascending: true, nullsFirst: false })
      .limit(5),
    supabase
      .from("enquiries")
      .select("id, full_name, topic, is_urgent, created_at")
      .eq("status", "new")
      .order("is_urgent", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const partners = (people ?? []).filter((p) => p.role === "admin");
  const clients = (people ?? []).filter((p) => p.role === "client");
  const partnerNames = Object.fromEntries(
    partners.map((p) => [p.id, p.full_name]),
  );
  const linked = new Set((members ?? []).map((m) => m.client_id));
  const pendingClients = clients
    .filter((c) => !linked.has(c.id))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const rows = [...(cases ?? [])].sort(
    (a, b) =>
      statusOrder[a.status ?? "closed"] - statusOrder[b.status ?? "closed"],
  );
  const active = rows.filter((r) => r.status === "active").length;
  const intake = rows.filter((r) => r.status === "intake").length;
  const urgent = (enquiries ?? []).filter((e) => e.is_urgent).length;

  return (
    <>
      <PageHeading
        eyebrow="Master Case Dashboard"
        title={`Welcome back, ${profile.full_name.split(" ").slice(0, 2).join(" ")}`}
        actions={
          <Link
            href="/admin?new-case"
            scroll={false}
            className={buttonStyles.appPrimary}
          >
            <Plus className="size-4" />
            New case
          </Link>
        }
      >
        All active litigation at a glance. Open a case to manage its workspace.
      </PageHeading>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active cases" value={active} icon={Briefcase} />
        <StatCard
          label="Pending intake"
          value={intake + pendingClients.length}
          hint={`${pendingClients.length} new sign-ups`}
          icon={Users}
        />
        <StatCard
          label="My open tasks"
          value={myTasks?.length ?? 0}
          icon={ListChecks}
          href="/admin/tasks"
        />
        <StatCard
          label="New enquiries"
          value={enquiries?.length ?? 0}
          hint={urgent ? `${urgent} urgent` : undefined}
          icon={Inbox}
          href="/admin/enquiries"
        />
      </div>

      <SectionCard
        title="All Cases"
        description="Click a row to open the client workspace."
        flush
      >
        <CaseTable cases={rows} partnerNames={partnerNames} />
      </SectionCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="New Clients"
          description="Signed up, not yet linked to a case."
          flush
        >
          {pendingClients.length === 0 ? (
            <EmptyState>Every client is linked to a case.</EmptyState>
          ) : (
            <ul className="divide-y divide-line border-t border-line">
              {pendingClients.map((client) => (
                <li
                  key={client.id}
                  className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/20 text-xs font-semibold text-navy">
                    {initials(client.organisation ?? client.full_name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {client.organisation ?? client.full_name}
                    </p>
                    <p className="truncate text-xs text-slate">
                      Joined {formatDate(client.created_at)}
                    </p>
                  </div>
                  <Link
                    href={`/admin?new-case=${client.id}`}
                    scroll={false}
                    className={`${buttonStyles.appSecondary} min-h-8 px-3 text-xs`}
                  >
                    Create case
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="My Tasks"
          actions={
            <Link
              href="/admin/tasks"
              className="text-[13px] font-medium text-gold-ink hover:text-navy"
            >
              View all
            </Link>
          }
          flush
        >
          <div className="border-t border-line">
            <TaskList
              tasks={myTasks ?? []}
              partnerNames={partnerNames}
              emptyText="Nothing assigned to you."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="New Enquiries"
          actions={
            <Link
              href="/admin/enquiries"
              className="text-[13px] font-medium text-gold-ink hover:text-navy"
            >
              Inbox
            </Link>
          }
          flush
        >
          {enquiries?.length ? (
            <ul className="divide-y divide-line border-t border-line">
              {enquiries.map((enquiry) => (
                <li key={enquiry.id}>
                  <Link
                    href="/admin/enquiries"
                    className="block px-5 py-3.5 transition-colors hover:bg-mist/60 sm:px-6"
                  >
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {enquiry.full_name}
                      </span>
                      {enquiry.is_urgent && (
                        <StatusBadge tone="danger">Urgent</StatusBadge>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate">
                      {enquiry.topic ?? "General enquiry"} ·{" "}
                      {formatDateTime(enquiry.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>No new enquiries.</EmptyState>
          )}
        </SectionCard>
      </div>

      <Modal
        open={newCase !== undefined}
        title="New Case"
        description="The four court milestones are added automatically."
        closeHref="/admin"
      >
        <NewCaseForm
          key={String(newCase)}
          partners={partners}
          clients={clients}
          defaultClientId={typeof newCase === "string" ? newCase : ""}
          defaultPartnerId={profile.id}
        />
      </Modal>
    </>
  );
}
