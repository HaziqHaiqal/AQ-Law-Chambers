"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell } from "@/components/Icons";
import { useRealtime } from "@/hooks/useRealtime";
import { markNotificationsRead } from "@/lib/actions/notifications";
import { formatDateTime } from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

export type BellNotification = Pick<
  Tables<"notifications">,
  "id" | "title" | "link" | "read_at" | "created_at"
>;

export function NotificationBell({
  userId,
  initial,
}: {
  userId: string;
  initial: BellNotification[];
}) {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const unread = items.filter((item) => !item.read_at).length;

  useRealtime(
    `notifications:${userId}`,
    [
      {
        table: "notifications",
        event: "INSERT",
        filter: `recipient_id=eq.${userId}`,
      },
    ],
    (payload) => {
      const row = payload.new as BellNotification;
      setItems((current) =>
        [row, ...current.filter((item) => item.id !== row.id)].slice(0, 20),
      );
    },
  );

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function markRead(ids?: number[]) {
    const now = new Date().toISOString();
    setItems((current) =>
      current.map((item) =>
        !ids || ids.includes(item.id)
          ? { ...item, read_at: item.read_at ?? now }
          : item,
      ),
    );
    void markNotificationsRead(ids);
  }

  return (
    <div ref={container} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="notification-panel"
        aria-label={
          unread ? `Notifications, ${unread} unread` : "Notifications"
        }
        className="relative grid size-10 place-items-center rounded-lg text-navy transition-colors hover:bg-mist"
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 grid min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] leading-[18px] font-semibold text-navy ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      <div
        id="notification-panel"
        hidden={!open}
        className="absolute right-0 z-50 mt-2 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-xl border border-line bg-white shadow-[0_16px_40px_rgb(10_25_47/12%)]"
      >
        <div className="flex items-center justify-between px-4 py-3.5">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markRead()}
              className="text-xs font-medium text-gold-ink hover:text-navy"
            >
              Mark all as read
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <p className="px-4 pt-6 pb-10 text-center text-sm text-slate">
            You&rsquo;re all caught up.
          </p>
        ) : (
          <ul className="max-h-[420px] overflow-y-auto border-t border-line">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.link ?? "#"}
                  onClick={() => {
                    if (!item.read_at) markRead([item.id]);
                    setOpen(false);
                  }}
                  className={`flex gap-3 px-4 py-3 transition-colors hover:bg-mist ${item.read_at ? "" : "bg-gold/[0.06]"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${item.read_at ? "bg-transparent" : "bg-gold"}`}
                  />
                  <span className="grid min-w-0 gap-0.5">
                    <span
                      className={`text-[13px] leading-snug ${item.read_at ? "text-slate" : "font-medium text-navy"}`}
                    >
                      {item.title}
                      {!item.read_at && (
                        <span className="sr-only"> (unread)</span>
                      )}
                    </span>
                    <span className="text-xs text-slate">
                      {formatDateTime(item.created_at)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
