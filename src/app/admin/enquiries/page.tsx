import type { Metadata } from "next";
import { SectionCard } from "@/components/Cards/SectionCard";
import { EnquiryStatusSelect } from "@/components/Forms/EnquiryStatusSelect";
import { Mail, Phone } from "@/components/Icons";
import { EmptyState } from "@/components/Status/EmptyState";
import { StatusBadge } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const [{ data: enquiries }, { data: partners }] = await Promise.all([
    supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("profiles").select("id, full_name").eq("role", "admin"),
  ]);

  const partnerName = new Map((partners ?? []).map((p) => [p.id, p.full_name]));
  const rank = (e: { status: string; is_urgent: boolean }) =>
    e.status === "new" ? (e.is_urgent ? 0 : 1) : 2;
  const rows = [...(enquiries ?? [])].sort(
    (a, b) => rank(a) - rank(b) || b.created_at.localeCompare(a.created_at),
  );

  return (
    <>
      <PageHeading eyebrow="Website" title="Enquiries">
        Messages from the contact form on the public website. Urgent ones were
        flagged by the sender as assets at risk.
      </PageHeading>
      <SectionCard
        title={`${rows.filter((r) => r.status === "new").length} new`}
        flush
      >
        {rows.length === 0 ? (
          <EmptyState>No enquiries yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-line border-t border-line">
            {rows.map((enquiry) => (
              <li
                key={enquiry.id}
                className="grid gap-4 px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_200px]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{enquiry.full_name}</p>
                    {enquiry.is_urgent && (
                      <StatusBadge tone="danger">
                        Urgent: assets at risk
                      </StatusBadge>
                    )}
                    {enquiry.status === "new" && (
                      <StatusBadge tone="pending">New</StatusBadge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate">
                    {enquiry.topic ?? "General enquiry"} ·{" "}
                    {formatDateTime(enquiry.created_at)}
                    {enquiry.handled_by &&
                      ` · handled by ${partnerName.get(enquiry.handled_by) ?? "a partner"}`}
                  </p>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed whitespace-pre-line">
                    {enquiry.message}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-gold-ink"
                    >
                      <Mail className="size-4 text-slate" />
                      {enquiry.email}
                    </a>
                    {enquiry.phone && (
                      <a
                        href={`tel:${enquiry.phone.replace(/[^\d+]/g, "")}`}
                        className="inline-flex items-center gap-1.5 hover:text-gold-ink"
                      >
                        <Phone className="size-4 text-slate" />
                        {enquiry.phone}
                      </a>
                    )}
                  </div>
                </div>
                <EnquiryStatusSelect id={enquiry.id} status={enquiry.status} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </>
  );
}
