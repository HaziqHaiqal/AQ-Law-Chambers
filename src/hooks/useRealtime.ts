"use client";

import { useEffect, useRef } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type RealtimeSubscription = {
  table: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
};

export function useRealtime(
  channelName: string,
  subscriptions: RealtimeSubscription[],
  onChange: (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
  ) => void,
) {
  const handler = useRef(onChange);
  useEffect(() => {
    handler.current = onChange;
  });

  const key = JSON.stringify(subscriptions);

  useEffect(() => {
    const supabase = createClient();
    const subs: RealtimeSubscription[] = JSON.parse(key);
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    supabase.realtime.setAuth().then(() => {
      if (cancelled) return;
      channel = supabase.channel(channelName);
      for (const sub of subs) {
        channel.on(
          "postgres_changes",
          {
            event: sub.event ?? "*",
            schema: "public",
            table: sub.table,
            filter: sub.filter,
          },
          (payload) => handler.current(payload),
        );
      }
      channel.subscribe();
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [channelName, key]);
}
