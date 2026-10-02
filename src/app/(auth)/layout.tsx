import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/Brand/BrandMark";
import { Check, Lock, Phone } from "@/components/Icons";
import { firm } from "@/data/site";

const features = [
  "Follow your application through all four court stages",
  "Download filed cause papers, affidavits and orders",
  "Live, time-stamped updates and secure messaging with your lawyer",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-dvh overflow-hidden lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden h-dvh flex-col overflow-hidden bg-linear-to-b from-navy to-navy-2 px-12 py-9 text-white lg:flex xl:px-16">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label={`${firm.name} home`}>
            <BrandMark light />
          </Link>
          <Link
            href="/"
            className="text-[13px] text-slate-light transition-colors hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="my-auto max-w-md py-10">
          <p className="text-[13px] font-medium text-gold">
            Secure Client Portal
          </p>
          <h2 className="mt-4 font-serif text-[2.4rem] leading-[1.15] tracking-[-0.02em] text-balance">
            Your emergency application, step by step.
          </h2>
          <ul className="mt-9 grid gap-4">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-light"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5">
          <a
            href={`tel:${firm.hotlineTel}`}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors hover:border-gold/40 hover:bg-white/[0.07]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
              <Phone className="size-5" />
            </span>
            <span>
              <span className="block text-xs text-slate-light">
                Assets at risk? 24/7 Injunction Hotline
              </span>
              <span className="text-[15px] font-medium">{firm.hotline}</span>
            </span>
          </a>
          <p className="flex items-center gap-2 text-xs text-slate-light">
            <Lock className="size-3.5 shrink-0" />
            Your data is protected under the Personal Data Protection Act 2010.
          </p>
        </div>
      </aside>

      <div className="flex h-dvh min-w-0 flex-col bg-white">
        <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 px-5 sm:px-10 lg:hidden">
          <Link href="/" aria-label={`${firm.name} home`}>
            <BrandMark />
          </Link>
          <Link
            href="/"
            className="text-[13px] font-medium text-slate hover:text-navy"
          >
            ← Back to Home
          </Link>
        </header>
        <main
          id="main-content"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="flex min-h-full items-center justify-center px-5 pt-2 pb-10 sm:px-10 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
