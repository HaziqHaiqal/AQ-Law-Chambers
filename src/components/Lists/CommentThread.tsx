"use client";

import { useTransition } from "react";
import { deleteComment, setCommentPinned } from "@/lib/actions/comments";
import { CommentForm } from "@/components/Forms/CommentForm";
import { Pin } from "@/components/Icons";
import { formatDateTime, initials } from "@/lib/format";

export type ThreadComment = {
  id: number;
  body: string;
  is_pinned: boolean;
  created_at: string;
  author: { id: string; full_name: string; role: "admin" | "client" } | null;
};

export function CommentThread({
  documentId,
  caseId,
  comments,
  viewerId,
  isPartner,
}: {
  documentId: number;
  caseId: number;
  comments: ThreadComment[];
  viewerId: string;
  isPartner: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const ordered = [...comments].sort(
    (a, b) =>
      Number(b.is_pinned) - Number(a.is_pinned) ||
      a.created_at.localeCompare(b.created_at),
  );

  return (
    <div className="grid gap-4 rounded-lg bg-mist p-4">
      {ordered.length > 0 && (
        <ol className="grid gap-3">
          {ordered.map((comment) => {
            const fromFirm = comment.author?.role === "admin";
            const mine = comment.author?.id === viewerId;
            return (
              <li
                key={comment.id}
                className={`rounded-lg bg-white p-3.5 ${comment.is_pinned ? "ring-1 ring-gold" : "ring-1 ring-line"}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                      fromFirm ? "bg-navy text-white" : "bg-gold/25 text-navy"
                    }`}
                  >
                    {initials(comment.author?.full_name ?? "?")}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[13px]">
                    <span className="font-medium">
                      {comment.author?.full_name ?? "Former user"}
                      {mine && " (you)"}
                    </span>
                    <span className="text-slate">
                      {" "}
                      · {formatDateTime(comment.created_at)}
                    </span>
                  </p>
                  {comment.is_pinned && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-gold-ink">
                      <Pin className="size-3.5" />
                      Pinned
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
                  {comment.body}
                </p>
                {isPartner && (
                  <div className="mt-2 flex gap-4 text-xs">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(() =>
                          setCommentPinned(
                            comment.id,
                            caseId,
                            !comment.is_pinned,
                          ),
                        )
                      }
                      className="font-medium text-slate hover:text-navy disabled:opacity-50"
                    >
                      {comment.is_pinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (
                          confirm("Delete this message? This can't be undone.")
                        )
                          startTransition(() =>
                            deleteComment(comment.id, caseId),
                          );
                      }}
                      className="font-medium text-slate hover:text-[#b4372c] disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
      <CommentForm
        documentId={documentId}
        caseId={caseId}
        isPartner={isPartner}
      />
    </div>
  );
}
