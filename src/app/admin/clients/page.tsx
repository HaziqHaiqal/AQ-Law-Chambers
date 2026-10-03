import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/Cards/SectionCard";
import { EmptyState } from "@/components/Status/EmptyState";
import { StatusBadge } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { caseTitle, formatDate, formatDateTime, initials } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const [{ data: clients }, { data: members }, { data: consents }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, full_name, email, phone, organisation, last_sign_in_at, created_at",
        )
        .eq("role", "client")
        .order("full_name"),
      supabase.from("case_members").select("client_id, case:cases(id, title)"),
      supabase
        .from("privacy_consents")
        .select("user_id, notice_version, consented_at"),
    ]);

  const casesByClient = new Map<
    string,
    { id: number; title: string | null }[]
  >();
  for (const member of members ?? []) {
    if (member.case)
      casesByClient.set(member.client_id, [
        ...(casesByClient.get(member.client_id) ?? []),
        member.case,
      ]);
  }
  const consentByClient = new Map((consents ?? []).map((c) => [c.user_id, c]));

  return (
    <>
      <PageHeading eyebrow="Firm management" title="Clients">
        Clients with an account, their cases and when they last logged in.
      </PageHeading>
      <SectionCard title={`${clients?.length ?? 0} client accounts`} flush>
        {!clients?.length ? (
          <EmptyState>No client accounts yet.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-y border-line bg-mist/70 text-xs text-slate">
                  <th scope="col" className="px-6 py-3 font-medium">
                    Client
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Contact
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Cases
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    PDPA Consent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {clients.map((client) => {
                  const cases = casesByClient.get(client.id) ?? [];
                  const consent = consentByClient.get(client.id);
                  const name = client.organisation ?? client.full_name;
                  return (
                    <tr key={client.id} className="align-top">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/20 text-xs font-semibold text-navy">
                            {initials(name)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-slate">
                              Joined {formatDate(client.created_at)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={`mailto:${client.email}`}
                          className="block hover:text-gold-ink"
                        >
                          {client.email}
                        </a>
                        {client.phone && (
                          <span className="text-xs text-slate">
                            {client.phone}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {cases.length ? (
                          <ul className="grid gap-1">
                            {cases.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={`/admin/cases/${item.id}`}
                                  className="hover:text-gold-ink hover:underline"
                                >
                                  {caseTitle(item.title)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Link href={`/admin/cases?new-case=${client.id}`}>
                            <StatusBadge tone="pending">
                              Pending intake · Create case
                            </StatusBadge>
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate">
                        {client.last_sign_in_at
                          ? formatDateTime(client.last_sign_in_at)
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate">
                        {consent
                          ? `v${consent.notice_version} · ${formatDate(consent.consented_at)}`
                          : "Not recorded"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </>
  );
}
