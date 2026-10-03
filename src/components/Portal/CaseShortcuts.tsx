import Link from "next/link";
import { ArrowRight, FileText, Receipt, Clock } from "@/components/Icons";

function caseHref(path: string, caseId: number) {
  return `${path}?case=${caseId}`;
}

export function CaseShortcuts({
  caseId,
  documentCount,
  updateCount,
  invoiceCount,
}: {
  caseId: number;
  documentCount: number;
  updateCount: number;
  invoiceCount: number;
}) {
  const items = [
    {
      title: "Documents",
      description: `${documentCount} shared ${documentCount === 1 ? "file" : "files"}`,
      href: caseHref("/portal/documents", caseId),
      icon: FileText,
    },
    {
      title: "Case activity",
      description: `${updateCount} ${updateCount === 1 ? "update" : "updates"}`,
      href: caseHref("/portal/action-log", caseId),
      icon: Clock,
    },
    {
      title: "Invoices",
      description: `${invoiceCount} ${invoiceCount === 1 ? "invoice" : "invoices"}`,
      href: caseHref("/portal/invoices", caseId),
      icon: Receipt,
    },
  ];

  return (
    <section aria-labelledby="case-shortcuts-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-gold-ink uppercase">
            Your case
          </p>
          <h2
            id="case-shortcuts-title"
            className="mt-1 text-base font-semibold"
          >
            Quick access
          </h2>
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ title, description, href, icon: Icon }) => (
          <li key={title}>
            <Link
              href={href}
              className="group flex h-full min-h-[94px] items-center gap-3 rounded-xl border border-line bg-white px-4 py-4 shadow-[0_1px_2px_rgb(10_25_47/4%)] transition-colors hover:border-navy/25 hover:bg-white"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-gold-ink">
                <Icon className="size-[19px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="mt-0.5 block text-xs text-slate">
                  {description}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-slate-light transition-transform group-hover:translate-x-0.5 group-hover:text-gold-ink" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
