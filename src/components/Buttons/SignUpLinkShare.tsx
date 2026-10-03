"use client";

import { useState, useTransition } from "react";
import { ContactChannels } from "@/components/Buttons/ContactChannels";
import { logPortalInvite } from "@/lib/actions/admin/enquiries";
import { formatDate } from "@/lib/format";

const viaLabels: Record<string, string> = {
  email: "by email",
  whatsapp: "by WhatsApp",
  link: "(link copied)",
};

const linkClass = "font-medium text-gold-ink hover:underline";

/** Sends someone without an account a link to create one, and shows when it was sent. */
export function SignUpLinkShare({
  enquiryId,
  name,
  email,
  phone,
  link,
  message,
  invitedAt,
  invitedVia,
}: {
  enquiryId: number;
  name: string;
  email: string;
  phone: string | null;
  link: string;
  message: string;
  invitedAt: string | null;
  invitedVia: string | null;
}) {
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  if (!open)
    return (
      <p className="text-xs leading-relaxed text-slate">
        {invitedAt && (
          <>
            Sign-up link sent {formatDate(invitedAt)}{" "}
            {viaLabels[invitedVia ?? ""]}
            {" · "}
          </>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={linkClass}
        >
          {invitedAt ? "Send again" : "Send sign-up link"}
        </button>
      </p>
    );

  return (
    <div className="grid justify-items-start gap-2 text-xs text-slate">
      <p>Send {name.split(" ")[0]} a link to create their account:</p>
      <ContactChannels
        email={email}
        phone={phone}
        subject="Create your A&Q Law Chambers client account"
        message={`${message} ${link}`}
        copyLink={link}
        onUse={(channel) => {
          setOpen(false);
          startTransition(() =>
            logPortalInvite(enquiryId, channel === "phone" ? "link" : channel),
          );
        }}
      />
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="font-medium hover:text-navy"
      >
        Cancel
      </button>
    </div>
  );
}
