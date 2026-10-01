"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-MY", {
  timeZone: "Asia/Kuala_Lumpur",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

/** Current time in Shah Alam, e.g. "11:24 pm". Null during server render. */
function useMalaysiaTime() {
  return useSyncExternalStore(
    subscribe,
    () => formatter.format(new Date()).toLowerCase(),
    () => null,
  );
}

/** "Open now · 11:24 pm in Shah Alam" — reinforces that the hotline is staffed around the clock. */
export function HotlineStatus({ tone = "light" }: { tone?: "light" | "dark" }) {
  const time = useMalaysiaTime();
  return (
    <p
      className={`flex items-center gap-2.5 text-[13px] ${tone === "light" ? "text-slate-light" : "text-slate"}`}
    >
      <span
        aria-hidden="true"
        className="live-dot size-2 shrink-0 rounded-full bg-gold"
      />
      <span>
        <span className={tone === "light" ? "text-white" : "text-navy"}>
          Open now
        </span>
        {time && <> · {time} in Shah Alam</>}
      </span>
    </p>
  );
}
