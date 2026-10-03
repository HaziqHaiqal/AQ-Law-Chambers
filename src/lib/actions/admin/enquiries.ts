"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";

export type ContactMethod = "email" | "whatsapp" | "phone" | "other";
export type InviteMethod = "email" | "whatsapp" | "link";

async function updateEnquiry(
  enquiryId: number,
  changes: (partnerId: string) => TablesUpdate<"enquiries">,
  onlyIfNotContacted = false,
) {
  const profile = await requireRole("admin");
  const supabase = await createClient();
  let query = supabase
    .from("enquiries")
    .update(changes(profile.id))
    .eq("id", enquiryId);
  if (onlyIfNotContacted) query = query.is("contacted_at", null);
  await query;
  revalidatePath("/admin", "layout");
}

export async function logEnquiryContact(
  enquiryId: number,
  method: ContactMethod,
) {
  await updateEnquiry(
    enquiryId,
    (partnerId) => ({
      contacted_at: new Date().toISOString(),
      contact_method: method,
      handled_by: partnerId,
    }),
    true,
  );
}

export async function undoEnquiryContact(enquiryId: number) {
  await updateEnquiry(enquiryId, () => ({
    contacted_at: null,
    contact_method: null,
    handled_by: null,
  }));
}

export async function closeEnquiry(enquiryId: number) {
  await updateEnquiry(enquiryId, (partnerId) => ({
    status: "closed",
    outcome_at: new Date().toISOString(),
    handled_by: partnerId,
  }));
}

export async function reopenEnquiry(enquiryId: number) {
  await updateEnquiry(enquiryId, () => ({ status: "new", outcome_at: null }));
}

export async function logPortalInvite(enquiryId: number, method: InviteMethod) {
  await updateEnquiry(enquiryId, () => ({
    invited_at: new Date().toISOString(),
    invited_via: method,
  }));
}
