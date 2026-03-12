/* ==============================================
   PERFECT ROOFTOP SOLAR — Optimized JS Engine
   Single Intersection Observer for all scroll animations
   Hardware-accelerated transforms only
   ============================================== */

(function () {
  'use strict';

  /* ---- PRELOADER ---- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('hide');
    }, 1200);
  });

  /* ---- SCROLL PROGRESS BAR ---- */
  var scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = ((scrollTop / docHeight) * 100) + '%';
    }, { passive: true });
  }

  /* ---- NAVBAR SCROLL EFFECT ---- */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ---- HAMBURGER MOBILE MENU ---- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ====================================================
     UNIFIED ANIMATION SYSTEM
     Single Intersection Observer handles ALL scroll animations:
     - [data-reveal] attributes (up, down, left, right, scale)
     - .fade-in, .slide-in-*, .scale-in classes
     - .product-modern cards
     - .stagger-item elements
     - .reveal-up legacy class
     Respects prefers-reduced-motion
     ==================================================== */

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Collect ALL animated elements across the page
  var allAnimated = document.querySelectorAll(
    '[data-reveal], .fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down, .scale-in, .product-modern, .stagger-item, .reveal-up'
  );

  if (allAnimated.length > 0) {
    if (prefersReducedMotion) {
      // Immediately show everything if reduced motion is preferred
      allAnimated.forEach(function (el) {
        el.classList.add('revealed', 'active', 'show', 'reveal-active');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    } else {
      // Set up stagger delays for .stagger-item elements
      var staggerGroups = {};
      document.querySelectorAll('.stagger-item').forEach(function (item) {
        var parent = item.parentElement;
        if (!staggerGroups[parent]) {
          staggerGroups[parent] = [];
        }
        staggerGroups[parent].push(item);
      });
      Object.values(staggerGroups).forEach(function (items) {
        items.forEach(function (item, index) {
          if (!item.style.transitionDelay) {
            item.style.transitionDelay = (index * 0.1) + 's';
          }
        });
      });

      // Single observer for ALL animated elements
      var animObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;

            // Apply the appropriate active class based on the element type
            if (el.hasAttribute('data-reveal')) {
              el.classList.add('revealed');
            }
            if (el.classList.contains('product-modern')) {
              el.classList.add('show');
            }
            if (el.classList.contains('reveal-up')) {
              el.classList.add('reveal-active');
            }
            // For .fade-in, .slide-in-*, .scale-in, .stagger-item
            el.classList.add('active');

            // Animate once — unobserve after triggering
            animObserver.unobserve(el);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      allAnimated.forEach(function (el) {
        animObserver.observe(el);
      });
    }
  }

  /* ---- COUNTER ANIMATION ---- */
  var counterCards = document.querySelectorAll('.counter-card');
  if (counterCards.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var counter = entry.target.querySelector('.counter');
          if (counter && !counter.classList.contains('animated')) {
            var target = parseInt(counter.dataset.target, 10);
            var duration = 1000;
            var increment = target / (duration / 16);
            var current = 0;
            var update = function () {
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
    counterCards.forEach(function (card) { counterObserver.observe(card); });
  }

  /* ---- TESTIMONIAL CAROUSEL (Pure JS) ---- */
  var testimonialTrack = document.querySelector('.testimonial-track');
  var prevBtn = document.querySelector('.carousel-prev');
  var nextBtn = document.querySelector('.carousel-next');

  if (testimonialTrack) {
    var currentSlide = 0;
    var slides = testimonialTrack.querySelectorAll('.testimonial-slide');
    var totalSlides = slides.length;

    function getSlidesPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 992) return 2;
      return 3;
    }

    function goToSlide(index) {
      var perView = getSlidesPerView();
      var maxIndex = Math.max(0, totalSlides - perView);
      currentSlide = Math.min(Math.max(index, 0), maxIndex);
      var offset = (currentSlide / totalSlides) * 100;
      testimonialTrack.style.transform = 'translateX(-' + offset + '%)';
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); });

    // Autoplay
    var autoplay = setInterval(function () {
      var perView = getSlidesPerView();
      var maxIndex = Math.max(0, totalSlides - perView);
      currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
      goToSlide(currentSlide);
    }, 4000);

    // Pause on hover
    testimonialTrack.addEventListener('mouseenter', function () { clearInterval(autoplay); });
    testimonialTrack.addEventListener('mouseleave', function () {
      autoplay = setInterval(function () {
        var perView = getSlidesPerView();
        var maxIndex = Math.max(0, totalSlides - perView);
        currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
        goToSlide(currentSlide);
      }, 4000);
    });

    // Recalculate on resize
    window.addEventListener('resize', function () { goToSlide(currentSlide); });
  }

  /* ---- RIPPLE EFFECT ---- */
  document.querySelectorAll('.ripple, .btn-primary, .btn-outline').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (prefersReducedMotion) return;
      var rect = this.getBoundingClientRect();
      var wave = document.createElement('span');
      wave.classList.add('ripple-wave');
      wave.style.left = (e.clientX - rect.left) + 'px';
      wave.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(wave);
      setTimeout(function () { wave.remove(); }, 600);
    });
  });

  /* ---- BACK TO TOP ---- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ---- FORM SUBMISSION ---- */
  function handleForm(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        setTimeout(function () {
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
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (!href.startsWith('#')) {
      link.classList.remove('active');
    }
  });

  /* ---- HERO PARALLAX ---- */
  var heroSection = document.querySelector('.hero');
  var heroImage = document.querySelector('.hero-image img');
  if (heroSection && heroImage && !prefersReducedMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrolled = window.scrollY;
          var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          if (scrolled < heroBottom) {
            heroImage.style.transform = 'translateY(' + (scrolled * 0.08) + 'px)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

})();
