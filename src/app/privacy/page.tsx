import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/Brand/BrandMark";
import { Container } from "@/components/Layout/Container";
import { PRIVACY_NOTICE_VERSION, privacyNotice } from "@/data/privacy";
import { firm } from "@/data/site";

export const metadata: Metadata = { title: "Privacy Notice" };

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line">
        <Container className="flex h-[76px] items-center">
          <Link href="/" aria-label={`${firm.name} home`}>
            <BrandMark />
          </Link>
        </Container>
      </header>
      <main id="main-content" className="flex-1 py-14 sm:py-20">
        <Container className="max-w-[760px]">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold-ink uppercase">
            Personal Data Protection Act 2010
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.01em]">
            Privacy Notice
          </h1>
          <p className="mt-4 text-sm text-slate">
            Version {PRIVACY_NOTICE_VERSION} · Last updated{" "}
            {privacyNotice.updated}
          </p>
          <div className="mt-10 grid gap-9">
            {privacyNotice.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-xl">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 leading-[1.8] text-slate">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
