import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SectionCard } from "@/components/Cards/SectionCard";
import { ArrowRight, Phone } from "@/components/Icons";
import { StatusBadge, caseStatusTone } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { firm } from "@/data/site";
import { getCurrentProfile } from "@/lib/auth";
import { caseStatusLabel, caseTitle, milestoneLabels } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Case Dashboard" };

const setupSteps = [
  {
    title: "Intake checks",
    body: "The firm reviews your details and runs its conflict checks.",
  },
  {
    title: "Case opened",
    body: "The firm opens your case file and links it to your account.",
  },
  {
    title: "You're connected",
    body: "Your timeline, documents and live updates appear here.",
  },
];

export default async function PortalHome() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data: cases } = await supabase
    .from("case_overview")
    .select("*")
    .order("opened_at", { ascending: false });

  if (cases?.length === 1 && cases[0].id)
    redirect(`/portal/cases/${cases[0].id}`);

  const firstName = profile?.full_name.split(" ")[0] ?? "";

  if (!cases?.length)
    return (
      <div className="max-w-3xl">
        <PageHeading eyebrow="Welcome" title={`Hello, ${firstName}`}>
          Thank you for creating your account.
        </PageHeading>
        <SectionCard
          title="Your case is being set up"
          description="You'll get a notification as soon as it's ready."
        >
          <ol className="grid gap-5 sm:grid-cols-3">
            {setupSteps.map((step, index) => (
              <li key={step.title} className="rounded-lg bg-mist p-4">
                <span
                  className={`grid size-8 place-items-center rounded-full text-sm font-semibold ${index === 0 ? "bg-navy text-white" : "bg-white text-slate ring-1 ring-line"}`}
                >
                  {index + 1}
                </span>
                <p className="mt-3 text-sm font-semibold">{step.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </SectionCard>
        <a
          href={`tel:${firm.hotlineTel}`}
          className="mt-6 flex items-center gap-4 rounded-xl bg-navy p-5 text-white transition-colors hover:bg-navy-2"
        >
          <span className="grid size-10 place-items-center rounded-lg bg-white/10 text-gold">
            <Phone className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-medium">
              Assets at risk right now?
            </span>
            <span className="block text-[13px] text-slate-light">
              Call the 24/7 Hotline on {firm.hotline}
            </span>
          </span>
        </a>
      </div>
    );

  return (
    <>
      <PageHeading eyebrow="Welcome" title={`Hello, ${firstName}`}>
        Choose a case to view its timeline, documents and updates.
      </PageHeading>
      <ul className="grid gap-4 md:grid-cols-2">
        {cases.map((item) => {
          const status = caseStatusLabel(item);
          return (
            <li key={item.id}>
              <Link
                href={`/portal/cases/${item.id}`}
                className="group flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-[0_1px_2px_rgb(10_25_47/4%)] transition-colors hover:border-navy/25"
              >
                <StatusBadge tone={caseStatusTone(status)}>
                  {status}
                </StatusBadge>
                <p className="mt-4 font-serif text-xl leading-snug">
                  {caseTitle(item.title)}
                </p>
                <p className="mt-1 text-sm text-slate">
                  {item.next_stage
                    ? `Next: ${milestoneLabels[item.next_stage]}`
                    : "All four stages complete"}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-ink">
                  View case
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
