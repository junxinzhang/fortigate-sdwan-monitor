// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
  // Mobile menu toggle
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('mobile-nav');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('active');
      btn.innerHTML = nav.classList.contains('active')
        ? '<i class="ri-close-line text-xl text-white"></i>'
        : '<i class="ri-menu-line text-xl text-white"></i>';
    });

    // Close mobile menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        btn.innerHTML = '<i class="ri-menu-line text-xl text-white"></i>';
      });
    });
  }

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add scroll effect to header
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Dynamic copyright year (starting from 2025)
  const copyrightEl = document.getElementById('copyright-year');
  if (copyrightEl) {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    copyrightEl.textContent = currentYear > startYear
      ? `${startYear}-${currentYear}`
      : `${startYear}`;
  }
});
