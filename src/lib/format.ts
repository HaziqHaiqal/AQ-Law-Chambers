import type { Enums } from "@/lib/supabase/database.types";

const TIME_ZONE = "Asia/Kuala_Lumpur";
const UTC_OFFSET = "+08:00";
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

function parts(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const get = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return {
    day: Number(get.day),
    month: MONTHS[Number(get.month) - 1],
    monthNumber: get.month.padStart(2, "0"),
    dayPadded: get.day.padStart(2, "0"),
    year: get.year,
    time: `${get.hour}:${get.minute}`,
  };
}

export function formatDateTime(value: string | Date) {
  const p = parts(value);
  return `${p.day} ${p.month} ${p.year} - ${p.time}`;
}

export function formatDate(value: string | Date) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
  }
  const p = parts(value);
  return `${p.day} ${p.month} ${p.year}`;
}

export function formatLongDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export function initials(name: string) {
  return name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(
      (word) =>
        word && !["bin", "binti", "a/l", "a/p"].includes(word.toLowerCase()),
    )
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function toDateTimeInput(value: string | null | undefined) {
  if (!value) return "";
  const p = parts(value);
  return `${p.year}-${p.monthNumber}-${p.dayPadded}T${p.time}`;
}

export function fromDateTimeInput(value: string) {
  if (!value) return null;
  const date = new Date(`${value}:00${UTC_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatMoney(amount: number, currency = "MYR") {
  return new Intl.NumberFormat("en-MY", { style: "currency", currency }).format(
    amount,
  );
}

/** WhatsApp chat link; local Malaysian numbers (012-…) get the 60 country code. */
export function whatsappLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  const number = digits.startsWith("0") ? `6${digits}` : digits;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mailtoLink(email: string, subject: string, body: string) {
  const query = new URLSearchParams({ subject, body })
    .toString()
    .replaceAll("+", "%20");
  return `mailto:${email}?${query}`;
}

export const documentCategoryLabels: Record<
  Enums<"document_category">,
  string
> = {
  emergency_cause_papers: "Emergency Cause Papers",
  sworn_testimony: "Sworn Testimony",
  evidence: "Evidence",
  court_directives: "Court Directives",
  internal: "Internal (never published)",
};

export const documentCategoryHints: Record<
  Enums<"document_category">,
  string
> = {
  emergency_cause_papers: "Notice of Application, Certificate of Urgency",
  sworn_testimony: "Affidavit in Support",
  evidence: "Exhibits, e.g. telecom call logs, bank statements",
  court_directives: "Draft and sealed ex parte orders",
  internal: "Drafts, legal research, forensic reports",
};

export const publishableCategories = [
  "emergency_cause_papers",
  "sworn_testimony",
  "evidence",
  "court_directives",
] as const satisfies readonly Enums<"document_category">[];

export const reliefTypeLabels: Record<Enums<"relief_type">, string> = {
  mareva: "Mareva",
  worldwide_freezing: "Worldwide Freezing Order",
  anton_piller: "Anton Piller",
  bankers_trust: "Bankers Trust",
  norwich_pharmacal: "Norwich Pharmacal",
  other: "Other relief",
};

export const milestoneLabels: Record<Enums<"milestone_stage">, string> = {
  ex_parte_filing: "Ex Parte Filing",
  ex_parte_hearing: "Ex Parte Hearing",
  execution_service: "Execution / Service of Order",
  inter_partes_return: "Inter Partes Return Date",
};

export const milestoneOrder = [
  "ex_parte_filing",
  "ex_parte_hearing",
  "execution_service",
  "inter_partes_return",
] as const satisfies readonly Enums<"milestone_stage">[];

export const updateCategoryLabels: Record<Enums<"update_category">, string> = {
  filing: "Filing",
  court_order: "Court Order",
  execution: "Execution",
  service: "Service on Banks & Third Parties",
  supervising_solicitor: "Supervising Solicitor Report",
  compliance: "Compliance",
  forensic: "Forensic",
  general: "General",
};

/** Enquiries waiting on a partner: not contacted yet, or no case opened or closed. */
export const openEnquiryStatuses = [
  "new",
  "contacted",
  "signed_up",
] satisfies Enums<"enquiry_status">[];

export const invoiceStatusLabels: Record<Enums<"invoice_status">, string> = {
  draft: "Draft",
  issued: "Issued",
  paid: "Paid",
  void: "Void",
};

export type MilestoneState = "done" | "in_progress" | "upcoming";

export function milestoneState(milestone: {
  completed_at: string | null;
  scheduled_for: string | null;
}): MilestoneState {
  if (milestone.completed_at) return "done";
  if (
    milestone.scheduled_for &&
    new Date(milestone.scheduled_for) <= new Date()
  )
    return "in_progress";
  return "upcoming";
}

const inProgressPhase: Record<Enums<"milestone_stage">, string> = {
  ex_parte_filing: "Filing Phase",
  ex_parte_hearing: "Hearing Phase",
  execution_service: "Execution Phase",
  inter_partes_return: "Return Date Phase",
};

const afterPhase: Record<Enums<"milestone_stage">, string> = {
  ex_parte_filing: "Post-Filing",
  ex_parte_hearing: "Post-Hearing",
  execution_service: "Post-Execution",
  inter_partes_return: "Inter Partes Concluded",
};

export function caseStatusLabel(row: {
  status: Enums<"case_status"> | null;
  last_completed_stage: Enums<"milestone_stage"> | null;
  next_stage: Enums<"milestone_stage"> | null;
  next_stage_scheduled_for: string | null;
}) {
  if (row.status === "intake") return "Pending Intake";
  if (row.status === "closed") return "Closed";
  if (
    row.next_stage &&
    milestoneState({
      completed_at: null,
      scheduled_for: row.next_stage_scheduled_for,
    }) === "in_progress"
  )
    return `Active - ${inProgressPhase[row.next_stage]}`;
  if (row.last_completed_stage)
    return `Active - ${afterPhase[row.last_completed_stage]}`;
  return "Active - Pre-Filing";
}

export function caseTitle(title: string | null) {
  return title ?? "To be assigned";
}
