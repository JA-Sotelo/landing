// ============================================================================
// JAVIER SOTELO — LANDING PAGE INTERACTIVITY
// Light Editorial Cream + GSAP/ScrollTrigger Animations
// ============================================================================

(function () {
  'use strict';

  // Safe wrapper for init functions
  function safe(fn, name) {
    try {
      fn();
    } catch (e) {
      console.warn(`Init failed: ${name}`, e);
    }
  }

  // ========================================================================
  // 1. SPLIT TEXT ANIMATION (simplified, no external lib)
  // ========================================================================
  function initSplitText() {
    const reveals = document.querySelectorAll('.reveal[data-split]');

    reveals.forEach(el => {
      const splitType = el.dataset.split;
      if (splitType === 'none' || !el.textContent.trim()) return;

      const text = el.textContent;
      let html = '';

      if (splitType === 'words') {
        const words = text.split(/\s+/);
        html = words.map(word => `<span>${word}</span>`).join(' ');
      } else if (splitType === 'lines') {
        const lines = text.split(/\n+/);
        html = lines.map(line => `<span>${line.trim()}</span>`).join('');
      }

      if (html) {
        el.innerHTML = html;

        // Wrap spans to create word containers
        const spans = el.querySelectorAll('span');
        spans.forEach(span => {
          const wrapper = document.createElement('span');
          wrapper.style.display = splitType === 'lines' ? 'block' : 'inline-block';
          wrapper.style.overflow = 'hidden';
          wrapper.appendChild(span.cloneNode(true));
          span.replaceWith(wrapper);
        });
      }
    });
  }

  // ========================================================================
  // 2. SCROLL TRIGGER ANIMATIONS (reveal on scroll)
  // ========================================================================
  function initScrollAnimations() {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded, skipping scroll animations');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Animate all .reveal elements on scroll
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((reveal, idx) => {
      // Skip hero section (already animated)
      if (reveal.closest('.hero')) return;

      gsap.fromTo(
        reveal,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: reveal,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none none',
            once: true,
            threshold: 0.05,
            markers: false, // disable in production
          },
          onComplete: () => {
            reveal.classList.add('in-view');
          },
        }
      );
    });

    // Safety timeout: reveal anything still hidden after 6s
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.5 });
        el.classList.add('in-view');
      });
    }, 6000);
  }

  // ========================================================================
  // 3. SMOOTH SCROLL TO ANCHOR
  // ========================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ========================================================================
  // 4. HERO ANIMATION ON LOAD
  // ========================================================================
  function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;

    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCred = document.querySelector('.hero-cred');
    const heroVisual = document.querySelector('.hero-visual');
    const ctaPrimary = document.querySelector('.cta-primary');

    if (heroTitle) {
      gsap.timeline()
        .fromTo(
          heroTitle,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          0
        )
        .fromTo(
          heroSubtitle,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          0.15
        )
        .fromTo(
          heroCred,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          0.3
        )
        .fromTo(
          ctaPrimary,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          0.4
        )
        .fromTo(
          heroVisual,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
          0.45
        );
    }
  }

  // ========================================================================
  // 5. HOVER EFFECTS ON COURSE CARDS
  // ========================================================================
  function initCourseCardHovers() {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            y: -8,
            boxShadow: '0 12px 30px rgba(139, 115, 85, 0.15)',
            duration: 0.3,
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            y: 0,
            boxShadow: '0 4px 12px rgba(139, 115, 85, 0.05)',
            duration: 0.3,
          });
        }
      });
    });
  }

  // ========================================================================
  // 6. PARALLAX ON HERO VISUAL (optional, gentle)
  // ========================================================================
  function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    gsap.to(heroVisual, {
      y: (window.innerHeight - heroVisual.getBoundingClientRect().top) * -0.1,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        markers: false,
      },
    });
  }

  // ========================================================================
  // 7. CTA BUTTON HOVER EFFECT
  // ========================================================================
  function initCTAHovers() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-course, .btn');
    ctaButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            scale: 1.05,
            duration: 0.2,
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            scale: 1,
            duration: 0.2,
          });
        }
      });
    });
  }

  // ========================================================================
  // 8. INTERSECTION OBSERVER FOR LAZY ANIMATIONS
  // ========================================================================
  function initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('reveal')) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });

    // Safety: unobserve everything after 6s to avoid hanging
    setTimeout(() => {
      observer.disconnect();
    }, 6000);
  }

  // ========================================================================
  // 9. LAZY LOAD IMAGES (if any)
  // ========================================================================
  function initLazyLoad() {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // ========================================================================
  // 10. LOG INITIALIZATION
  // ========================================================================
  function initLog() {
    console.log('✓ Javier Sotelo Landing Page loaded');
  }

  // ========================================================================
  // MAIN INIT: Run all on DOM ready
  // ========================================================================
  function initAll() {
    safe(() => initSplitText(), 'splitText');
    safe(() => initHeroAnimation(), 'heroAnimation');
    safe(() => initSmoothScroll(), 'smoothScroll');
    safe(() => initCourseCardHovers(), 'courseCardHovers');
    safe(() => initCTAHovers(), 'ctaHovers');
    safe(() => initScrollAnimations(), 'scrollAnimations');
    safe(() => initParallax(), 'parallax');
    safe(() => initIntersectionObserver(), 'intersectionObserver');
    safe(() => initLazyLoad(), 'lazyLoad');
    safe(() => initLog(), 'log');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
