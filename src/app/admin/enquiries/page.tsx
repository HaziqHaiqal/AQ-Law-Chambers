import type { Metadata } from "next";
import { SignUpLinkShare } from "@/components/Buttons/SignUpLinkShare";
import { SectionCard } from "@/components/Cards/SectionCard";
import { EnquiryProgress } from "@/components/Lists/EnquiryProgress";
import { EmptyState } from "@/components/Status/EmptyState";
import { Mail, Phone } from "@/components/Icons";
import { StatusBadge } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import type { Enums, Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { signUpLink, siteOrigin } from "@/lib/url";

export const metadata: Metadata = { title: "Enquiries" };

const stageOrder: Enums<"enquiry_status">[] = [
  "contacted",
  "signed_up",
  "case_opened",
  "closed",
  "not_proceeding",
];

export default async function EnquiriesPage() {
  const me = await requireRole("admin");
  const supabase = await createClient();
  const [{ data: enquiries }, { data: people }, origin] = await Promise.all([
    supabase
      .from("enquiries")
      .select("*, case:cases(status, opened_at, closed_at)")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("profiles").select("id, full_name, created_at"),
    siteOrigin(),
  ]);

  const person = new Map((people ?? []).map((p) => [p.id, p]));
  const rank = (e: Pick<Tables<"enquiries">, "status" | "is_urgent">) =>
    e.status === "new"
      ? e.is_urgent
        ? 0
        : 1
      : stageOrder.indexOf(e.status) + 2;
  const rows = [...(enquiries ?? [])].sort(
    (a, b) => rank(a) - rank(b) || b.created_at.localeCompare(a.created_at),
  );
  const count = (status: Enums<"enquiry_status">) =>
    rows.filter((r) => r.status === status).length;

  return (
    <>
      <PageHeading eyebrow="Firm management" title="Enquiries">
        Messages from the website contact form and client accounts. Reply with
        WhatsApp, Call or Email to mark it contacted, then open a case or close
        it.
      </PageHeading>
      <SectionCard
        title={`${count("new")} to contact · ${count("contacted")} awaiting outcome`}
        flush
      >
        {rows.length === 0 ? (
          <EmptyState>No enquiries yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-line border-t border-line">
            {rows.map((enquiry) => {
              const registeredOn = enquiry.client_id
                ? person.get(enquiry.client_id)?.created_at
                : undefined;
              return (
                <li
                  key={enquiry.id}
                  className="grid gap-5 px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_320px] md:gap-10"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{enquiry.full_name}</p>
                      {enquiry.status === "new" && (
                        <StatusBadge tone="pending">New</StatusBadge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate">
                      {enquiry.topic ?? "General enquiry"} ·{" "}
                      {formatDateTime(enquiry.created_at)}
                      {enquiry.source === "portal" && " · via client account"}
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed whitespace-pre-line">
                      {enquiry.message}
                    </p>
                    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-navy">
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <Mail className="size-4 shrink-0 text-slate" />
                        <span className="break-all select-all">
                          {enquiry.email}
                        </span>
                      </span>
                      {enquiry.phone && (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="size-4 shrink-0 text-slate" />
                          <span className="select-all">{enquiry.phone}</span>
                        </span>
                      )}
                    </p>
                  </div>
                  <EnquiryProgress
                    enquiry={enquiry}
                    caseInfo={enquiry.case}
                    partnerName={me.full_name}
                    handledBy={
                      enquiry.handled_by
                        ? person.get(enquiry.handled_by)?.full_name
                        : undefined
                    }
                  />
                  {!registeredOn && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate md:col-span-2">
                      <span>No account</span>
                      <span aria-hidden="true">·</span>
                      <SignUpLinkShare
                        enquiryId={enquiry.id}
                        name={enquiry.full_name}
                        email={enquiry.email}
                        phone={enquiry.phone}
                        link={signUpLink(
                          origin,
                          enquiry.email,
                          enquiry.full_name,
                        )}
                        message={`Hello ${enquiry.full_name}, this is ${me.full_name} from A&Q Law Chambers. Create your client account here to follow your matter with us online:`}
                        invitedAt={enquiry.invited_at}
                        invitedVia={enquiry.invited_via}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </>
  );
}
