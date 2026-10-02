"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { Close } from "@/components/Icons";

export function Modal({
  open,
  title,
  description,
  closeHref,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  closeHref: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="modal-title"
      onClose={() => router.replace(closeHref, { scroll: false })}
      className="m-auto max-h-[90dvh] w-[min(680px,calc(100vw-24px))] overflow-hidden rounded-2xl p-0 text-navy shadow-[0_24px_60px_rgb(10_25_47/25%)] backdrop:bg-navy/45 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 id="modal-title" className="font-serif text-2xl leading-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-slate">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="-mr-2 grid size-9 shrink-0 place-items-center rounded-lg text-slate hover:bg-mist hover:text-navy"
          >
            <Close className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </dialog>
  );
}
