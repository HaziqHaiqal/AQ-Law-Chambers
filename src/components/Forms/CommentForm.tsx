"use client";

import { useActionState } from "react";
import { postComment, type CommentFormState } from "@/lib/actions/comments";
import { FieldError } from "@/components/Forms/FieldError";
import { SubmitButton } from "@/components/Forms/SubmitButton";

export function CommentForm({
  documentId,
  caseId,
  isPartner,
}: {
  documentId: number;
  caseId: number;
  isPartner: boolean;
}) {
  const [state, action] = useActionState<CommentFormState, FormData>(
    postComment,
    {},
  );
  const errorId = `comment-error-${documentId}`;

  return (
    <form key={state.sentAt} action={action} className="grid gap-3">
      <input type="hidden" name="document_id" value={documentId} />
      <input type="hidden" name="case_id" value={caseId} />
      <label className="grid">
        <span className="sr-only">Your message</span>
        <textarea
          name="body"
          rows={2}
          required
          maxLength={4000}
          placeholder={
            isPartner
              ? "Write a comment for the client about this document…"
              : "Reply to the firm about this document…"
          }
          aria-describedby={state.error ? errorId : undefined}
          className="field-input resize-y"
        />
      </label>
      <FieldError id={errorId}>{state.error}</FieldError>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {isPartner ? (
          <label className="flex items-center gap-2 text-[13px] text-slate">
            <input
              type="checkbox"
              name="pin"
              className="size-4 rounded accent-navy"
            />
            Pin this comment
          </label>
        ) : (
          <span className="text-xs text-slate">
            Only you and the firm can see these comments.
          </span>
        )}
        <SubmitButton pendingLabel="Sending…">
          {isPartner ? "Post comment" : "Send reply"}
        </SubmitButton>
      </div>
    </form>
  );
}
