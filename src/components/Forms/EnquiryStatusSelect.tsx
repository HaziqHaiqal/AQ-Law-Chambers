"use client";

import { useTransition } from "react";
import { setEnquiryStatus } from "@/lib/actions/admin/enquiries";
import { enquiryStatusLabels } from "@/lib/format";
import { Constants, type Enums } from "@/lib/supabase/database.types";

export function EnquiryStatusSelect({
  id,
  status,
}: {
  id: number;
  status: Enums<"enquiry_status">;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <label className="grid content-start gap-1.5">
      <span className="sr-only">Status</span>
      <select
        value={status}
        disabled={pending}
        onChange={(event) =>
          startTransition(() => setEnquiryStatus(id, event.target.value))
        }
        className="field-input min-h-9 py-1.5"
      >
        {Constants.public.Enums.enquiry_status.map((value) => (
          <option key={value} value={value}>
            {enquiryStatusLabels[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
