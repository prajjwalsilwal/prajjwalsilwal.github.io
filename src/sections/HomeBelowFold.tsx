'use client';

import dynamic from 'next/dynamic';

/**
 * Below-fold home sections — code-split so hero + nav hydrate first.
 * Placeholders keep section ids available for in-page nav during load.
 */

function sectionPlaceholder(id: string, minH = 'min-h-[40vh]') {
  function Placeholder() {
    return <section id={id} className={minH} aria-hidden="true" />;
  }
  Placeholder.displayName = `Placeholder_${id}`;
  return Placeholder;
}

const Platform = dynamic(() => import('@/sections/Platform').then((m) => m.Platform), {
  loading: sectionPlaceholder('platform', 'min-h-[60vh]'),
});
const Work = dynamic(() => import('@/sections/Work').then((m) => m.Work), {
  loading: sectionPlaceholder('work'),
});
const About = dynamic(() => import('@/sections/About').then((m) => m.About), {
  loading: sectionPlaceholder('about'),
});
const Experience = dynamic(() => import('@/sections/Experience').then((m) => m.Experience), {
  loading: sectionPlaceholder('experience'),
});
const Skills = dynamic(() => import('@/sections/Skills').then((m) => m.Skills), {
  loading: sectionPlaceholder('skills'),
});
const Education = dynamic(() => import('@/sections/Education').then((m) => m.Education), {
  loading: sectionPlaceholder('education'),
});
const Contact = dynamic(() => import('@/sections/Contact').then((m) => m.Contact), {
  loading: sectionPlaceholder('contact'),
});

export function HomeBelowFold() {
  return (
    <>
      <Platform />
      <Work />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
