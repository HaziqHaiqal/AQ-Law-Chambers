"use server";

import { requireRole } from "@/lib/auth";
import {
  asEnum,
  revalidateCase,
  type FormState,
} from "@/lib/actions/admin/shared";
import { fromDateTimeInput } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { field } from "@/lib/validation/forms";

function readUpdate(formData: FormData) {
  const fieldErrors: FormState["fieldErrors"] = {};
  const category = asEnum("update_category", field(formData, "category"));
  const title = field(formData, "title");
  const body = field(formData, "body");
  const occurredRaw = field(formData, "occurred_at");
  const occurredAt = occurredRaw
    ? fromDateTimeInput(occurredRaw)
    : new Date().toISOString();

  if (!category) fieldErrors.category = "Choose a category";
  if (!title) fieldErrors.title = "Add a short headline, e.g. Execution Update";
  else if (title.length > 120)
    fieldErrors.title = "Keep the headline under 120 characters";
  if (!body) fieldErrors.body = "Write the update";
  else if (body.length > 4000)
    fieldErrors.body = "Keep the update under 4,000 characters";
  if (!occurredAt) fieldErrors.occurred_at = "Enter a valid date and time";

  return {
    fieldErrors,
    values: {
      category: category ?? "general",
      title,
      body,
      occurred_at: occurredAt ?? new Date().toISOString(),
    },
  };
}

export async function postCaseUpdate(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const profile = await requireRole("admin");
  const caseId = Number(field(formData, "case_id"));
  const { fieldErrors, values } = readUpdate(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("case_updates")
    .insert({ ...values, case_id: caseId, author_id: profile.id });
  if (error)
    return { error: "The update couldn't be posted. Please try again." };

  revalidateCase(caseId);
  return {
    success: "Update sent to the client's action log.",
    savedAt: Date.now(),
  };
}

export async function editCaseUpdate(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("admin");
  const caseId = Number(field(formData, "case_id"));
  const updateId = Number(field(formData, "update_id"));
  const { fieldErrors, values } = readUpdate(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("case_updates")
    .update(values)
    .eq("id", updateId);
  if (error)
    return { error: "The update couldn't be saved. Please try again." };

  revalidateCase(caseId);
  return { success: "Saved", savedAt: Date.now() };
}

export async function deleteCaseUpdate(updateId: number, caseId: number) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("case_updates").delete().eq("id", updateId);
  revalidateCase(caseId);
}
