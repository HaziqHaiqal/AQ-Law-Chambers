"use client";

import { useTransition } from "react";
import { addCaseMember, removeCaseMember } from "@/lib/actions/admin/cases";
import { Button } from "@/components/Buttons/Button";
import {
  PortalInvite,
  type PendingClient,
} from "@/components/Cards/PortalInvite";
import { formatDateTime, initials } from "@/lib/format";

type ClientOption = {
  id: string;
  full_name: string;
  email: string;
  organisation: string | null;
};

export function ClientAccessList({
  caseId,
  linked,
  available,
  pendingClients,
  partnerName,
}: {
  caseId: number;
  linked: (ClientOption & { last_sign_in_at: string | null })[];
  available: ClientOption[];
  pendingClients: PendingClient[];
  partnerName: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-4">
      {pendingClients.length > 0 && (
        <ul className="grid gap-4">
          {pendingClients.map((client) => (
            <PortalInvite
              key={client.enquiryId}
              client={client}
              partnerName={partnerName}
            />
          ))}
        </ul>
      )}
      {linked.length === 0 ? (
        pendingClients.length === 0 && (
          <p className="rounded-lg bg-gold/15 px-4 py-3 text-[13px] leading-relaxed text-navy">
            No client linked yet. The case stays hidden from clients until you
            link one.
          </p>
        )
      ) : (
        <ul className="grid gap-3">
          {linked.map((client) => (
            <li key={client.id} className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/20 text-xs font-semibold text-navy">
                {initials(client.organisation ?? client.full_name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {client.organisation ?? client.full_name}
                </p>
                <p className="truncate text-xs text-slate">
                  {client.last_sign_in_at
                    ? `Last login ${formatDateTime(client.last_sign_in_at)}`
                    : "Hasn't logged in yet"}
                </p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (
                    confirm(`Remove ${client.full_name}'s access to this case?`)
                  )
                    startTransition(() => removeCaseMember(caseId, client.id));
                }}
                className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate hover:bg-[#b4372c]/5 hover:text-[#b4372c]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {available.length > 0 && (
        <form action={addCaseMember.bind(null, caseId)} className="flex gap-2">
          <label className="sr-only" htmlFor="add-client">
            Link a client
          </label>
          <select
            id="add-client"
            name="client_id"
            defaultValue=""
            required
            className="field-input"
          >
            <option value="" disabled>
              Link a client…
            </option>
            {available.map((client) => (
              <option key={client.id} value={client.id}>
                {client.organisation ?? client.full_name} · {client.email}
              </option>
            ))}
          </select>
          <Button type="submit" variant="appSecondary" className="shrink-0">
            Link
          </Button>
        </form>
      )}
    </div>
  );
}
