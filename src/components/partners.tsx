import Image from "next/image";
import type { CSSProperties } from "react";
import { firm, partners, teamMembers } from "@/content/site";
import { ArrowUpRight, Plus } from "./icons";
import { Reveal } from "./reveal";
import { Container, SectionHeading } from "./ui";
import styles from "./partners.module.css";

export function Partners() {
  return (
    <section id="partners" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-7 lg:grid-cols-2 lg:items-end lg:gap-20">
          <SectionHeading
            eyebrow="Our people"
            title={
              <>
                Personal commitment.
                <br />
                At every step.
              </>
            }
          />
          <Reveal className="max-w-md text-[14px] leading-[1.9] text-slate lg:pb-1">
            Good counsel is personal. Meet the partners and legal team who bring
            clear thinking, focused expertise and individual attention to your
            matter.
          </Reveal>
        </div>

        <div className={styles.partnerGrid}>
          {partners.map((partner, index) => (
            <Reveal key={partner.name} delay={index * 100}>
              <article
                className={styles.partnerCard}
                aria-labelledby={`partner-name-${index}`}
              >
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
                    <p className={styles.role}>Partner</p>
                    <h3
                      id={`partner-name-${index}`}
                      className={styles.partnerName}
                    >
                      {partner.name}
                    </h3>
                    <p className={styles.credential}>
                      Advocate &amp; Solicitor
                    </p>
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
                    <h4 className={styles.detailHeading}>Areas of expertise</h4>
                    <ul className={styles.expertiseList}>
                      {partner.expertise.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className={styles.qualification}>
                      {partner.qualifications[0]}
                    </p>
                  </div>
                </details>
              </article>
            </Reveal>
          ))}
        </div>

        <div className={styles.teamHeader}>
          <h3 className="font-serif text-[27px] tracking-[-0.03em]">
            Partners &amp; associates
          </h3>
          <span className={styles.teamRule} aria-hidden="true" />
          <p className="text-[11px] text-slate">
            One team. A shared commitment.
          </p>
        </div>
        <ul className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <li key={member.name}>
              <a
                href={`mailto:${firm.email}?subject=${encodeURIComponent(`Attention: ${member.name}`)}`}
                aria-label={`Email ${member.name}, ${member.role}`}
                className={styles.teamMember}
              >
                <div>
                  <p className={styles.teamRole}>{member.role}</p>
                  <h4 className={styles.teamName}>{member.name}</h4>
                </div>
                <span className={styles.teamArrow} aria-hidden="true">
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
