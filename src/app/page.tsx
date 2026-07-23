import { HomeWorldChrome } from '@/components/HomeWorldChrome';
import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/Hero';
import { HomeBelowFold } from '@/sections/HomeBelowFold';

export default function Home() {
  return (
    <>
      <HomeWorldChrome />

      {/* The readable document. Sits above the canvas; is the entire site when
          the world is switched off. */}
      <main id="main" className="relative z-10">
        <Hero />
        <HomeBelowFold />
      </main>

      <Footer />
    </>
  );
}
