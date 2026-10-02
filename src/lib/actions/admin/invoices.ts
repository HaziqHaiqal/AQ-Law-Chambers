"use server";

import { requireRole } from "@/lib/auth";
import { asEnum, revalidateCase } from "@/lib/actions/admin/shared";
import { createClient } from "@/lib/supabase/server";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function createInvoice(input: {
  caseId: number;
  invoiceNumber: string;
  description: string;
  amount: string;
  taxAmount: string;
  issuedOn: string;
  dueOn: string;
  issueNow: boolean;
  filePath: string | null;
}): Promise<{ error?: string; fieldErrors?: Partial<Record<string, string>> }> {
  await requireRole("admin");
  const fieldErrors: Partial<Record<string, string>> = {};
  const invoiceNumber = input.invoiceNumber.trim();
  const description = input.description.trim();
  const amount = Number(input.amount);
  const taxAmount = input.taxAmount ? Number(input.taxAmount) : 0;

  if (!invoiceNumber || invoiceNumber.length > 40)
    fieldErrors.invoice_number =
      "Enter an invoice number (up to 40 characters)";
  if (!description || description.length > 500)
    fieldErrors.description = "Describe the invoice (up to 500 characters)";
  if (!input.amount || !Number.isFinite(amount) || amount < 0)
    fieldErrors.amount = "Enter the amount before tax, e.g. 15000.00";
  if (!Number.isFinite(taxAmount) || taxAmount < 0)
    fieldErrors.tax_amount = "Enter the SST amount, or 0";
  if (input.issuedOn && !DATE.test(input.issuedOn))
    fieldErrors.issued_on = "Enter a valid date";
  if (input.dueOn && !DATE.test(input.dueOn))
    fieldErrors.due_on = "Enter a valid date";
  if (input.issuedOn && input.dueOn && input.dueOn < input.issuedOn)
    fieldErrors.due_on = "The due date can't be before the issue date";
  if (
    input.filePath &&
    !input.filePath.startsWith(`cases/${input.caseId}/invoices/`)
  )
    return { error: "Upload path is invalid." };
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.from("invoices").insert({
    case_id: input.caseId,
    invoice_number: invoiceNumber,
    description,
    amount: Math.round(amount * 100) / 100,
    tax_amount: Math.round(taxAmount * 100) / 100,
    issued_on: input.issuedOn || null,
    due_on: input.dueOn || null,
    status: input.issueNow ? "issued" : "draft",
    file_path: input.filePath,
  });
  if (error) {
    if (error.code === "23505")
      return {
        fieldErrors: { invoice_number: "That invoice number is already used" },
      };
    return { error: "The invoice couldn't be saved. Please try again." };
  }

  revalidateCase(input.caseId);
  return {};
}

export async function setInvoiceStatus(
  invoiceId: number,
  caseId: number,
  status: string,
) {
  await requireRole("admin");
  const next = asEnum("invoice_status", status);
  if (!next) return;
  const supabase = await createClient();
  await supabase.from("invoices").update({ status: next }).eq("id", invoiceId);
  revalidateCase(caseId);
}

export async function deleteDraftInvoice(invoiceId: number, caseId: number) {
  await requireRole("admin");
  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("status", "draft")
    .select("file_path")
    .maybeSingle();
  if (invoice?.file_path)
    await supabase.storage.from("case-files").remove([invoice.file_path]);
  revalidateCase(caseId);
}
