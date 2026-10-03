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

/** The signed-in client's cases, newest first. */
export async function getClientCases(supabase: Supabase) {
  const { data } = await supabase
    .from("case_overview")
    .select("id, title")
    .order("opened_at", { ascending: false });
  return (data ?? []).flatMap((c) =>
    c.id === null ? [] : [{ id: c.id, title: c.title }],
  );
}

/** Resolve an optional case query parameter against cases visible to this client. */
export function getSelectedClientCase<T extends { id: number }>(
  cases: T[],
  value: string | string[] | undefined,
) {
  if (value === undefined) return null;
  if (Array.isArray(value) || !/^\d+$/.test(value)) return undefined;
  const id = Number(value);
  if (!Number.isSafeInteger(id)) return undefined;
  return cases.find((item) => item.id === id);
}
