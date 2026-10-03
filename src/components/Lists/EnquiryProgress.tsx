"use client";

import Link from "next/link";
import { useTransition, type ReactNode } from "react";
import { ContactChannels } from "@/components/Buttons/ContactChannels";
import { Check } from "@/components/Icons";
import {
  closeEnquiry,
  logEnquiryContact,
  reopenEnquiry,
  undoEnquiryContact,
} from "@/lib/actions/admin/enquiries";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

type Enquiry = Pick<
  Tables<"enquiries">,
  | "id"
  | "status"
  | "full_name"
  | "email"
  | "phone"
  | "topic"
  | "created_at"
  | "contacted_at"
  | "contact_method"
  | "client_id"
  | "case_id"
  | "outcome_at"
>;

type Step = {
  label: string;
  state: "done" | "current" | "upcoming";
  detail?: ReactNode;
};

const viaLabels: Record<string, string> = {
  email: "by email",
  whatsapp: "by WhatsApp",
  phone: "by phone",
};

const linkClass =
  "text-xs font-medium text-gold-ink underline-offset-2 hover:underline";
const quietClass =
  "text-xs font-medium text-slate underline-offset-2 hover:text-navy hover:underline disabled:opacity-60";

function joined(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" · ");
}

export function EnquiryProgress({
  enquiry,
  caseInfo,
  partnerName,
  handledBy,
}: {
  enquiry: Enquiry;
  caseInfo: Pick<Tables<"cases">, "status" | "opened_at" | "closed_at"> | null;
  partnerName: string;
  handledBy?: string;
}) {
  const [pending, startTransition] = useTransition();
  const run = (action: () => Promise<void>) => startTransition(action);

  const { status } = enquiry;
  const caseOpen = status === "case_opened";
  const closed = status === "closed" || status === "not_proceeding";
  const contacted = Boolean(enquiry.contacted_at) || caseOpen;
  const about = enquiry.topic ? ` about ${enquiry.topic}` : "";
  const newCaseHref = `/admin/cases?${new URLSearchParams({
    "new-case": enquiry.client_id ?? "",
    enquiry: String(enquiry.id),
  })}`;

  const steps: Step[] = [
    {
      label: "Received",
      state: "done",
      detail: formatDateTime(enquiry.created_at),
    },
    {
      label: "Contacted",
      state: contacted ? "done" : "current",
      detail: contacted ? (
        enquiry.contacted_at && (
          <span className="flex flex-wrap items-center gap-x-2">
            <span>
              {joined(
                formatDate(enquiry.contacted_at),
                viaLabels[enquiry.contact_method ?? ""],
                handledBy,
              )}
            </span>
            {status === "contacted" && (
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => undoEnquiryContact(enquiry.id))}
                className={quietClass}
              >
                Undo
              </button>
            )}
          </span>
        )
      ) : (
        <span className="grid justify-items-start gap-2">
          <ContactChannels
            email={enquiry.email}
            phone={enquiry.phone}
            call
            subject="Your enquiry to A&Q Law Chambers"
            message={`Hello ${enquiry.full_name}, this is ${partnerName} from A&Q Law Chambers, following up on your enquiry${about}.`}
            onUse={(channel) =>
              run(() =>
                logEnquiryContact(
                  enquiry.id,
                  channel === "link" ? "other" : channel,
                ),
              )
            }
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => logEnquiryContact(enquiry.id, "other"))}
            className={quietClass}
          >
            Already spoke to them? Mark as contacted
          </button>
        </span>
      ),
    },
  ];

  if (closed)
    steps.push({
      label: "Closed",
      state: "done",
      detail: (
        <span className="flex flex-wrap items-center gap-x-2">
          <span>
            {joined(
              enquiry.outcome_at && formatDate(enquiry.outcome_at),
              "No case needed",
              handledBy,
            )}
          </span>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => reopenEnquiry(enquiry.id))}
            className={quietClass}
          >
            Reopen
          </button>
        </span>
      ),
    });
  else {
    const caseClosed = caseInfo?.status === "closed";
    steps.push({
      label: "Case opened",
      state: caseOpen ? "done" : contacted ? "current" : "upcoming",
      detail: caseOpen ? (
        <span className="flex flex-wrap items-center gap-x-2">
          {caseInfo && <span>{formatDate(caseInfo.opened_at)}</span>}
          {enquiry.case_id && (
            <Link
              href={`/admin/cases/${enquiry.case_id}`}
              className={linkClass}
            >
              View case
            </Link>
          )}
        </span>
      ) : (
        contacted && (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              href={newCaseHref}
              className="inline-flex min-h-8 items-center rounded-lg bg-navy px-3 text-xs font-medium text-white transition-colors hover:bg-navy-3"
            >
              Open a case
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => closeEnquiry(enquiry.id))}
              className={quietClass}
            >
              No case needed? Close
            </button>
          </span>
        )
      ),
    });
    steps.push({
      label: "Case closed",
      state: caseClosed ? "done" : "upcoming",
      detail:
        caseClosed && caseInfo?.closed_at && formatDate(caseInfo.closed_at),
    });
  }

  return (
    <ol className="content-start">
      {steps.map((step, index) => {
        const next = steps[index + 1];
        return (
          <li
            key={step.label}
            aria-current={step.state === "current" ? "step" : undefined}
            className="relative flex gap-3 pb-4 last:pb-0"
          >
            {next && (
              <span
                aria-hidden="true"
                className={`absolute top-6 bottom-0 left-[9px] w-0.5 ${
                  next.state === "done" ? "bg-gold" : "bg-line"
                }`}
              />
            )}
            <span
              className={`relative z-10 mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                step.state === "done"
                  ? "bg-gold text-navy"
                  : step.state === "current"
                    ? "bg-white ring-[5px] ring-navy ring-inset"
                    : "border-2 border-dashed border-slate-light bg-white"
              }`}
            >
              {step.state === "done" && (
                <Check className="size-3" strokeWidth={2.75} />
              )}
            </span>
            <div className="min-w-0 flex-1 text-xs leading-relaxed text-slate">
              <p
                className={`text-[13px] font-medium ${step.state === "upcoming" ? "text-slate" : "text-navy"}`}
              >
                {step.label}
              </p>
              {step.detail && <div className="mt-1.5">{step.detail}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
