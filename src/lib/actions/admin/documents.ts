"use server";

import { requireRole } from "@/lib/auth";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_BYTES,
  asEnum,
  revalidateCase,
} from "@/lib/actions/admin/shared";
import { createClient } from "@/lib/supabase/server";

export async function recordDocument(input: {
  caseId: number;
  category: string;
  title: string;
  exhibitLabel: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  publish: boolean;
}): Promise<{ error?: string }> {
  await requireRole("admin");
  const category = asEnum("document_category", input.category);
  const title = input.title.trim();
  const exhibitLabel = input.exhibitLabel.trim();

  if (!category) return { error: "Choose a category." };
  if (!title || title.length > 200)
    return { error: "Give the document a title (up to 200 characters)." };
  if (exhibitLabel.length > 40)
    return { error: "Keep the exhibit label under 40 characters." };
  if (!input.storagePath.startsWith(`cases/${input.caseId}/documents/`))
    return { error: "Upload path is invalid." };
  if (input.sizeBytes <= 0 || input.sizeBytes > MAX_FILE_BYTES)
    return { error: "Files must be under 50 MB." };
  if (!ALLOWED_MIME_TYPES.includes(input.mimeType))
    return { error: "That file type isn't allowed." };

  const supabase = await createClient();
  const { error } = await supabase.from("documents").insert({
    case_id: input.caseId,
    category,
    title,
    exhibit_label: exhibitLabel || null,
    storage_path: input.storagePath,
    file_name: input.fileName.slice(0, 255),
    mime_type: input.mimeType,
    size_bytes: input.sizeBytes,
    is_published: category !== "internal" && input.publish,
  });
  if (error)
    return { error: "The document couldn't be saved. Please try again." };

  revalidateCase(input.caseId);
  return {};
}

export async function setDocumentPublished(
  documentId: number,
  caseId: number,
  publish: boolean,
) {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .update({ is_published: publish })
    .eq("id", documentId);
  revalidateCase(caseId);
  return { error: error ? "That change couldn't be saved." : undefined };
}

export async function deleteDocument(documentId: number, caseId: number) {
  await requireRole("admin");
  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .select("storage_path")
    .maybeSingle();
  if (doc) await supabase.storage.from("case-files").remove([doc.storage_path]);
  revalidateCase(caseId);
}
