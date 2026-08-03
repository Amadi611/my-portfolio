/**
 * script.js — Alex Mercer Portfolio
 * ============================================================
 * Features:
 *  1. Loading screen
 *  2. Custom cursor
 *  3. Sticky navbar + active-link highlighting
 *  4. Mobile hamburger menu
 *  5. Typing / typewriter animation
 *  6. Scroll-reveal animations (IntersectionObserver)
 *  7. Skill bar animations
 *  8. Counter (stats) animation
 *  9. Project filtering
 * 10. Timeline tab switching
 * 11. Contact-form client-side validation + AJAX submit
 * 12. Back-to-top button
 * 13. Footer year
 * ============================================================
 */

/* ============================================================
   1.  LOADING SCREEN
============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Wait for the loader bar animation (1.4s) then fade out
  setTimeout(() => {
    loader.classList.add('hidden');
    // Re-enable scroll (was blocked during load)
    document.body.style.overflow = '';
  }, 1600);
});
// Block scroll while loading
document.body.style.overflow = 'hidden';

/* ============================================================
   2.  CUSTOM CURSOR
============================================================ */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lerp (smooth lag)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hide cursor when it leaves the window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ============================================================
   3.  STICKY NAVBAR + ACTIVE LINK HIGHLIGHTING
============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  // Add .scrolled class when user scrolls past 50px
  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Highlight the nav link whose section is most in view
  function highlightActiveLink() {
    const scrollPos = window.scrollY + 120; // offset for sticky nav

    navLinks.forEach(link => {
      const sectionId = link.dataset.section;
      const section   = document.getElementById(sectionId);
      if (!section) return;

      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
})();

/* ============================================================
   4.  MOBILE HAMBURGER MENU
============================================================ */
(function initHamburger() {
  const btn      = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!btn || !navLinks) return;

  btn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ============================================================
   5.  TYPING / TYPEWRITER ANIMATION
============================================================ */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const roles = [
    'Full-Stack Developer',
    'Android App Developer',
    //'PHP & Node.js Engineer',
    'Software QA Tester',
    'UI/UX Enthusiast',
    'Open Source Contributor',
    'Cloud Architect',
    'Problem Solver',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pause = false;

  function type() {
    if (pause) return;

    const current = roles[roleIndex];

    if (isDeleting) {
      // Remove last character
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      // Add next character
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    // Determine speed
    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing — pause, then delete
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next role
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      delay      = 400;
    }

    setTimeout(type, delay);
  }

  type();
})();

/* ============================================================
   6.  SCROLL-REVEAL ANIMATIONS  (IntersectionObserver)
============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[class*="reveal-"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Unobserve after animation fires (one-shot)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   7.  SKILL BAR ANIMATIONS
============================================================ */
(function initSkillBars() {
  const skillItems = document.querySelectorAll('.skill-item[data-level]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item  = entry.target;
        const fill  = item.querySelector('.skill-fill');
        const level = item.dataset.level;

        if (fill) {
          // Small delay so the reveal animation plays first
          setTimeout(() => {
            fill.style.width = level + '%';
          }, 200);
        }

        observer.unobserve(item);
      }
    });
  }, { threshold: 0.3 });

  skillItems.forEach(el => observer.observe(el));
})();

/* ============================================================
   8.  COUNTER / STATS ANIMATION  (hero section)
============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800; // ms
      const step   = dur / target;
      let   current = 0;

      const interval = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) clearInterval(interval);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   9.  PROJECT FILTERING
============================================================ */
(function initProjectFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const match    = filter === 'all' || category === filter;

        if (match) {
          // Show: remove hidden and animate in
          card.classList.remove('hidden');
          card.style.animation = 'none';
          void card.offsetWidth; // trigger reflow
          card.style.animation = 'fadeInUp .4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Inject fade-in keyframe dynamically (avoids extra CSS)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   10.  CERTIFICATION FILTERING
============================================================ */
(function initCertFilter() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards  = document.querySelectorAll('.cert-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      certCards.forEach(card => {
        const category = card.dataset.category;
        const match    = filter === 'all' || category === filter;

        if (match) {
          // Show: remove hidden and animate in
          card.classList.remove('hidden');
          card.style.animation = 'none';
          void card.offsetWidth; // trigger reflow
          card.style.animation = 'fadeInUp .4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   11.  TIMELINE TAB SWITCHING
============================================================ */
(function initTimelineTabs() {
  const tabs   = document.querySelectorAll('.tl-tab');
  const panels = document.querySelectorAll('.timeline-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show matching panel
      const target = tab.dataset.tab;
      panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === target);
      });

      // Re-trigger scroll-reveal for newly visible panel
      const revealEls = document.querySelectorAll(`#${target} [class*="reveal-"]`);
      revealEls.forEach(el => {
        if (!el.classList.contains('in-view')) {
          el.classList.add('in-view');
        }
      });
    });
  });
})();

