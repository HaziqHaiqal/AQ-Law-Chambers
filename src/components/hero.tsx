import Image from "next/image";
import { ArrowUpRight } from "./icons";
import { Container } from "./ui";
import styles from "./hero.module.css";

const capabilities = [
  "Civil litigation",
  "Mediation & arbitration",
  "Employment & industrial relations",
  "Insurance & takaful",
  "Real estate & conveyancing",
  "Mareva injunctions",
  "Crypto & Web3 asset recovery",
  "ESG & financial fraud",
  "Cloud & technology disputes",
];

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
              <span className={styles.line}><span>Clarity in</span></span>{" "}
              <span className={styles.line}><span>complexity.</span></span>
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
                <span><ArrowUpRight className="size-4" /></span>
              </a>
            </div>
          </div>
        </Container>
      </div>
      <div className="border-y border-line">
        <div className="ticker overflow-hidden py-5" role="region" aria-label="Key capabilities" tabIndex={0}>
          <ul className="ticker-track">
            {[0, 1].map((copy) =>
              capabilities.map((capability) => (
                <li
                  key={`${copy}-${capability}`}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center gap-8 pr-8 font-serif text-xl italic text-slate sm:text-[1.35rem]"
                >
                  {capability}
                  <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
                </li>
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
