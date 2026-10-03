import type { Metadata } from "next";
import { SectionCard } from "@/components/Cards/SectionCard";
import { PortalEnquiryForm } from "@/components/Forms/PortalEnquiryForm";
import { ClientEnquiryList } from "@/components/Lists/ClientEnquiryList";
import { PageHeading } from "@/components/Typography/PageHeading";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Contact the firm" };

export default async function PortalEnquiriesPage() {
  const profile = await requireRole("client");
  const supabase = await createClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, topic, message, status, created_at, is_urgent, source")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeading eyebrow="My account" title="Contact the firm">
        Send a question or tell the firm about a new matter. You can check the
        status of earlier enquiries below.
      </PageHeading>
      <div className="grid gap-6">
        <SectionCard
          title="Send an enquiry"
          description="A lawyer will reply using the contact details on your account."
        >
          <PortalEnquiryForm email={profile.email} phone={profile.phone} />
        </SectionCard>
        <SectionCard
          title={`Enquiry history${enquiries?.length ? ` · ${enquiries.length}` : ""}`}
          flush
        >
          <div className="border-t border-line">
            <ClientEnquiryList enquiries={enquiries ?? []} />
          </div>
        </SectionCard>
      </div>
    </>
  );
}
