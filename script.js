// ========================================
// PORTFOLIO WEBSITE JAVASCRIPT
// Premium Features: Dark/Light Mode, Smooth Animations, Scroll Effects
// ========================================

(function() {
    'use strict';

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ========================================
    // DARK/LIGHT MODE TOGGLE
    // ========================================

    const initThemeToggle = () => {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        // Get saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark-mode';
        body.className = savedTheme;
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = body.className;
                const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
                
                body.className = newTheme;
                localStorage.setItem('theme', newTheme);
                
                // Animate toggle button
                themeToggle.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    themeToggle.style.transform = 'rotate(0deg)';
                }, 300);
            });
        }
    };

    // ========================================
    // NAVIGATION
    // ========================================

    const initNavigation = () => {
        const header = document.getElementById('header');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                const isExpanded = navToggle.classList.contains('active');
                navToggle.setAttribute('aria-expanded', isExpanded);
            });

            // Close menu on link click
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // Header scroll shadow
        const handleScroll = throttle(() => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);

        // Active nav link on scroll
        const sections = document.querySelectorAll('section[id]');
        
        const setActiveNavLink = () => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', throttle(setActiveNavLink, 100));
    };

    // ========================================
    // SMOOTH SCROLLING
    // ========================================

    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ========================================
    // FADE-IN ON SCROLL (Smooth Animations)
    // ========================================

    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with fade-up class
        document.querySelectorAll('.fade-up').forEach(el => {
            observer.observe(el);
        });

        // Observe project cards and other animated elements
        document.querySelectorAll('.project-card, .highlight-card, .skill-category, .contact-item').forEach(el => {
            el.classList.add('fade-up');
            observer.observe(el);
        });
    };

    // ========================================
    // CURRENT YEAR
    // ========================================

    const updateCurrentYear = () => {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    };

    // ========================================
    // INITIALIZATION
    // ========================================

    const init = () => {
        initThemeToggle();
        initNavigation();
        initSmoothScroll();
        initScrollAnimations();
        updateCurrentYear();
        
        // Initial fade-up for hero elements
        const heroElements = document.querySelectorAll('.hero .fade-up');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    };

    // DOM Content Loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();