"use client";

import { useState } from "react";
import { Button } from "@/components/Buttons/Button";
import { InvoiceForm } from "@/components/Forms/InvoiceForm";
import { Plus } from "@/components/Icons";

export function NewInvoiceButton({
  caseId,
  suggestedNumber,
}: {
  caseId: number;
  suggestedNumber: string;
}) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <Button variant="appSecondary" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New invoice
      </Button>
    );
  return (
    <div className="w-full rounded-xl border border-line bg-white p-5">
      <InvoiceForm
        caseId={caseId}
        suggestedNumber={suggestedNumber}
        onDone={() => setOpen(false)}
      />
    </div>
  );
}
