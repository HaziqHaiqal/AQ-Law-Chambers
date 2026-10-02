import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/Cards/SectionCard";
import { ChangePasswordForm } from "@/components/Forms/ChangePasswordForm";
import { ProfileForm } from "@/components/Forms/ProfileForm";
import { PageHeading } from "@/components/Typography/PageHeading";
import { getCurrentProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data: consents } = await supabase
    .from("privacy_consents")
    .select("notice_version, consented_at, withdrawn_at")
    .eq("user_id", profile.id)
    .order("consented_at", { ascending: false });

  return (
    <div className="max-w-3xl">
      <PageHeading title="Account">
        {profile.last_sign_in_at &&
          `Last signed in ${formatDateTime(profile.last_sign_in_at)}`}
      </PageHeading>
      <div className="grid gap-6">
        <SectionCard title="Personal Details">
          <ProfileForm profile={profile} />
        </SectionCard>
        <SectionCard
          title="Password"
          description="Passwords are stored as one-way hashes, so nobody at the firm can see yours."
        >
          <ChangePasswordForm />
        </SectionCard>
        {profile.role === "client" && (
          <SectionCard title="Privacy Consent">
            <p className="text-sm leading-relaxed text-slate">
              {consents?.length
                ? consents.map((consent) => (
                    <span key={consent.notice_version} className="block">
                      You agreed to Privacy Notice v{consent.notice_version} on{" "}
                      {formatDateTime(consent.consented_at)}
                      {consent.withdrawn_at &&
                        ` (withdrawn ${formatDateTime(consent.withdrawn_at)})`}
                      .
                    </span>
                  ))
                : "No consent on record."}
            </p>
            <p className="mt-3 text-sm text-slate">
              Read the{" "}
              <Link
                href="/privacy"
                className="font-medium text-navy underline underline-offset-2"
              >
                Privacy Notice
              </Link>
              . To withdraw consent or request a copy of your data, contact the
              firm.
            </p>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
