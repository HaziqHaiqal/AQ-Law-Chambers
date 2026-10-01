import Image from "next/image";
import { CapabilityTicker } from "@/components/Lists/CapabilityTicker";
import { ArrowUpRight } from "@/components/Icons";
import { Container } from "@/components/Layout/Container";
import styles from "@/styles/hero.module.css";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading">
      <div className={styles.stage}>
        <div className={styles.artwork} aria-hidden="true">
          <Image
            src="/hero/architecture.webp"
            alt=""
            fill
            preload
            sizes="100vw"
            className={styles.image}
          />
        </div>
        <Container className={styles.layout}>
          <div className={styles.copy}>
            <h1 id="hero-heading" className={styles.heading}>
              <span className={styles.line}>
                <span>Clarity in</span>
              </span>{" "}
              <span className={styles.line}>
                <span>complexity.</span>
              </span>
            </h1>
            <p className={styles.resolve}>
              Resolve when <em>it matters.</em>
            </p>
            <div className={styles.aside}>
              <p className={styles.intro}>
                Specialised in cross-border asset recovery, emergency asset
                freezing, and complex commercial litigation.
              </p>
              <a href="#contact" className={styles.primaryLink}>
                Speak to a partner
                <span>
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </div>
          </div>
        </Container>
      </div>
      <CapabilityTicker />
    </section>
  );
}
