import Image from "next/image";
import type { CSSProperties } from "react";
import { firm, partners, teamMembers } from "@/content/site";
import { ArrowUpRight, Plus } from "./icons";
import { Reveal } from "./reveal";
import { Container, SectionHeading } from "./ui";
import styles from "./partners.module.css";

// Most senior first; any role not listed here goes last. Order within a role follows the content file.
const roleRank = ["Senior Partner", "Partner", "Junior Partner", "Senior Associate", "Legal Associate", "Associate"];

const rankOf = (role: string) => (roleRank.includes(role) ? roleRank.indexOf(role) : roleRank.length);

const teamByRole = teamMembers
  .reduce<{ role: string; members: (typeof teamMembers)[number][] }[]>((groups, member) => {
    const group = groups.find((g) => g.role === member.role);
    if (group) group.members.push(member);
    else groups.push({ role: member.role, members: [member] });
    return groups;
  }, [])
  .sort((a, b) => rankOf(a.role) - rankOf(b.role));

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
          <Reveal className="max-w-md text-base leading-[1.8] text-slate lg:pb-2">
            Good counsel is personal. Meet the partners and legal team who bring clear thinking, focused expertise
            and individual attention to your matter.
          </Reveal>
        </div>

        <div className={styles.partnerGrid}>
          {partners.map((partner, index) => (
            <Reveal key={partner.name} delay={index * 100}>
              <article className={styles.partnerCard} aria-labelledby={`partner-name-${index}`}>
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
                    <h3 id={`partner-name-${index}`} className={styles.partnerName}>
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
                    <span className={styles.closedLabel}>View profile &amp; experience</span>
                    <span className={styles.openLabel}>Close profile</span>
                    <Plus className={styles.toggleIcon} />
                  </summary>
                  <div className={styles.profileBody}>
                    <p className={styles.biography}>{partner.bio}</p>
                  </div>
                </details>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.team}>
          <div className={styles.teamHeader}>
            <h3>Partners &amp; associates</h3>
            <p>One team. A shared commitment.</p>
          </div>
          <div className={styles.directory}>
            {teamByRole.map((group) => (
              <section key={group.role} aria-labelledby={`team-${group.role}`}>
                <h4 id={`team-${group.role}`} className={styles.groupTitle}>
                  {group.role}s <span>{String(group.members.length).padStart(2, "0")}</span>
                </h4>
                <ul>
                  {group.members.map((member) => (
                    <li key={member.name}>
                      <a
                        href={`mailto:${firm.email}?subject=${encodeURIComponent(`Attention: ${member.name}`)}`}
                        aria-label={`Email ${member.name}, ${member.role}`}
                        className={styles.member}
                      >
                        <span className={styles.memberName}>{member.name}</span>
                        <ArrowUpRight className={styles.memberArrow} />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
