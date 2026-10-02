"use client";

import { useState, type FormEvent } from "react";
import { createInvoice } from "@/lib/actions/admin/invoices";
import { Button } from "@/components/Buttons/Button";
import { FieldError } from "@/components/Forms/FieldError";
import { FieldLabel } from "@/components/Forms/FieldLabel";
import { FormAlert } from "@/components/Forms/FormAlert";
import { TextField } from "@/components/Forms/TextField";
import { BusyLabel } from "@/components/Status/BusyLabel";
import { formatMoney } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

const SST_RATE = 0.08;

export function InvoiceForm({
  caseId,
  suggestedNumber,
  onDone,
}: {
  caseId: number;
  suggestedNumber: string;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, string>>
  >({});
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const file = data.get("file");
    setBusy(true);
    setError(null);
    setFieldErrors({});

    const supabase = createClient();
    let filePath: string | null = null;
    if (file instanceof File && file.size > 0) {
      if (file.type !== "application/pdf") {
        setBusy(false);
        return setFieldErrors({ file: "Attach the invoice as a PDF" });
      }
      filePath = `cases/${caseId}/invoices/${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("case-files")
        .upload(filePath, file, { contentType: "application/pdf" });
      if (uploadError) {
        setBusy(false);
        return setError("The PDF upload failed. Please try again.");
      }
    }

    const result = await createInvoice({
      caseId,
      invoiceNumber: String(data.get("invoice_number") ?? ""),
      description: String(data.get("description") ?? ""),
      amount,
      taxAmount: tax,
      issuedOn: String(data.get("issued_on") ?? ""),
      dueOn: String(data.get("due_on") ?? ""),
      issueNow: data.get("issue_now") === "on",
      filePath,
    });

    if (result.error || result.fieldErrors) {
      if (filePath)
        await supabase.storage.from("case-files").remove([filePath]);
      setError(result.error ?? "Please fix the highlighted fields.");
      setFieldErrors(result.fieldErrors ?? {});
      setBusy(false);
      return;
    }
    onDone();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormAlert>{error}</FormAlert>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Invoice number"
          name="invoice_number"
          defaultValue={suggestedNumber}
          maxLength={40}
          error={fieldErrors.invoice_number}
        />
        <TextField
          label="Description"
          name="description"
          maxLength={500}
          placeholder="e.g. Professional fees: urgent ex parte application"
          error={fieldErrors.description}
        />
        <TextField
          label="Amount before tax (RM)"
          name="amount"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="15000.00"
          error={fieldErrors.amount}
        />
        <div className="grid content-start gap-1.5">
          <label htmlFor="tax_amount">
            <FieldLabel>SST (RM)</FieldLabel>
          </label>
          <div className="flex gap-2">
            <input
              id="tax_amount"
              inputMode="decimal"
              value={tax}
              onChange={(event) => setTax(event.target.value)}
              placeholder="0.00"
              className="field-input"
            />
            <Button
              variant="appSecondary"
              className="shrink-0"
              onClick={() =>
                setTax(((Number(amount) || 0) * SST_RATE).toFixed(2))
              }
            >
              Add 8%
            </Button>
          </div>
          <FieldError id="tax-error">{fieldErrors.tax_amount}</FieldError>
        </div>
        <TextField
          label="Issue date"
          name="issued_on"
          type="date"
          optional
          error={fieldErrors.issued_on}
        />
        <TextField
          label="Due date"
          name="due_on"
          type="date"
          optional
          error={fieldErrors.due_on}
        />
        <label className="grid gap-1.5 sm:col-span-2">
          <FieldLabel optional>Invoice PDF</FieldLabel>
          <input
            type="file"
            name="file"
            accept="application/pdf"
            className="field-input py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-mist file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-navy"
          />
          <FieldError id="file-error">{fieldErrors.file}</FieldError>
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-mist px-4 py-3">
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            name="issue_now"
            className="size-4 rounded accent-navy"
          />
          Issue to the client now
        </label>
        <p className="text-sm">
          Total{" "}
          <strong className="tabular-nums">
            {formatMoney((Number(amount) || 0) + (Number(tax) || 0))}
          </strong>
        </p>
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="appPrimary" disabled={busy}>
          {busy ? <BusyLabel>Saving…</BusyLabel> : "Save invoice"}
        </Button>
        <Button variant="appGhost" onClick={onDone} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
