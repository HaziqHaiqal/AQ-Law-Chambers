"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { asEnum, type FormState } from "@/lib/actions/admin/shared";
import { fromDateTimeInput } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { field } from "@/lib/validation/forms";

function revalidateTasks(caseId: number | null) {
  revalidatePath("/admin", "layout");
  if (caseId) revalidatePath(`/admin/cases/${caseId}`);
}

export async function createTask(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("admin");
  const fieldErrors: FormState["fieldErrors"] = {};
  const title = field(formData, "title");
  const details = field(formData, "details");
  const assignedTo = field(formData, "assigned_to");
  const caseIdRaw = field(formData, "case_id");
  const dueRaw = field(formData, "due_at");
  const dueAt = fromDateTimeInput(dueRaw);
  const caseId = caseIdRaw ? Number(caseIdRaw) : null;

  if (!title)
    fieldErrors.title =
      "Describe the task, e.g. Draft the Certificate of Urgency";
  else if (title.length > 200)
    fieldErrors.title = "Keep the task under 200 characters";
  if (details.length > 2000)
    fieldErrors.details = "Keep the details under 2,000 characters";
  if (!assignedTo) fieldErrors.assigned_to = "Choose a partner";
  if (dueRaw && !dueAt) fieldErrors.due_at = "Enter a valid date and time";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    title,
    details: details || null,
    assigned_to: assignedTo,
    case_id: caseId,
    due_at: dueAt,
  });
  if (error)
    return { error: "The task couldn't be created. Please try again." };

  revalidateTasks(caseId);
  return { success: "Task assigned.", savedAt: Date.now() };
}

export async function setTaskStatus(
  taskId: number,
  caseId: number | null,
  status: string,
) {
  await requireRole("admin");
  const next = asEnum("task_status", status);
  if (!next) return;
  const supabase = await createClient();
  await supabase.from("tasks").update({ status: next }).eq("id", taskId);
  revalidateTasks(caseId);
}

export async function deleteTask(taskId: number, caseId: number | null) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", taskId);
  revalidateTasks(caseId);
}
