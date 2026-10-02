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

export async function setMilestoneCompleted(
  caseId: number,
  stage: string,
  completed: boolean,
) {
  await requireRole("admin");
  const milestone = asEnum("milestone_stage", stage);
  if (!milestone) return;
  const supabase = await createClient();
  await supabase
    .from("case_milestones")
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq("case_id", caseId)
    .eq("stage", milestone);
  revalidateCase(caseId);
}

export async function updateMilestoneDetails(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("admin");
  const caseId = Number(field(formData, "case_id"));
  const stage = asEnum("milestone_stage", field(formData, "stage"));
  const note = field(formData, "note");
  const scheduledRaw = field(formData, "scheduled_for");
  const scheduledFor = fromDateTimeInput(scheduledRaw);

  if (!stage) return { error: "Unknown stage." };
  if (scheduledRaw && !scheduledFor)
    return { error: "Enter a valid date and time." };
  if (note.length > 500)
    return { error: "Keep the note under 500 characters." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("case_milestones")
    .update({ scheduled_for: scheduledFor, note: note || null })
    .eq("case_id", caseId)
    .eq("stage", stage);
  if (error) return { error: "That couldn't be saved. Please try again." };

  revalidateCase(caseId);
  return { success: "Saved", savedAt: Date.now() };
}
