"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CommentThread,
  type ThreadComment,
} from "@/components/Lists/CommentThread";
import { Download, FileText, MessageSquare } from "@/components/Icons";
import { EmptyState } from "@/components/Status/EmptyState";
import {
  clientDocumentCategoryLabels,
  formatDate,
  formatFileSize,
  publishableCategories,
} from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

export type ClientDocument = Pick<
  Tables<"documents">,
  | "case_id"
  | "id"
  | "title"
  | "category"
  | "exhibit_label"
  | "file_name"
  | "size_bytes"
  | "published_at"
  | "created_at"
>;

export function ClientDocumentList({
  documents,
  threads,
  viewerId,
  openDocumentId,
  caseNames,
}: {
  documents: ClientDocument[];
  threads: Record<number, ThreadComment[]>;
  viewerId: string;
  openDocumentId?: number;
  caseNames?: Record<number, string>;
}) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<number | null>(openDocumentId ?? null);
  const visible =
    filter === "all"
      ? documents
      : documents.filter((d) => d.category === filter);
  const filters = [
    { value: "all", label: "All files", count: documents.length },
    ...publishableCategories.flatMap((category) => {
      const count = documents.filter((d) => d.category === category).length;
      return count
        ? [
            {
              value: category,
              label: clientDocumentCategoryLabels[category],
              count,
            },
          ]
        : [];
    }),
  ];

  return (
    <div>
      {filters.length > 2 && (
        <div
          role="group"
          aria-label="Filter documents by category"
          className="flex gap-2 overflow-x-auto px-5 pb-4 sm:px-6"
        >
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                filter === option.value
                  ? "bg-navy text-white"
                  : "bg-mist text-slate hover:text-navy"
              }`}
            >
              {option.label}
              <span
                className={`tabular-nums ${filter === option.value ? "text-gold" : "text-slate-light"}`}
              >
                {option.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="border-t border-line">
          <EmptyState
            title={
              documents.length ? "Nothing in this category" : "No documents yet"
            }
          >
            {documents.length ? undefined : (
              <>
                You&rsquo;ll be notified when the firm shares a file here. If
                you&rsquo;re expecting a document,{" "}
                <Link
                  href="/portal/enquiries"
                  className="font-medium text-gold-ink hover:text-navy"
                >
                  contact the firm
                </Link>
                .
              </>
            )}
          </EmptyState>
        </div>
      ) : (
        <ul className="border-t border-line">
          {visible.map((doc) => {
            const thread = threads[doc.id] ?? [];
            const isOpen = open === doc.id;
            const pinned = thread.some((c) => c.is_pinned);
            return (
              <li
                key={doc.id}
                id={`document-${doc.id}`}
                className="border-b border-line last:border-0"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:flex-nowrap sm:px-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-gold-ink">
                    <FileText className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug font-medium">
                      {doc.title}
                      {doc.exhibit_label && (
                        <span className="font-normal text-slate">
                          {" "}
                          · {doc.exhibit_label}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-slate">
                      {clientDocumentCategoryLabels[doc.category]} ·{" "}
                      {formatFileSize(doc.size_bytes)} · Published{" "}
                      {formatDate(doc.published_at ?? doc.created_at)}
                      {caseNames?.[doc.case_id] &&
                        ` · ${caseNames[doc.case_id]}`}
                    </p>
                  </div>
                  <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? `thread-${doc.id}` : undefined}
                      onClick={() => setOpen(isOpen ? null : doc.id)}
                      className={`inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors sm:flex-none ${
                        pinned && !isOpen
                          ? "bg-gold/20 text-navy"
                          : "text-slate hover:bg-mist hover:text-navy"
                      }`}
                    >
                      <MessageSquare className="size-4" />
                      {thread.length === 0
                        ? "Add comment"
                        : `${thread.length} ${thread.length === 1 ? "comment" : "comments"}`}
                      {pinned && !isOpen && (
                        <span className="sr-only"> (note from the firm)</span>
                      )}
                    </button>
                    <a
                      href={`/api/documents/${doc.id}/download`}
                      className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-navy px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-navy-3 sm:flex-none"
                    >
                      <Download className="size-4" />
                      Download
                      <span className="sr-only"> {doc.title}</span>
                    </a>
                  </div>
                </div>
                {isOpen && (
                  <div id={`thread-${doc.id}`} className="px-5 pb-5 sm:px-6">
                    <CommentThread
                      documentId={doc.id}
                      caseId={doc.case_id}
                      comments={thread}
                      viewerId={viewerId}
                      isPartner={false}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
