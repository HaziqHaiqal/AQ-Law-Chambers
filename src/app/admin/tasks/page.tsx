import type { Metadata } from "next";
import { SectionCard } from "@/components/Cards/SectionCard";
import { TaskForm } from "@/components/Forms/TaskForm";
import { TaskList } from "@/components/Lists/TaskList";
import { Tabs } from "@/components/Navigation/Tabs";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { caseTitle } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Task Allocation" };

export default async function TasksPage({
  searchParams,
}: PageProps<"/admin/tasks">) {
  const profile = await requireRole("admin");
  const showAll = (await searchParams).view === "all";
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select(
      "id, title, details, status, due_at, case_id, assigned_to, case:cases(title)",
    )
    .order("due_at", { ascending: true, nullsFirst: false });
  if (!showAll) query = query.eq("assigned_to", profile.id);

  const [{ data: tasks }, { data: partners }, { data: cases }] =
    await Promise.all([
      query,
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "admin")
        .order("full_name"),
      supabase
        .from("cases")
        .select("id, title")
        .neq("status", "closed")
        .order("opened_at", { ascending: false }),
    ]);

  const partnerNames = Object.fromEntries(
    (partners ?? []).map((p) => [p.id, p.full_name]),
  );
  const open = (tasks ?? []).filter((t) => t.status !== "done");
  const done = (tasks ?? []).filter((t) => t.status === "done");

  return (
    <>
      <PageHeading eyebrow="Firm management" title="Partner Task Allocation">
        Assign drafting work between partners with internal deadlines. Clients
        never see tasks.
      </PageHeading>
      <Tabs
        label="Whose tasks"
        items={[
          { label: "Assigned to me", href: "/admin/tasks", active: !showAll },
          {
            label: "All partners",
            href: "/admin/tasks?view=all",
            active: showAll,
          },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid content-start gap-6">
          <SectionCard title={`Open · ${open.length}`} flush>
            <div className="border-t border-line">
              <TaskList
                tasks={open}
                partnerNames={partnerNames}
                emptyText="No open tasks."
              />
            </div>
          </SectionCard>
          {done.length > 0 && (
            <SectionCard title={`Completed · ${done.length}`} flush>
              <div className="border-t border-line">
                <TaskList tasks={done} partnerNames={partnerNames} />
              </div>
            </SectionCard>
          )}
        </div>
        <SectionCard title="Assign a Task" className="h-fit">
          <TaskForm
            partners={(partners ?? []).map((p) => ({
              value: p.id,
              label: p.id === profile.id ? `${p.full_name} (me)` : p.full_name,
            }))}
            cases={(cases ?? []).map((c) => ({
              value: String(c.id),
              label: caseTitle(c.title),
            }))}
            defaultAssignee={
              (partners ?? []).find((p) => p.id !== profile.id)?.id ??
              profile.id
            }
          />
        </SectionCard>
      </div>
    </>
  );
}
