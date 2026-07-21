import { HomeWorldMount } from '@/scenes/HomeWorldMount';
import { Hero } from '@/sections/Hero';
import { Platform } from '@/sections/Platform';
import { Work } from '@/sections/Work';
import { About } from '@/sections/About';
import { Experience } from '@/sections/Experience';
import { Skills } from '@/sections/Skills';
import { Education } from '@/sections/Education';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <HomeWorldMount />

      {/* The readable document. Sits above the canvas; is the entire site when
          the world is switched off. */}
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
