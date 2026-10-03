import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/Cards/SectionCard";
import { StatCard } from "@/components/Cards/StatCard";
import { Briefcase, Inbox, ListChecks, Users } from "@/components/Icons";
import { TaskList } from "@/components/Lists/TaskList";
import { EmptyState } from "@/components/Status/EmptyState";
import { StatusBadge } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { formatDateTime, openEnquiryStatuses } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

const viewAllClass = "text-[13px] font-medium text-gold-ink hover:text-navy";

export default async function AdminDashboard() {
  const profile = await requireRole("admin");
  const supabase = await createClient();

  const [
    { data: cases },
    { data: partners },
    { data: myTasks },
    { data: enquiries },
  ] = await Promise.all([
    supabase.from("cases").select("status"),
    supabase.from("profiles").select("id, full_name").eq("role", "admin"),
    supabase
      .from("tasks")
      .select(
        "id, title, details, status, due_at, case_id, assigned_to, case:cases(title)",
      )
      .eq("assigned_to", profile.id)
      .neq("status", "done")
      .order("due_at", { ascending: true, nullsFirst: false }),
    supabase
      .from("enquiries")
      .select("id, full_name, topic, is_urgent, status, created_at")
      .in("status", openEnquiryStatuses)
      .order("is_urgent", { ascending: false })
      .order("status")
      .order("created_at", { ascending: false }),
  ]);

  const partnerNames = Object.fromEntries(
    (partners ?? []).map((p) => [p.id, p.full_name]),
  );
  const active = (cases ?? []).filter((c) => c.status === "active").length;
  const intake = (cases ?? []).filter((c) => c.status === "intake").length;
  const tasks = myTasks ?? [];
  const openEnquiries = enquiries ?? [];
  const fresh = openEnquiries.filter((e) => e.status === "new").length;

  return (
    <>
      <PageHeading
        eyebrow="Dashboard"
        title={`Welcome back, ${profile.full_name.split(" ").slice(0, 2).join(" ")}`}
      >
        Here&rsquo;s what needs your attention.
      </PageHeading>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active cases"
          value={active}
          icon={Briefcase}
          href="/admin/cases"
        />
        <StatCard
          label="Pending intake"
          value={intake}
          icon={Users}
          href="/admin/cases"
        />
        <StatCard
          label="My open tasks"
          value={tasks.length}
          icon={ListChecks}
          href="/admin/tasks"
        />
        <StatCard
          label="Enquiries to handle"
          value={openEnquiries.length}
          hint={fresh ? `${fresh} new` : undefined}
          icon={Inbox}
          href="/admin/enquiries"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="My Tasks"
          actions={
            <Link href="/admin/tasks" className={viewAllClass}>
              View all
            </Link>
          }
          flush
        >
          <div className="border-t border-line">
            <TaskList
              tasks={tasks.slice(0, 5)}
              partnerNames={partnerNames}
              emptyText="Nothing assigned to you."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Enquiries to Handle"
          actions={
            <Link href="/admin/enquiries" className={viewAllClass}>
              View all
            </Link>
          }
          flush
        >
          {openEnquiries.length ? (
            <ul className="divide-y divide-line border-t border-line">
              {openEnquiries.slice(0, 5).map((enquiry) => (
                <li key={enquiry.id}>
                  <Link
                    href="/admin/enquiries"
                    className="block px-5 py-3.5 transition-colors hover:bg-mist/60 sm:px-6"
                  >
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {enquiry.full_name}
                      </span>
                      {enquiry.status === "new" && (
                        <StatusBadge tone="pending">New</StatusBadge>
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
            <EmptyState>Nothing to handle right now.</EmptyState>
          )}
        </SectionCard>
      </div>
    </>
  );
}
