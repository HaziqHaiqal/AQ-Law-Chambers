import Link from "next/link";
import { EmptyState } from "@/components/Status/EmptyState";
import { StatusBadge, type BadgeTone } from "@/components/Status/StatusBadge";
import { formatDateTime } from "@/lib/format";
import type { Enums, Tables } from "@/lib/supabase/database.types";

type Enquiry = Pick<
  Tables<"enquiries">,
  "id" | "topic" | "message" | "status" | "created_at" | "is_urgent" | "source"
>;

const clientStatus: Record<
  Enums<"enquiry_status">,
  { label: string; tone: BadgeTone }
> = {
  new: { label: "Received", tone: "pending" },
  contacted: { label: "In progress", tone: "active" },
  signed_up: { label: "In progress", tone: "active" },
  closed: { label: "Closed", tone: "muted" },
  case_opened: { label: "Case opened", tone: "active" },
  not_proceeding: { label: "Closed", tone: "muted" },
};

export function ClientEnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  if (!enquiries.length)
    return (
      <EmptyState>
        You haven&rsquo;t sent an enquiry yet. Use the form to ask the firm for
        advice or tell us about a new matter.
      </EmptyState>
    );

  return (
    <ul className="divide-y divide-line">
      {enquiries.map((enquiry) => {
        const status = clientStatus[enquiry.status];
        return (
          <li key={enquiry.id} className="grid gap-2 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate">
                {enquiry.topic ?? "General enquiry"} ·{" "}
                {formatDateTime(enquiry.created_at)}
                {enquiry.source === "website" && " · Sent from the website"}
              </p>
              <span className="flex flex-wrap gap-1.5">
                {enquiry.is_urgent && (
                  <StatusBadge tone="danger">Urgent</StatusBadge>
                )}
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {enquiry.message}
            </p>
            {enquiry.status === "case_opened" && (
              <Link
                href="/portal"
                className="text-xs font-medium text-gold-ink"
              >
                View your case
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
