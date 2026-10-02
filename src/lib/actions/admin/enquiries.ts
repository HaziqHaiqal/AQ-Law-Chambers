"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { asEnum } from "@/lib/actions/admin/shared";
import { createClient } from "@/lib/supabase/server";

export async function setEnquiryStatus(enquiryId: number, status: string) {
  const profile = await requireRole("admin");
  const next = asEnum("enquiry_status", status);
  if (!next) return;
  const supabase = await createClient();
  await supabase
    .from("enquiries")
    .update({ status: next, handled_by: next === "new" ? null : profile.id })
    .eq("id", enquiryId);
  revalidatePath("/admin", "layout");
}
