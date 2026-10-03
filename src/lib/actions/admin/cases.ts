"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import {
  asEnum,
  revalidateCase,
  type FormState,
} from "@/lib/actions/admin/shared";
import type { Enums } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { field } from "@/lib/validation/forms";

function readCaseFields(formData: FormData) {
  const fieldErrors: FormState["fieldErrors"] = {};
  const title = field(formData, "title");
  const courtReference = field(formData, "court_reference");
  const court = field(formData, "court");
  const summary = field(formData, "summary");
  const status = asEnum("case_status", field(formData, "status"));
  const leadPartner = field(formData, "lead_partner_id");
  const reliefTypes = formData
    .getAll("relief_types")
    .map((value) => asEnum("relief_type", String(value)))
    .filter((value): value is Enums<"relief_type"> => value !== null);

  if (title.length > 200)
    fieldErrors.title = "Keep the case name under 200 characters";
  if (courtReference.length > 100)
    fieldErrors.court_reference = "Keep the suit number under 100 characters";
  if (court.length > 150)
    fieldErrors.court = "Keep the court name under 150 characters";
  if (summary.length > 2000)
    fieldErrors.summary = "Keep the summary under 2,000 characters";
  if (!status) fieldErrors.status = "Choose a status";
  if (status === "active" && !title)
    fieldErrors.title = "Name the case before marking it active";

  return {
    fieldErrors,
    values: {
      title: title || null,
      court_reference: courtReference || null,
      court: court || null,
      summary: summary || null,
      status: status ?? "intake",
      lead_partner_id: leadPartner || null,
      relief_types: reliefTypes,
    },
  };
}

export async function createCase(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("admin");
  const { fieldErrors, values } = readCaseFields(formData);
  const clientId = field(formData, "client_id");
  const enquiryId = Number(field(formData, "enquiry_id"));
  if (Object.keys(fieldErrors).length)
    return { error: "Please fix the highlighted fields.", fieldErrors };

  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from("cases")
    .insert(values)
    .select("id")
    .single();
  if (error || !created)
    return { error: "The case couldn't be created. Please try again." };

  if (clientId) {
    const { error: linkError } = await supabase
      .from("case_members")
      .insert({ case_id: created.id, client_id: clientId });
    if (linkError)
      return {
        error:
          "The case was created, but the client couldn't be linked. Link them from the case page.",
      };
  }

  if (enquiryId) {
    await supabase
      .from("enquiries")
      .update({ case_id: created.id })
      .eq("id", enquiryId);
  }

  revalidateCase(created.id);
  redirect(`/admin/cases/${created.id}`);
}

export async function updateCase(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("admin");
  const caseId = Number(field(formData, "case_id"));
  const { fieldErrors, values } = readCaseFields(formData);
  if (Object.keys(fieldErrors).length)
    return { error: "Please fix the highlighted fields.", fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("cases")
    .update(values)
    .eq("id", caseId);
  if (error) return { error: "The case couldn't be saved. Please try again." };

  revalidateCase(caseId);
  return { success: "Case details saved.", savedAt: Date.now() };
}

export async function addCaseMember(caseId: number, formData: FormData) {
  await requireRole("admin");
  const clientId = field(formData, "client_id");
  if (!clientId) return;
  const supabase = await createClient();
  await supabase
    .from("case_members")
    .insert({ case_id: caseId, client_id: clientId });
  revalidateCase(caseId);
}

export async function removeCaseMember(caseId: number, clientId: string) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase
    .from("case_members")
    .delete()
    .eq("case_id", caseId)
    .eq("client_id", clientId);
  revalidateCase(caseId);
}

export async function setCaseClosed(caseId: number, closed: boolean) {
  await requireRole("admin");
  const supabase = await createClient();
  let status: Enums<"case_status"> = "closed";
  if (!closed) {
    const { data } = await supabase
      .from("cases")
      .select("title, status_before_close")
      .eq("id", caseId)
      .single();
    status = data?.status_before_close ?? (data?.title ? "active" : "intake");
  }
  await supabase.from("cases").update({ status }).eq("id", caseId);
  revalidateCase(caseId);
}
