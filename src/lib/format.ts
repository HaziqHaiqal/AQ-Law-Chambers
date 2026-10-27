import { Constants, type Enums } from "@/lib/supabase/database.types";

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

/** Today's date in the time zone shown throughout the client account. */
export function portalToday() {
  const values = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
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
  client_case_outline: "Client Case Outline",
  writ_of_summons: "Writ of Summons",
  statement_of_claim: "Statement of Claim",
  memorandum_of_appearance: "Memorandum of Appearance",
  statement_of_defence: "Statement of Defence",
  certificate_of_urgency: "Certificate of Urgency",
  notice_of_application: "Notice of Application",
  affidavit_in_support: "Affidavit in Support",
  certificate_verifying_exhibit: "Certificate Verifying Exhibit",
  draft_order: "Draft Order",
  order: "Order",
  internal: "Internal (never published)",
};

// Clients see the same court paper names; internal files never reach them.
export const clientDocumentCategoryLabels: Record<
  Enums<"document_category">,
  string
> = { ...documentCategoryLabels, internal: "Internal" };

export const documentCategoryHints: Record<
  Enums<"document_category">,
  string
> = {
  client_case_outline: "The client's account of the facts and the case so far",
  writ_of_summons: "Originating process that starts the claim (Enclosure 1)",
  statement_of_claim: "The claim as pleaded, with the relief sought",
  memorandum_of_appearance: "Filed by the defendant's solicitors",
  statement_of_defence: "The defendant's answer to the claim",
  certificate_of_urgency: "Perakuan Segera for an urgent hearing",
  notice_of_application: "Interlocutory application, e.g. ex parte injunction",
  affidavit_in_support: "Sworn evidence with its exhibit tabs",
  certificate_verifying_exhibit:
    "Commissioner for Oaths' certificate on exhibits",
  draft_order: "Proposed order for the judge to approve",
  order: "Sealed order granted by the court",
  internal: "Drafts, legal research, forensic reports",
};

export const publishableCategories =
  Constants.public.Enums.document_category.filter(
    (category) => category !== "internal",
  );

export const reliefTypeLabels: Record<Enums<"relief_type">, string> = {
  mareva: "Mareva",
  worldwide_freezing: "Worldwide Freezing Order",
  anton_piller: "Anton Piller",
  bankers_trust: "Bankers Trust",
  norwich_pharmacal: "Norwich Pharmacal",
  other: "Other relief",
};

export const milestoneLabels: Record<Enums<"milestone_stage">, string> = {
  intake_discovery: "Client Intake, Forensic Discovery & Pre-Action Demand",
  cause_papers: "E-Filing Core Cause Papers",
  substituted_service: "Substituted Service Execution via Email",
  defence_review: "Opposing Pleadings & Defence Review",
  ex_parte_application: "Emergency Ex Parte Injunction Application",
  ex_parte_hearing: "Ex Parte High Court Hearing & Order Acquisition",
  final_judgment: "Final Judgment, Recovery Execution & Cost Taxation",
};

export const milestoneGoals: Record<Enums<"milestone_stage">, string> = {
  intake_discovery:
    "Complete forensic blockchain investigation, gather digital evidence, and establish initial contact prior to litigation.",
  cause_papers:
    "Register the main civil action in the High Court of Malaya at Kuala Lumpur (Commercial Division).",
  substituted_service:
    "Formally serve sealed court orders on offshore parties via approved digital channels.",
  defence_review:
    "Review opposing appearances and prepare responses to exchange defences.",
  ex_parte_application:
    "Prepare and submit urgent interlocutory cause papers for emergency ex parte relief.",
  ex_parte_hearing:
    "Obtain sealed interim injunctions in High Court 2 Chambers.",
  final_judgment:
    "Enter final judgment, assess exemplary damages, and recover litigation expenses.",
};

export const clientMilestoneLabels: Record<Enums<"milestone_stage">, string> = {
  intake_discovery: "Case review & evidence",
  cause_papers: "Claim filed in court",
  substituted_service: "Court papers served",
  defence_review: "Defence received",
  ex_parte_application: "Urgent application filed",
  ex_parte_hearing: "Urgent court hearing",
  final_judgment: "Judgment & recovery",
};

export const milestoneOrder = [
  "intake_discovery",
  "cause_papers",
  "substituted_service",
  "defence_review",
  "ex_parte_application",
  "ex_parte_hearing",
  "final_judgment",
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

export const clientUpdateCategoryLabels: Record<
  Enums<"update_category">,
  string
> = {
  filing: "Court filing",
  court_order: "Court order",
  execution: "Order carried out",
  service: "Order shared with banks and others",
  supervising_solicitor: "Independent solicitor report",
  compliance: "Compliance check",
  forensic: "Forensic review",
  general: "General update",
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
  intake_discovery: "Intake Phase",
  cause_papers: "Filing Phase",
  substituted_service: "Service Phase",
  defence_review: "Pleadings Phase",
  ex_parte_application: "Ex Parte Application Phase",
  ex_parte_hearing: "Hearing Phase",
  final_judgment: "Judgment Phase",
};

const afterPhase: Record<Enums<"milestone_stage">, string> = {
  intake_discovery: "Post-Intake",
  cause_papers: "Post-Filing",
  substituted_service: "Post-Service",
  defence_review: "Post-Pleadings",
  ex_parte_application: "Application Filed",
  ex_parte_hearing: "Post-Hearing",
  final_judgment: "Judgment Entered",
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

export function clientCaseStatusLabel(row: {
  status: Enums<"case_status"> | null;
}) {
  if (row.status === "intake") return "Being set up";
  if (row.status === "closed") return "Closed";
  return "In progress";
}

export function caseTitle(title: string | null) {
  return title ?? "To be assigned";
}
