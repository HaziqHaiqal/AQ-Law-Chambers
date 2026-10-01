import { BackToTop } from "@/components/Buttons/BackToTop";
import { Contact } from "@/components/Sections/Contact";
import { Emergency } from "@/components/Sections/Emergency";
import { Expertise } from "@/components/Sections/Expertise";
import { Firm } from "@/components/Sections/Firm";
import { Footer } from "@/components/Layout/Footer";
import { Header } from "@/components/Layout/Header";
import { Hero } from "@/components/Sections/Hero";
import { Partners } from "@/components/Sections/Partners";
import { Proceedings } from "@/components/Sections/Proceedings";
import { Testimonials } from "@/components/Sections/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Hero />
        <Firm />
        <Expertise />
        <Partners />
        <Testimonials />
        <Proceedings />
        <Emergency />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
