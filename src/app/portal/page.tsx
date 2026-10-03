import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SectionCard } from "@/components/Cards/SectionCard";
import { ArrowRight, Check, Phone } from "@/components/Icons";
import { EmptyState } from "@/components/Status/EmptyState";
import { StatusBadge, caseStatusTone } from "@/components/Status/StatusBadge";
import { PageHeading } from "@/components/Typography/PageHeading";
import { firm } from "@/data/site";
import { getCurrentProfile } from "@/lib/auth";
import {
  caseTitle,
  clientCaseStatusLabel,
  clientMilestoneLabels,
  milestoneOrder,
} from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Overview" };

const setupSteps = [
  {
    title: "Tell us about your matter",
    body: "Send an enquiry so a partner knows what you need.",
  },
  {
    title: "A partner contacts you",
    body: "They discuss your matter with you and run the firm's conflict checks.",
  },
  {
    title: "Case opened",
    body: "Your timeline, documents and live updates appear here.",
  },
];

export default async function PortalHome({
  searchParams,
}: PageProps<"/portal">) {
  const { q: rawQuery } = await searchParams;
  const query = typeof rawQuery === "string" ? rawQuery.trim() : "";
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const [{ data: cases }, { count: enquiriesSent }] = await Promise.all([
    supabase
      .from("case_overview")
      .select("*")
      .order("opened_at", { ascending: false }),
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
  ]);

  const clientCases = (cases ?? []).flatMap((item) =>
    item.id === null ? [] : [{ ...item, id: item.id }],
  );
  const matchingCases = query
    ? clientCases.filter((item) =>
        caseTitle(item.title)
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()),
      )
    : clientCases;
  const firstName = profile?.full_name.split(" ")[0] ?? "";

  const currentStep = enquiriesSent ? 1 : 0;

  if (!clientCases.length)
    return (
      <div className="max-w-3xl">
        <PageHeading eyebrow="My account" title={`Hello, ${firstName}`}>
          {enquiriesSent
            ? "Review your enquiries or send the firm more information."
            : "Your account is ready. Start by telling us how the firm can help."}
        </PageHeading>
        <SectionCard
          title="Getting started"
          description="Here’s what happens after you contact the firm."
        >
          <ol className="grid gap-5 sm:grid-cols-3">
            {setupSteps.map((step, index) => (
              <li
                key={step.title}
                aria-current={index === currentStep ? "step" : undefined}
                className="flex flex-col items-start rounded-lg bg-mist p-4"
              >
                <span
                  className={`grid size-8 place-items-center rounded-full text-sm font-semibold ${
                    index < currentStep
                      ? "bg-gold text-navy"
                      : index === currentStep
                        ? "bg-navy text-white"
                        : "bg-white text-slate ring-1 ring-line"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="size-4" strokeWidth={2.25} />
                  ) : (
                    index + 1
                  )}
                </span>
                <p className="mt-3 text-sm font-semibold">{step.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate">
                  {step.body}
                </p>
                {index === 0 && (
                  <Link
                    href="/portal/enquiries"
                    className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-navy px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-navy-3"
                  >
                    {enquiriesSent ? "View your enquiries" : "Send an enquiry"}
                    <ArrowRight className="size-4" />
                  </Link>
                )}
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

  // One case: its own page is the overview, so skip the extra click.
  if (clientCases.length === 1) redirect(`/portal/cases/${clientCases[0].id}`);

  return (
    <>
      <PageHeading eyebrow="My account" title={`Hello, ${firstName}`}>
        You have {clientCases.length} cases with the firm. Choose one to see its
        progress, documents and updates.
      </PageHeading>
      <form
        action="/portal"
        method="get"
        role="search"
        className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-3 sm:px-4"
      >
        <label htmlFor="case-search" className="sr-only">
          Search cases
        </label>
        <input
          id="case-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search cases by name"
          className="min-h-10 min-w-0 flex-1 rounded-lg border border-line px-3 text-[13px] outline-none placeholder:text-slate-light focus:border-gold-ink focus:ring-2 focus:ring-gold/25 sm:max-w-sm"
        />
        <button
          type="submit"
          className="inline-flex min-h-10 items-center rounded-lg bg-navy px-4 text-[13px] font-medium text-white transition-colors hover:bg-navy-3"
        >
          Search
        </button>
        {query && (
          <Link
            href="/portal"
            className="text-[13px] font-medium text-gold-ink hover:text-navy"
          >
            Clear
          </Link>
        )}
        <span className="text-xs text-slate sm:ml-auto">
          {matchingCases.length} of {clientCases.length} cases
        </span>
      </form>
      {matchingCases.length === 0 ? (
        <EmptyState title="No matching cases">
          Try another case name or clear your search.
        </EmptyState>
      ) : (
        <SectionCard flush className="overflow-hidden">
          <ul className="divide-y divide-line">
            {matchingCases.map((item) => {
              const status = clientCaseStatusLabel(item);
              const progress =
                item.status === "closed"
                  ? "Case closed"
                  : item.next_stage
                    ? `Next step: ${clientMilestoneLabels[item.next_stage]} (stage ${milestoneOrder.indexOf(item.next_stage) + 1} of ${milestoneOrder.length})`
                    : item.last_completed_stage
                      ? "All four stages complete"
                      : "Timeline being prepared";
              return (
                <li key={item.id}>
                  <Link
                    href={`/portal/cases/${item.id}`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-mist/60 sm:px-6"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-serif text-lg leading-snug">
                          {caseTitle(item.title)}
                        </span>
                        <StatusBadge tone={caseStatusTone(status)}>
                          {status}
                        </StatusBadge>
                      </span>
                      <span className="mt-1 block text-[13px] text-slate">
                        {progress}
                        {item.court_reference &&
                          ` · Suit no. ${item.court_reference}`}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-slate-light transition-transform group-hover:translate-x-0.5 group-hover:text-gold-ink" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </>
  );
}
