/* ══════════════════════════════════════════════════
   PROMO 10X – IRFAN KHAIRI
   JavaScript
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. NAVBAR: STICKY SHADOW + SCROLL CLASS ───── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load


  /* ── 2. HAMBURGER MOBILE MENU ───────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Buka Menu');
  }

  function openMobileMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Tutup Menu');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.contains('open');
      if (isOpen) { closeMobileMenu(); } else { openMobileMenu(); }
    });

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) { closeMobileMenu(); }
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMobileMenu(); }
    });
  }


  /* ── 3. SMOOTH SCROLL FOR ANCHOR LINKS ──────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return; // skip bare hash
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH   = navbar ? navbar.offsetHeight : 68;
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });


  /* ── 4. FAQ ACCORDION ───────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach(function (otherItem) {
        const otherBtn    = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('open');
        }
      });

      // Toggle current
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.classList.remove('open');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });


  /* ── 5. ACTIVE NAV LINK (SCROLL SPY) ────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.navbar__links a[href^="#"]');

  function setActiveNav() {
    const navH = navbar ? navbar.offsetHeight + 20 : 90;
    let currentId = '';

    sections.forEach(function (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - navH;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });


  /* ── 6. VIDEO LAZY LOADING ───────────────────────── */
  // If IntersectionObserver is available, only load video when visible
  const videoPlayer = document.querySelector('.video-player');
  if (videoPlayer && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Trigger preload
          if (videoPlayer.getAttribute('preload') === 'none') {
            videoPlayer.setAttribute('preload', 'metadata');
          }
          videoObserver.unobserve(videoPlayer);
        }
      });
    }, { threshold: 0.25 });

    videoObserver.observe(videoPlayer);
  }


  /* ── 7. FADE-IN ANIMATION ON SCROLL ─────────────── */
  const animatedEls = document.querySelectorAll(
    '.feature-card, .platform-card, .pricing-card, .video-card, .industry-card, .step-card, .faq-item'
  );

  if ('IntersectionObserver' in window && animatedEls.length > 0) {
    // Add initial hidden state via inline style
    animatedEls.forEach(function (el) {
      el.style.opacity    = '0';
      el.style.transform  = el.style.transform
        ? el.style.transform + ' translateY(20px)'
        : 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = entry.target.style.transform
            .replace('translateY(20px)', 'translateY(0)');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(function (el) { observer.observe(el); });
  }


  /* ── 8. PRICING CARD: KEYBOARD ACCESSIBILITY ─────── */
  // Ensure pricing cards' buttons are reachable by keyboard
  document.querySelectorAll('.pricing-card .btn').forEach(function (btn) {
    btn.setAttribute('tabindex', '0');
  });


  /* ── 9. VIDEO ERROR HANDLING ─────────────────────── */
  if (videoPlayer) {
    videoPlayer.addEventListener('error', function () {
      var fallback = videoPlayer.querySelector('.video-fallback') ||
                     videoPlayer.parentElement.querySelector('.video-fallback');
      if (fallback) {
        videoPlayer.style.display = 'none';
        fallback.style.display    = 'flex';
      }
    });
  }


  /* ── 10. CURRENT YEAR IN FOOTER ──────────────────── */
  // If you later add id="footer-year", this auto-updates the year
  var yearEl = document.getElementById('footer-year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

})();
