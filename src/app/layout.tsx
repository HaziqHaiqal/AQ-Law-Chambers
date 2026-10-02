import type { Metadata } from "next";
import { Cinzel, Inter, Source_Serif_4 } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Sober transitional serif for headings.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Trajan-style capitals — used only for the wordmark, to match the crest lettering.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "A&Q Law Chambers — Advocates & Solicitors, Shah Alam",
    template: "%s | A&Q Law Chambers",
  },
  description:
    "A&Q Law Chambers, Advocates & Solicitors in Shah Alam: civil litigation, mediation & arbitration, employment, insurance and real estate, with a 24/7 Injunction Hotline on 03-7954 5405.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sourceSerif.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
