"use client";

import { InvoiceActions } from "@/components/Buttons/InvoiceActions";
import { InvoiceList, type ListInvoice } from "@/components/Lists/InvoiceList";

export function ManagedInvoiceList({
  caseId,
  invoices,
}: {
  caseId: number;
  invoices: ListInvoice[];
}) {
  return (
    <InvoiceList
      invoices={invoices}
      emptyText="No invoices yet."
      renderActions={(invoice) => (
        <InvoiceActions invoice={invoice} caseId={caseId} />
      )}
    />
  );
}
