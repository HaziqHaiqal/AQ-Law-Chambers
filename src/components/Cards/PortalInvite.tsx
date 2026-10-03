import { SignUpLinkShare } from "@/components/Buttons/SignUpLinkShare";
import { initials } from "@/lib/format";

export type PendingClient = {
  enquiryId: number;
  name: string;
  email: string;
  phone: string | null;
  invitedAt: string | null;
  invitedVia: string | null;
  signUpLink: string;
};

/** A client from an enquiry who has no account yet, with an optional invite. */
export function PortalInvite({
  client,
  partnerName,
}: {
  client: PendingClient;
  partnerName: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-dashed border-slate-light text-xs font-semibold text-slate">
        {initials(client.name)}
      </span>
      <div className="grid min-w-0 flex-1 gap-1">
        <p className="truncate text-sm font-medium">{client.name}</p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate">
          <span>No account</span>
          <span aria-hidden="true">·</span>
          <SignUpLinkShare
            enquiryId={client.enquiryId}
            name={client.name}
            email={client.email}
            phone={client.phone}
            link={client.signUpLink}
            message={`Hello ${client.name}, this is ${partnerName} from A&Q Law Chambers. We've opened your case. To follow its progress, documents and updates online, create your client account here:`}
            invitedAt={client.invitedAt}
            invitedVia={client.invitedVia}
          />
        </div>
      </div>
    </li>
  );
}
