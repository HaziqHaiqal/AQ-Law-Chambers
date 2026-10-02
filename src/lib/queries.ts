import type { ThreadComment } from "@/components/Lists/CommentThread";
import { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export async function getNotifications(supabase: Supabase) {
  const { data } = await supabase
    .from("notifications")
    .select("id, title, link, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function getThreads(supabase: Supabase, documentIds: number[]) {
  if (documentIds.length === 0) return {};
  const { data } = await supabase
    .from("document_comments")
    .select(
      "id, document_id, body, is_pinned, created_at, author:profiles!document_comments_author_id_fkey(id, full_name, role)",
    )
    .in("document_id", documentIds)
    .order("created_at");

  const threads: Record<number, ThreadComment[]> = {};
  for (const { document_id, ...comment } of data ?? []) {
    (threads[document_id] ??= []).push(comment);
  }
  return threads;
}
