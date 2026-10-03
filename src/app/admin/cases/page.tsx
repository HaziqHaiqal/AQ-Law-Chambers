import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/Buttons/Button";
import { SectionCard } from "@/components/Cards/SectionCard";
import { NewCaseForm } from "@/components/Forms/NewCaseForm";
import { Plus } from "@/components/Icons";
import { Modal } from "@/components/Layout/Modal";
import { CaseTable } from "@/components/Lists/CaseTable";
import { Tabs } from "@/components/Navigation/Tabs";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Cases" };

const VIEWS = {
  open: { label: "Open", empty: "No open cases." },
  closed: { label: "Closed", empty: "No closed cases yet." },
  all: { label: "All", empty: "Open one with “New case”." },
} as const;
type View = keyof typeof VIEWS;

const statusOrder = { active: 0, intake: 1, closed: 2 } as const;

export default async function CasesPage({
  searchParams,
}: PageProps<"/admin/cases">) {
  const profile = await requireRole("admin");
  const {
    view: rawView,
    "new-case": newCase,
    enquiry: enquiryParam,
  } = await searchParams;
  const view: View =
    rawView === "closed" || rawView === "all" ? rawView : "open";
  const enquiryId = Number(enquiryParam);
  const supabase = await createClient();

  const [{ data: cases }, { data: people }, { data: fromEnquiry }] =
    await Promise.all([
      supabase
        .from("case_overview")
        .select("*")
        .order("opened_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id, full_name, email, organisation, role")
        .order("full_name"),
      Number.isInteger(enquiryId) && enquiryId > 0
        ? supabase
            .from("enquiries")
            .select("id, full_name, email, client_id")
            .eq("id", enquiryId)
            .maybeSingle()
        : { data: null },
    ]);

  const partners = (people ?? []).filter((p) => p.role === "admin");
  const clients = (people ?? []).filter((p) => p.role === "client");
  const partnerNames = Object.fromEntries(
    partners.map((p) => [p.id, p.full_name]),
  );
  const all = [...(cases ?? [])].sort(
    (a, b) =>
      statusOrder[a.status ?? "closed"] - statusOrder[b.status ?? "closed"],
  );
  const groups: Record<View, typeof all> = {
    open: all.filter((c) => c.status !== "closed"),
    closed: all.filter((c) => c.status === "closed"),
    all,
  };

  return (
    <>
      <PageHeading
        eyebrow="Master Case Dashboard"
        title="Cases"
        actions={
          <Link
            href="/admin/cases?new-case"
            scroll={false}
            className={buttonStyles.appPrimary}
          >
            <Plus className="size-4" />
            New case
          </Link>
        }
      >
        Every matter with its client, the action required and its status. Open a
        case to manage its workspace.
      </PageHeading>

      <Tabs
        label="Filter cases"
        items={(Object.keys(VIEWS) as View[]).map((key) => ({
          label: VIEWS[key].label,
          href: key === "open" ? "/admin/cases" : `/admin/cases?view=${key}`,
          active: view === key,
          count: groups[key].length,
        }))}
      />

      <SectionCard flush>
        <CaseTable
          cases={groups[view]}
          partnerNames={partnerNames}
          emptyText={VIEWS[view].empty}
        />
      </SectionCard>

      <Modal
        open={newCase !== undefined}
        title="New Case"
        description={
          fromEnquiry
            ? `From ${fromEnquiry.full_name}'s enquiry. The four court milestones are added automatically.`
            : "The four court milestones are added automatically."
        }
        closeHref="/admin/cases"
      >
        <NewCaseForm
          key={`${newCase}-${enquiryParam}`}
          partners={partners}
          clients={clients}
          defaultClientId={typeof newCase === "string" ? newCase : ""}
          defaultPartnerId={profile.id}
          fromEnquiry={fromEnquiry}
        />
      </Modal>
    </>
  );
}
