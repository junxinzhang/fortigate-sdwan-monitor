// Performance optimized main.js
(function() {
  'use strict';

  // Use passive event listeners for better scroll performance
  const passiveSupported = (() => {
    let passive = false;
    try {
      const options = { get passive() { passive = true; return false; } };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch(e) {}
    return passive;
  })();

  const passiveOpts = passiveSupported ? { passive: true } : false;

  // Debounce utility for scroll events
  function debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Initialize when DOM is ready
  function init() {
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initCopyrightYear();
    initAOS();
  }

  // Mobile menu toggle with improved accessibility
  function initMobileMenu() {
    const btn = document.getElementById('menu-btn');
    const nav = document.getElementById('mobile-nav');

    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('active');
      btn.setAttribute('aria-expanded', isOpen);
      btn.innerHTML = isOpen
        ? '<i class="ri-close-line text-xl text-white"></i>'
        : '<i class="ri-menu-line text-xl text-white"></i>';
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<i class="ri-menu-line text-xl text-white"></i>';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<i class="ri-menu-line text-xl text-white"></i>';
      }
    });
  }

  // Smooth scroll with header offset
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

          window.scrollTo({ top, behavior: 'smooth' });

          // Update URL without triggering scroll
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  // Header scroll effect with debouncing
  function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = 0;
    let ticking = false;

    const updateHeader = () => {
      const scrollY = window.scrollY;
      header.classList.toggle('scrolled', scrollY > 50);

      // Optional: hide header on scroll down, show on scroll up
      if (scrollY > lastScrollY && scrollY > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollY = scrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, passiveOpts);
  }

  // Dynamic copyright year
  function initCopyrightYear() {
    const el = document.getElementById('copyright-year');
    if (!el) return;

    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    el.textContent = currentYear > startYear
      ? `${startYear}-${currentYear}`
      : `${startYear}`;
  }

  // Initialize AOS with optimized settings
  function initAOS() {
    if (typeof AOS === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    AOS.init({
      duration: prefersReducedMotion ? 0 : 600,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
      disable: prefersReducedMotion
    });
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Intersection Observer for lazy animations (more performant than scroll events)
  if ('IntersectionObserver' in window) {
    const animateOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          animateOnScroll.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    document.querySelectorAll('[data-animate]').forEach(el => {
      animateOnScroll.observe(el);
    });
  }
})();
