import Image from "next/image";

/** The official AQ monogram (gold fading to navy). `light` swaps the navy for silver so it holds on navy backgrounds. */
export function Crest({
  light = false,
  className = "",
  preload = false,
}: {
  light?: boolean;
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={light ? "/brand/monogram-light.png" : "/brand/monogram-dark.png"}
      alt="A&Q Law Chambers monogram"
      width={640}
      height={563}
      preload={preload}
      sizes="(max-width: 640px) 160px, 288px"
      className={`h-auto ${className}`}
    />
  );
}
