import { BackToTop } from "@/components/back-to-top";
import { Contact } from "@/components/contact";
import { Emergency } from "@/components/emergency";
import { Expertise } from "@/components/expertise";
import { Firm } from "@/components/firm";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Partners } from "@/components/partners";
import { Proceedings } from "@/components/proceedings";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Hero />
        <Firm />
        <Expertise />
        <Partners />
        <Proceedings />
        <Emergency />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
