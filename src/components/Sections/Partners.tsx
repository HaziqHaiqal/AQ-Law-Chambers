import { partners } from "@/data/site";
import { PartnerCard } from "@/components/Cards/PartnerCard";
import { TeamDirectory } from "@/components/Lists/TeamDirectory";
import { Reveal } from "@/components/Motion/Reveal";
import { Container } from "@/components/Layout/Container";
import { SectionHeading } from "@/components/Typography/SectionHeading";
import styles from "@/styles/partners.module.css";

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
            Good counsel is personal. Meet the partners and legal team who bring
            clear thinking, focused expertise and individual attention to your
            matter.
          </Reveal>
        </div>

        <div className={styles.partnerGrid}>
          {partners.map((partner, index) => (
            <Reveal key={partner.name} delay={index * 100}>
              <PartnerCard
                partner={partner}
                headingId={`partner-name-${index}`}
              />
            </Reveal>
          ))}
        </div>

        <TeamDirectory />
      </Container>
    </section>
  );
}
