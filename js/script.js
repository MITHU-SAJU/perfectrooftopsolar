/* ==============================================
   PERFECT ROOFTOP SOLAR — Optimized JS Engine
   - Removed: AOS, GSAP, ScrollTrigger, Swiper
   - Uses: Intersection Observer for scroll animations
   - Hardware-accelerated transforms only
   ============================================== */

(function () {
  'use strict';

  /* ---- PRELOADER ---- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("preloader").classList.add("hide");
    }, 1200);
  });

  /* ---- SCROLL PROGRESS BAR ---- */
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = ((scrollTop / docHeight) * 100) + '%';
    }, { passive: true });
  }

  /* ---- NAVBAR SCROLL EFFECT ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ---- HAMBURGER MOBILE MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ====================================================
     ENHANCED ANIMATION SYSTEM — Scroll-Based Animations
     Supports fade, slide, stagger, and repeat-on-scroll
     ==================================================== */

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Universal Animation Observer
   * Handles all scroll-triggered animations (fade, slide, stagger, scale)
   * Data attributes: data-animation, data-repeat, data-delay, data-threshold
   */
  function initAnimationObserver() {
    // Select all elements with animation classes or data-animation attribute
    const animatedElements = document.querySelectorAll(
      '[class*="fade-in"], [class*="fade-out"], [class*="slide-in"], [class*="slide-out"], [class*="scale-in"], [class*="scale-out"], [data-animation]'
    );

    if (animatedElements.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const repeatMode = entry.target.dataset.repeat || 'once';
        const shouldAnimate = entry.isIntersecting;

        // Apply reduced motion setting
        if (prefersReducedMotion) {
          if (shouldAnimate) {
            entry.target.classList.add('active');
          }
          return;
        }

        if (shouldAnimate) {
          // Trigger animation
          entry.target.classList.add('active');

          // Only animate once unless data-repeat="scroll" is set
          if (repeatMode === 'once') {
            animationObserver.unobserve(entry.target);
          }
        } else if (repeatMode === 'scroll') {
          // Allow fade-out when leaving viewport (optional reverse animation)
          entry.target.classList.remove('active');
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      // Set initial state for elements (already handled by CSS, but can be explicitly set)
      if (!el.classList.contains('active')) {
        animationObserver.observe(el);
      }
    });
  }

  /**
   * Stagger Animation Handler
   * Automatically adds incremented delays to .stagger-item elements
   */
  function initStaggerAnimations() {
    const staggerGroups = document.querySelectorAll('[class*="stagger"]');

    staggerGroups.forEach(group => {
      const items = group.querySelectorAll('.stagger-item');
      items.forEach((item, index) => {
        // Set CSS custom property for stagger timing
        item.style.setProperty('--stagger-index', index);
        // Also apply transition delays programmatically as fallback
        item.style.transitionDelay = `${index * 0.1}s`;
      });
    });

    // Also handle direct .stagger-item elements (not in a group)
    const directStaggerItems = document.querySelectorAll('.stagger-item:not([class*="stagger-"])');
    directStaggerItems.forEach((item, index) => {
      item.style.setProperty('--stagger-index', index);
      item.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  /**
   * Data Attribute Animation Support
   * Allows using data-animation="fade-in" instead of class names
   */
  function initDataAttributeAnimations() {
    const dataAnimElements = document.querySelectorAll('[data-animation]');

    dataAnimElements.forEach(el => {
      const animationType = el.dataset.animation;
      const duration = el.dataset.duration;
      const delay = el.dataset.delay;

      // Apply animation class based on data attribute
      if (animationType) {
        el.classList.add(animationType);
      }

      // Apply duration class if specified
      if (duration) {
        if (duration === 'fast') el.classList.add('anim-fast');
        else if (duration === 'slow') el.classList.add('anim-slow');
        else el.classList.add('anim-normal');
      }

      // Apply delay if specified
      if (delay) {
        el.style.transitionDelay = `${parseInt(delay)}ms`;
      }
    });
  }

  // Initialize all animation systems
  if (!prefersReducedMotion) {
    initAnimationObserver();
    initStaggerAnimations();
    initDataAttributeAnimations();
  } else {
    // If reduced motion is preferred, immediately show all elements
    document.querySelectorAll(
      '[class*="fade-in"], [class*="fade-out"], [class*="slide-in"], [class*="slide-out"], [class*="scale-in"], [class*="scale-out"]'
    ).forEach(el => {
      el.classList.add('active');
    });
  }

  /**
   * Legacy Support: Original [data-reveal] system
   * Kept for backward compatibility
   */
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); // Animate once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ---- COUNTER ANIMATION (Intersection Observer) ---- */
  const counterCards = document.querySelectorAll('.counter-card');
  if (counterCards.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target.querySelector('.counter');
          if (counter && !counter.classList.contains('animated')) {
            const target = parseInt(counter.dataset.target, 10);
            const duration = 1000;
            const increment = target / (duration / 16);
            let current = 0;
            const update = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(update);
              } else {
                counter.textContent = target.toLocaleString();
              }
            };
            update();
            counter.classList.add('animated');
          }
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterCards.forEach(card => counterObserver.observe(card));
  }

  /* ====================================================
     TESTIMONIAL CAROUSEL (Pure JS, no Swiper)
     ==================================================== */
  const testimonialTrack = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (testimonialTrack) {
    let currentSlide = 0;
    const slides = testimonialTrack.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;

    function getSlidesPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 992) return 2;
      return 3;
    }

    function goToSlide(index) {
      const perView = getSlidesPerView();
      const maxIndex = Math.max(0, totalSlides - perView);
      currentSlide = Math.min(Math.max(index, 0), maxIndex);
      const offset = (currentSlide / totalSlides) * 100;
      testimonialTrack.style.transform = `translateX(-${offset}%)`;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Autoplay
    let autoplay = setInterval(() => {
      const perView = getSlidesPerView();
      const maxIndex = Math.max(0, totalSlides - perView);
      currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
      goToSlide(currentSlide);
    }, 4000);

    // Pause on hover
    testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoplay));
    testimonialTrack.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => {
        const perView = getSlidesPerView();
        const maxIndex = Math.max(0, totalSlides - perView);
        currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
        goToSlide(currentSlide);
      }, 4000);
    });

    // Recalculate on resize
    window.addEventListener('resize', () => goToSlide(currentSlide));
  }

  /* ---- RIPPLE EFFECT ON BUTTONS ---- */
  document.querySelectorAll('.ripple, .btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = this.getBoundingClientRect();
      const wave = document.createElement('span');
      wave.classList.add('ripple-wave');
      wave.style.left = (e.clientX - rect.left) + 'px';
      wave.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(wave);
      setTimeout(() => wave.remove(), 600);
    });
  });

  /* ---- BACK TO TOP ---- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ---- FORM SUBMISSION HANDLING ---- */
  function handleForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 2500);
      }, 1500);
    });
  }
  handleForm('enquiryForm');
  handleForm('contactForm');

  /* ---- ACTIVE NAV LINK HIGHLIGHT ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (!href.startsWith('#')) {
      link.classList.remove('active');
    }
  });

  /* ---- HERO PARALLAX (subtle transform on scroll) ---- */
  const heroSection = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image img');
  if (heroSection && heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          if (scrolled < heroBottom) {
            // Slow parallax shift for depth effect
            heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

})();
