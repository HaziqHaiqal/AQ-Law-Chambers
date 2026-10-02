"use client";

import { useState, useTransition } from "react";
import { deleteDocument } from "@/lib/actions/admin/documents";
import { PublishToggle } from "@/components/Buttons/PublishToggle";
import {
  CommentThread,
  type ThreadComment,
} from "@/components/Lists/CommentThread";
import {
  Check,
  Download,
  FileText,
  Lock,
  MessageSquare,
} from "@/components/Icons";
import { EmptyState } from "@/components/Status/EmptyState";
import {
  documentCategoryLabels,
  formatDate,
  formatDateTime,
  formatFileSize,
} from "@/lib/format";
import { Constants, type Tables } from "@/lib/supabase/database.types";

export type ManagedDocument = Pick<
  Tables<"documents">,
  | "id"
  | "title"
  | "category"
  | "exhibit_label"
  | "file_name"
  | "size_bytes"
  | "is_published"
  | "published_at"
  | "created_at"
> & { uploader: { full_name: string } | null };

export type Receipt = { name: string; at: string };

const iconButton =
  "inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate transition-colors hover:bg-mist hover:text-navy";

export function ManagedDocumentList({
  caseId,
  documents,
  threads,
  receipts,
  viewerId,
  openDocumentId,
}: {
  caseId: number;
  documents: ManagedDocument[];
  threads: Record<number, ThreadComment[]>;
  receipts: Record<number, Receipt[]>;
  viewerId: string;
  openDocumentId?: number;
}) {
  const [open, setOpen] = useState<number | null>(openDocumentId ?? null);
  const [pending, startTransition] = useTransition();

  if (documents.length === 0)
    return (
      <EmptyState title="No documents yet">
        Upload the first file using the Internal File Drop above.
      </EmptyState>
    );

  return (
    <div className="grid gap-6">
      {Constants.public.Enums.document_category.map((category) => {
        const group = documents.filter((doc) => doc.category === category);
        if (group.length === 0) return null;
        return (
          <section key={category} aria-label={documentCategoryLabels[category]}>
            <h3 className="mb-2 flex items-center gap-2 text-xs font-medium text-slate">
              {category === "internal" && <Lock className="size-3.5" />}
              {documentCategoryLabels[category]}
              <span className="rounded-full bg-mist px-1.5 py-0.5 tabular-nums">
                {group.length}
              </span>
            </h3>
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
              {group.map((doc) => {
                const thread = threads[doc.id] ?? [];
                const downloads = receipts[doc.id] ?? [];
                const isOpen = open === doc.id;
                return (
                  <li
                    key={doc.id}
                    id={`document-${doc.id}`}
                    className="bg-white"
                  >
                    <div className="flex flex-wrap items-start gap-x-4 gap-y-3 p-4">
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
                          {formatFileSize(doc.size_bytes)} · uploaded{" "}
                          {formatDate(doc.created_at)}
                          {doc.uploader && ` by ${doc.uploader.full_name}`}
                        </p>
                        {doc.is_published && (
                          <p className="mt-1.5 text-xs">
                            {downloads.length ? (
                              <span className="inline-flex items-center gap-1 text-gold-ink">
                                <Check className="size-3.5" strokeWidth={2.5} />
                                Downloaded by {downloads[0].name} ·{" "}
                                {formatDateTime(downloads[0].at)}
                                {downloads.length > 1 &&
                                  ` (${downloads.length}×)`}
                              </span>
                            ) : (
                              <span className="text-[#8a5a12]">
                                Not downloaded yet
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <PublishToggle
                        documentId={doc.id}
                        caseId={caseId}
                        title={doc.title}
                        published={doc.is_published}
                        disabled={doc.category === "internal"}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 border-t border-line bg-mist/40 px-3 py-1.5">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : doc.id)}
                        className={iconButton}
                      >
                        <MessageSquare className="size-3.5" />
                        {isOpen
                          ? "Hide comments"
                          : `Comments (${thread.length})`}
                      </button>
                      <a
                        href={`/api/documents/${doc.id}/download`}
                        className={iconButton}
                      >
                        <Download className="size-3.5" />
                        Download
                      </a>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (
                            confirm(
                              `Delete “${doc.title}”? The file and its thread will be removed.`,
                            )
                          )
                            startTransition(() =>
                              deleteDocument(doc.id, caseId),
                            );
                        }}
                        className={`${iconButton} ml-auto hover:bg-[#b4372c]/5 hover:text-[#b4372c]`}
                      >
                        Delete
                      </button>
                    </div>
                    {isOpen && (
                      <div className="border-t border-line p-4">
                        <CommentThread
                          documentId={doc.id}
                          caseId={caseId}
                          comments={thread}
                          viewerId={viewerId}
                          isPartner
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
