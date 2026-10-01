import Image from "next/image";

/** The official A&Q crest (extracted from the firm logo). `light` is the reversed version for navy backgrounds. */
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
      src={light ? "/brand/logo-light.png" : "/brand/logo-dark.png"}
      alt="A&Q Law Chambers crest"
      width={453}
      height={536}
      preload={preload}
      sizes="(max-width: 640px) 160px, 288px"
      className={`h-auto ${className}`}
    />
  );
}
