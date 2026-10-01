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

export function CapabilityTicker() {
  return (
    <div className="border-y border-line">
      <div
        className="ticker overflow-hidden py-5"
        role="region"
        aria-label="Key capabilities"
        tabIndex={0}
      >
        <ul className="ticker-track">
          {[0, 1].map((copy) =>
            capabilities.map((capability) => (
              <li
                key={`${copy}-${capability}`}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-8 pr-8 font-serif text-xl text-slate italic sm:text-[1.35rem]"
              >
                {capability}
                <span
                  aria-hidden="true"
                  className="size-1.5 rotate-45 bg-gold"
                />
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
}
