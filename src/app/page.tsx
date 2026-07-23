import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/Hero';
import { Platform } from '@/sections/Platform';
import { Work } from '@/sections/Work';
import { About } from '@/sections/About';
import { Experience } from '@/sections/Experience';
import { Skills } from '@/sections/Skills';
import { Education } from '@/sections/Education';
import { Contact } from '@/sections/Contact';

export default function Home() {
  return (
    <>
      <main id="main" className="relative z-10">
        <Hero />
        <Platform />
        <Work />
        <About />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
