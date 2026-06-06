// Nav scroll behavior — inner pages always use solid nav (no dark hero behind it)
const nav = document.getElementById('nav');
const SCROLL_THRESHOLD = 80;
const isHomePage = Boolean(document.getElementById('home'));

if (nav) {
  const updateNavScroll = () => {
    nav.classList.toggle('scrolled', !isHomePage || window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();
}
// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, parseInt(delay, 10));
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Mobile hamburger
const hamburger = document.querySelector('.nav__hamburger');
const drawer = document.querySelector('.nav__drawer');

if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    drawer.setAttribute('aria-hidden', String(isOpen));
    hamburger.classList.toggle('is-open');
    drawer.classList.toggle('is-open');
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      hamburger.classList.remove('is-open');
      drawer.classList.remove('is-open');
    });
  });
}

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
