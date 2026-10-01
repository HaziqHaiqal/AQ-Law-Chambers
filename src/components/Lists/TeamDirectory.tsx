import { firm, teamMembers } from "@/data/site";
import { ArrowUpRight } from "@/components/Icons";
import { Reveal } from "@/components/Motion/Reveal";
import styles from "@/styles/partners.module.css";

// Most senior first; any role not listed here goes last. Order within a role follows the content file.
const roleRank = [
  "Senior Partner",
  "Partner",
  "Junior Partner",
  "Senior Associate",
  "Legal Associate",
  "Associate",
];

const rankOf = (role: string) =>
  roleRank.includes(role) ? roleRank.indexOf(role) : roleRank.length;

const teamByRole = teamMembers
  .reduce<{ role: string; members: (typeof teamMembers)[number][] }[]>(
    (groups, member) => {
      const group = groups.find((g) => g.role === member.role);
      if (group) group.members.push(member);
      else groups.push({ role: member.role, members: [member] });
      return groups;
    },
    [],
  )
  .sort((a, b) => rankOf(a.role) - rankOf(b.role));

export function TeamDirectory() {
  return (
    <Reveal className={styles.team}>
      <div className={styles.teamHeader}>
        <h3>Partners &amp; associates</h3>
        <p>One team. A shared commitment.</p>
      </div>
      <div className={styles.directory}>
        {teamByRole.map((group) => (
          <section key={group.role} aria-labelledby={`team-${group.role}`}>
            <h4 id={`team-${group.role}`} className={styles.groupTitle}>
              {group.role}s{" "}
              <span>{String(group.members.length).padStart(2, "0")}</span>
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
  );
}
