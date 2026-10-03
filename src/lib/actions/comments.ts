"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { field } from "@/lib/validation/forms";

export type CommentFormState = { error?: string; sentAt?: number };

function revalidateCase(caseId: number) {
  revalidatePath("/portal", "layout");
  revalidatePath(`/admin/cases/${caseId}`);
}

export async function postComment(
  _prev: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const documentId = Number(field(formData, "document_id"));
  const caseId = Number(field(formData, "case_id"));
  const body = field(formData, "body");
  const pin = profile.role === "admin" && formData.get("pin") === "on";

  if (!body) return { error: "Write a message first." };
  if (body.length > 4000)
    return { error: "Messages can be up to 4,000 characters." };

  const supabase = await createClient();
  const { error } = await supabase.from("document_comments").insert({
    document_id: documentId,
    author_id: profile.id,
    body,
    is_pinned: pin,
  });
  if (error)
    return { error: "Your message couldn't be sent. Please try again." };

  revalidateCase(caseId);
  return { sentAt: Date.now() };
}

export async function setCommentPinned(
  commentId: number,
  caseId: number,
  pinned: boolean,
) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase
    .from("document_comments")
    .update({ is_pinned: pinned })
    .eq("id", commentId);
  revalidateCase(caseId);
}

export async function deleteComment(commentId: number, caseId: number) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("document_comments").delete().eq("id", commentId);
  revalidateCase(caseId);
}
