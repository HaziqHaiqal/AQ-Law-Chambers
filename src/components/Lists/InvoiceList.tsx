import type { ReactNode } from "react";
import { Download } from "@/components/Icons";
import { EmptyState } from "@/components/Status/EmptyState";
import { StatusBadge, type BadgeTone } from "@/components/Status/StatusBadge";
import { formatDate, formatMoney, invoiceStatusLabels } from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";

export type ListInvoice = Pick<
  Tables<"invoices">,
  | "id"
  | "invoice_number"
  | "description"
  | "issued_on"
  | "due_on"
  | "tax_amount"
  | "total"
  | "currency"
  | "status"
  | "paid_at"
  | "file_path"
>;

const tone: Record<ListInvoice["status"], BadgeTone> = {
  draft: "muted",
  issued: "pending",
  paid: "active",
  void: "muted",
};

export function InvoiceList({
  invoices,
  renderActions,
  emptyText = "No invoices have been issued for this case.",
}: {
  invoices: ListInvoice[];
  renderActions?: (invoice: ListInvoice) => ReactNode;
  emptyText?: string;
}) {
  if (invoices.length === 0) return <EmptyState>{emptyText}</EmptyState>;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <ul className="divide-y divide-line">
      {invoices.map((invoice) => {
        const overdue =
          invoice.status === "issued" &&
          invoice.due_on !== null &&
          invoice.due_on < today;
        return (
          <li
            key={invoice.id}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 sm:px-6"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{invoice.invoice_number}</p>
                <StatusBadge tone={overdue ? "danger" : tone[invoice.status]}>
                  {overdue ? "Overdue" : invoiceStatusLabels[invoice.status]}
                </StatusBadge>
              </div>
              <p className="mt-1 text-[13px] text-slate">
                {invoice.description}
              </p>
              <p className="mt-0.5 text-xs text-slate">
                {invoice.issued_on
                  ? `Issued ${formatDate(invoice.issued_on)}`
                  : "Draft"}
                {invoice.due_on && ` · Due ${formatDate(invoice.due_on)}`}
                {invoice.paid_at && ` · Paid ${formatDate(invoice.paid_at)}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold tabular-nums">
                {formatMoney(Number(invoice.total), invoice.currency)}
              </p>
              <p className="text-xs text-slate">
                incl. SST{" "}
                {formatMoney(Number(invoice.tax_amount), invoice.currency)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {invoice.file_path && (
                <a
                  href={`/api/invoices/${invoice.id}/download`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] font-medium text-navy hover:bg-mist"
                >
                  <Download className="size-4" />
                  PDF
                  <span className="sr-only">
                    {" "}
                    of invoice {invoice.invoice_number}
                  </span>
                </a>
              )}
              {renderActions?.(invoice)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
