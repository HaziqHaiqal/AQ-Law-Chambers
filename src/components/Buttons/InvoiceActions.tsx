"use client";

import { useTransition } from "react";
import {
  deleteDraftInvoice,
  setInvoiceStatus,
} from "@/lib/actions/admin/invoices";
import { Button } from "@/components/Buttons/Button";
import type { ListInvoice } from "@/components/Lists/InvoiceList";

export function InvoiceActions({
  invoice,
  caseId,
}: {
  invoice: ListInvoice;
  caseId: number;
}) {
  const [pending, startTransition] = useTransition();
  const run = (action: () => Promise<void>) => startTransition(action);

  if (invoice.status === "draft")
    return (
      <>
        <Button
          variant="appPrimary"
          className="min-h-9"
          disabled={pending}
          onClick={() =>
            run(() => setInvoiceStatus(invoice.id, caseId, "issued"))
          }
        >
          Issue
        </Button>
        <Button
          variant="appGhost"
          className="min-h-9"
          disabled={pending}
          onClick={() =>
            confirm("Delete this draft invoice?") &&
            run(() => deleteDraftInvoice(invoice.id, caseId))
          }
        >
          Delete
        </Button>
      </>
    );

  if (invoice.status === "issued")
    return (
      <>
        <Button
          variant="appPrimary"
          className="min-h-9"
          disabled={pending}
          onClick={() =>
            run(() => setInvoiceStatus(invoice.id, caseId, "paid"))
          }
        >
          Mark paid
        </Button>
        <Button
          variant="appGhost"
          className="min-h-9"
          disabled={pending}
          onClick={() =>
            confirm(
              "Void this invoice? The client will still see it, marked void.",
            ) && run(() => setInvoiceStatus(invoice.id, caseId, "void"))
          }
        >
          Void
        </Button>
      </>
    );

  return null;
}