/* ============================================================
   11.  CERTIFICATION FILTERING
============================================================ */
(function initCertFilter() {
  const filterBtns   = document.querySelectorAll('.cert-filter-btn');
  const certCards    = document.querySelectorAll('.cert-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      certCards.forEach(card => {
        const category = card.dataset.category;
        const match    = filter === 'all' || category === filter;

        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'fadeInUp .4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   12.  CONTACT FORM — Validation + AJAX submit
============================================================ */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const formAlert  = document.getElementById('formAlert');

  // ── Field references ──────────────────────────────────────
  const fields = {
    name:    { el: document.getElementById('name'),    error: document.getElementById('nameError')    },
    email:   { el: document.getElementById('email'),   error: document.getElementById('emailError')   },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  // ── Validation rules ──────────────────────────────────────
  const rules = {
    name:    { min: 2,   msg: 'Name must be at least 2 characters.'   },
    email:   { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email address.' },
    subject: { min: 4,   msg: 'Subject must be at least 4 characters.' },
    message: { min: 15,  msg: 'Message must be at least 15 characters.' },
  };

  // ── Validate a single field ───────────────────────────────
  function validateField(name) {
    const { el, error } = fields[name];
    const val = el.value.trim();
    let   msg = '';

    if (!val) {
      msg = 'This field is required.';
    } else if (rules[name].regex && !rules[name].regex.test(val)) {
      msg = rules[name].msg;
    } else if (rules[name].min && val.length < rules[name].min) {
      msg = rules[name].msg;
    }

    error.textContent = msg;
    el.classList.toggle('error', !!msg);
    return !msg;
  }

  // ── Real-time validation on blur ──────────────────────────
  Object.keys(fields).forEach(name => {
    const { el } = fields[name];
    el.addEventListener('blur',  () => validateField(name));
    el.addEventListener('input', () => {
      // Clear error as user types
      if (el.classList.contains('error')) validateField(name);
    });
  });

  // ── Form submit ───────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Run all validations
    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) return;

    // Show loading state
    btnText.hidden    = true;
    btnLoading.hidden = false;
    submitBtn.disabled = true;
    formAlert.hidden   = true;

    try {
      const data = new FormData(form);

      const response = await fetch('contact.php', {
        method: 'POST',
        body:   data,
      });

      const result = await response.json();

      showAlert(result.success ? 'success' : 'error', result.message);

      if (result.success) {
        form.reset();
        // Remove any lingering error classes
        Object.values(fields).forEach(({ el }) => el.classList.remove('error'));
      }
    } catch (err) {
      // Network / server error fallback
      showAlert('error', '⚠️ Network error. Please try again or email me directly.');
      console.error('Contact form error:', err);
    } finally {
      btnText.hidden     = false;
      btnLoading.hidden  = true;
      submitBtn.disabled = false;
    }
  });

  // ── Show alert helper ─────────────────────────────────────
  function showAlert(type, message) {
    formAlert.hidden      = false;
    formAlert.className   = 'form-alert ' + (type === 'success' ? 'success' : 'error-alert');
    formAlert.textContent = message;

    // Auto-hide after 6s
    setTimeout(() => { formAlert.hidden = true; }, 6000);
  }
})();

/* ============================================================
   12.  BACK TO TOP BUTTON
============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   13.  FOOTER YEAR  (keeps copyright current automatically)
============================================================ */
(function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   14.  SMOOTH SCROLL for all anchor links  (polyfill)
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // height of sticky navbar
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================================
   15.  HERO AVATAR — subtle parallax on mouse move
============================================================ */
(function initHeroParallax() {
  const hero   = document.querySelector('.hero');
  const avatar = document.getElementById('heroAvatar');
  if (!hero || !avatar) return;

  hero.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * 14;
    const y = ((e.clientY - top)  / height - 0.5) * 14;
    avatar.style.transform = `translate(${x}px, ${y}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    avatar.style.transform = 'translate(0, 0)';
    avatar.style.transition = 'transform 0.6s ease';
  });
})();
