"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useRealtime, type RealtimeSubscription } from "@/hooks/useRealtime";

export function LiveIndicator({
  channel,
  subscriptions,
}: {
  channel: string;
  subscriptions: RealtimeSubscription[];
}) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useRealtime(channel, subscriptions, () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      router.refresh();
      setUpdatedAt(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 300);
  });

  return (
    <p
      className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs text-slate"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="live-dot size-2 rounded-full bg-gold"
      />
      {updatedAt ? `Live · updated ${updatedAt}` : "Live"}
    </p>
  );
}
