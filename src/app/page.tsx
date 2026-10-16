import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <div style={{ marginTop: "clamp(48px, 7vw, 96px)" }}>
          <Marquee />
        </div>
        <Services />
        <Work />
        <Stats />
        <About />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
