import Image from "next/image";
import type { CSSProperties } from "react";
import { firm, type partners } from "@/data/site";
import { ArrowUpRight, Plus } from "@/components/Icons";
import styles from "@/styles/partners.module.css";

type PartnerCardProps = {
  partner: (typeof partners)[number];
  headingId: string;
};

export function PartnerCard({ partner, headingId }: PartnerCardProps) {
  return (
    <article className={styles.partnerCard} aria-labelledby={headingId}>
      <div className={styles.profileCover}>
        <div className={styles.portrait}>
          <Image
            src={partner.portrait}
            alt={`Portrait of ${partner.name}`}
            fill
            sizes={
              partner.portraitScale > 1
                ? "(max-width: 479px) 200vw, (max-width: 1023px) 100vw, 640px"
                : "(max-width: 479px) 125vw, (max-width: 1023px) 60vw, 420px"
            }
            className={styles.portraitImage}
            style={
              {
                objectPosition: partner.portraitPosition,
                transformOrigin: partner.portraitOrigin,
                "--portrait-scale": partner.portraitScale,
              } as CSSProperties
            }
          />
          <span className={styles.portraitFrame} aria-hidden="true" />
        </div>
        <div className={styles.profileIntro}>
          <p className={styles.role}>{partner.title}</p>
          <h3 id={headingId} className={styles.partnerName}>
            {partner.name}
          </h3>
          <p className={styles.credential}>Advocate &amp; Solicitor</p>
          <div className={styles.focus}>
            <p className={styles.focusTitle}>{partner.focus}</p>
            <p className={styles.summary}>{partner.summary}</p>
          </div>
          <a
            href={`mailto:${firm.email}?subject=${encodeURIComponent(`Attention: ${partner.name}`)}`}
            aria-label={`Email ${partner.name}`}
            className={styles.partnerContact}
          >
            Contact {partner.contactName}
            <ArrowUpRight className="size-4 shrink-0" />
          </a>
        </div>
      </div>

      {/* Full profile opens inline, inside the card. */}
      <details className={styles.profileDetails}>
        <summary className={styles.profileToggle}>
          <span className={styles.closedLabel}>
            View profile &amp; experience
          </span>
          <span className={styles.openLabel}>Close profile</span>
          <Plus className={styles.toggleIcon} />
        </summary>
        <div className={styles.profileBody}>
          <p className={styles.biography}>{partner.bio}</p>
        </div>
      </details>
    </article>
  );
}
