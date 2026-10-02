"use server";

import { createClient } from "@/lib/supabase/server";

export async function markNotificationsRead(ids?: number[]) {
  const supabase = await createClient();
  let query = supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);
  if (ids?.length) query = query.in("id", ids);
  await query;
}
