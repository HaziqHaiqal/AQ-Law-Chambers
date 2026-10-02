"use client";

import { useState, type DragEvent, type FormEvent } from "react";
import { recordDocument } from "@/lib/actions/admin/documents";
import { Button } from "@/components/Buttons/Button";
import { FieldLabel } from "@/components/Forms/FieldLabel";
import { FormAlert } from "@/components/Forms/FormAlert";
import { FileText, Upload } from "@/components/Icons";
import { BusyLabel } from "@/components/Status/BusyLabel";
import {
  documentCategoryHints,
  documentCategoryLabels,
  formatFileSize,
} from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { Constants, type Enums } from "@/lib/supabase/database.types";

const MAX_BYTES = 50 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg";
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
];

function safeFileName(name: string) {
  return name
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-120);
}

export function DocumentUploadForm({ caseId }: { caseId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [category, setCategory] = useState<Enums<"document_category">>(
    "emergency_cause_papers",
  );
  const [title, setTitle] = useState("");
  const [exhibit, setExhibit] = useState("");
  const [publish, setPublish] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    tone: "error" | "success";
    text: string;
  } | null>(null);
  const internal = category === "internal";

  function choose(next: File | undefined) {
    if (!next) return;
    if (!ALLOWED.includes(next.type))
      return setMessage({
        tone: "error",
        text: "That file type isn't allowed. Use PDF, Word, Excel, PNG or JPEG.",
      });
    if (next.size > MAX_BYTES)
      return setMessage({ tone: "error", text: "Files must be under 50 MB." });
    setMessage(null);
    setFile(next);
    if (!title)
      setTitle(next.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    choose(event.dataTransfer.files[0]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file)
      return setMessage({
        tone: "error",
        text: "Choose or drop a file first.",
      });
    if (!title.trim())
      return setMessage({ tone: "error", text: "Give the document a title." });

    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const path = `cases/${caseId}/documents/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from("case-files")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      setBusy(false);
      return setMessage({
        tone: "error",
        text: "The upload failed. Check your connection and try again.",
      });
    }

    const result = await recordDocument({
      caseId,
      category,
      title,
      exhibitLabel: exhibit,
      storagePath: path,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      publish: publish && !internal,
    });

    if (result.error) {
      await supabase.storage.from("case-files").remove([path]);
      setMessage({ tone: "error", text: result.error });
    } else {
      setMessage({
        tone: "success",
        text:
          publish && !internal
            ? `“${title}” is now in the client's repository.`
            : `“${title}” uploaded. It stays internal until you publish it.`,
      });
      setFile(null);
      setTitle("");
      setExhibit("");
      setPublish(false);
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:border-navy focus-within:ring-4 focus-within:ring-navy/10 ${
          dragging
            ? "border-gold bg-gold/10"
            : file
              ? "border-navy/30 bg-mist"
              : "border-line hover:border-navy/30 hover:bg-mist/60"
        }`}
      >
        <span
          className={`grid size-11 place-items-center rounded-full ${file ? "bg-navy text-white" : "bg-mist text-gold-ink"}`}
        >
          {file ? (
            <FileText className="size-5" />
          ) : (
            <Upload className="size-5" />
          )}
        </span>
        {file ? (
          <>
            <span className="text-sm font-medium">{file.name}</span>
            <span className="text-xs text-slate">
              {formatFileSize(file.size)} · click to choose another file
            </span>
          </>
        ) : (
          <>
            <span className="text-sm">
              <span className="font-medium text-navy">Click to upload</span> or
              drag and drop
            </span>
            <span className="text-xs text-slate">
              PDF, Word, Excel, PNG or JPEG · up to 50 MB
            </span>
          </>
        )}
        <input
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(event) => {
            choose(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>

      {file && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid content-start gap-1.5">
            <FieldLabel>Category</FieldLabel>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as Enums<"document_category">)
              }
              className="field-input"
            >
              {Constants.public.Enums.document_category.map((value) => (
                <option key={value} value={value}>
                  {documentCategoryLabels[value]}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate">
              {documentCategoryHints[category]}
            </span>
          </label>
          <label className="grid content-start gap-1.5">
            <FieldLabel optional>Exhibit label</FieldLabel>
            <input
              value={exhibit}
              onChange={(event) => setExhibit(event.target.value)}
              maxLength={40}
              placeholder="e.g. W-1"
              className="field-input"
            />
          </label>
          <label className="grid gap-1.5 sm:col-span-2">
            <FieldLabel required>Title</FieldLabel>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              placeholder="e.g. Affidavit in Support (Nur Afiqah binti Saidin)"
              className="field-input"
            />
          </label>
          <label
            className={`flex items-center gap-3 text-sm sm:col-span-2 ${internal ? "text-slate" : "text-navy"}`}
          >
            <input
              type="checkbox"
              checked={publish && !internal}
              disabled={internal}
              onChange={(event) => setPublish(event.target.checked)}
              className="size-4 rounded accent-navy"
            />
            {internal
              ? "Internal files can never be published to the client"
              : "Publish to Client Repository now"}
          </label>
        </div>
      )}

      {message && <FormAlert tone={message.tone}>{message.text}</FormAlert>}

      {file && (
        <div className="flex gap-2">
          <Button type="submit" variant="appPrimary" disabled={busy}>
            {busy ? <BusyLabel>Uploading…</BusyLabel> : "Upload document"}
          </Button>
          <Button
            type="button"
            variant="appGhost"
            disabled={busy}
            onClick={() => setFile(null)}
          >
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
}
