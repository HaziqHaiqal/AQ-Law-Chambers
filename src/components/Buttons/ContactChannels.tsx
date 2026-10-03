"use client";

import { useState, type ComponentType } from "react";
import { Check, Mail, MessageSquare, Phone } from "@/components/Icons";
import { mailtoLink, telLink, whatsappLink } from "@/lib/format";

export type Channel = "whatsapp" | "phone" | "email" | "link";

const pillClass =
  "inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-xs font-medium text-navy transition-colors hover:border-navy/30 hover:bg-mist";

/** WhatsApp, Call and Email links with the message already written. */
export function ContactChannels({
  email,
  phone,
  subject,
  message,
  call = false,
  copyLink,
  onUse,
}: {
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  call?: boolean;
  copyLink?: string;
  onUse: (channel: Channel) => void;
}) {
  const [copied, setCopied] = useState<"yes" | "failed" | null>(null);

  const links: {
    channel: Channel;
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
  }[] = [];
  if (phone)
    links.push({
      channel: "whatsapp",
      label: "WhatsApp",
      href: whatsappLink(phone, message),
      icon: MessageSquare,
    });
  if (phone && call)
    links.push({
      channel: "phone",
      label: "Call",
      href: telLink(phone),
      icon: Phone,
    });
  links.push({
    channel: "email",
    label: "Email",
    href: mailtoLink(email, subject, message),
    icon: Mail,
  });

  async function copy() {
    if (!copyLink) return;
    try {
      await navigator.clipboard.writeText(copyLink);
      setCopied("yes");
      onUse("link");
    } catch {
      setCopied("failed");
    }
  }

  return (
    <span className="grid justify-items-start gap-2">
      <span className="flex flex-wrap gap-2">
        {links.map(({ channel, label, href, icon: Icon }) => (
          <a
            key={channel}
            href={href}
            target={channel === "whatsapp" ? "_blank" : undefined}
            rel={channel === "whatsapp" ? "noreferrer" : undefined}
            onClick={() => onUse(channel)}
            className={pillClass}
          >
            <Icon className="size-3.5 text-slate" />
            {label}
            {channel === "whatsapp" && (
              <span className="sr-only"> (opens in a new tab)</span>
            )}
          </a>
        ))}
        {copyLink && (
          <button type="button" onClick={copy} className={pillClass}>
            {copied === "yes" && <Check className="size-3.5 text-gold-ink" />}
            {copied === "yes" ? "Copied" : "Copy link"}
          </button>
        )}
      </span>
      {copied === "failed" && copyLink && (
        <span className="text-xs break-all text-navy select-all">
          {copyLink}
        </span>
      )}
    </span>
  );
}
