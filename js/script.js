/* =============================================
   PERFECT ROOFTOP SOLAR — JS Engine
   GSAP + ScrollTrigger + AOS + Interactions
   ============================================= */

// ---- PRELOADER ----
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        document.body.style.overflow = 'auto';
        initHeroAnimations();
      }
    });
  } else {
    initHeroAnimations();
  }
});

// ---- AOS INIT ----
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
  disable: false
});

// ---- SCROLL PROGRESS BAR ----
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (scrollProgress) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }
});

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Hamburger toggle
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');

    if (mobileMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
      // Animate mobile links
      const links = mobileMenu.querySelectorAll('.mobile-menu-links a');
      gsap.fromTo(links,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.15
        }
      );
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  });
}

// ---- HERO ANIMATIONS ----
function initHeroAnimations() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge', { opacity: 0, y: 30, duration: 0.6 })
    .from('.hero-title', { opacity: 0, y: 50, duration: 0.8 }, '-=0.3')
    .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
    .from('.hero-buttons', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3')
    .from('.hero-stats .hero-stat', {
      opacity: 0,
      y: 40,
      duration: 0.5,
      stagger: 0.15
    }, '-=0.2')
    .from('.scroll-indicator', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2');

  // Parallax effect on hero BG
  const heroBg = heroSection.querySelector('.hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Floating sun circle
  const sunCircle = heroSection.querySelector('.sun-circle');
  if (sunCircle) {
    gsap.to(sunCircle, {
      y: 30,
      x: -20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
}

// ---- COUNTER ANIMATION ----
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    if (counter.dataset.animated) return;

    const target = parseInt(counter.dataset.target);
    const duration = target > 1000 ? 2.5 : 2;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        counter.textContent = Math.floor(obj.val).toLocaleString();
      },
      scrollTrigger: {
        trigger: counter,
        start: 'top 85%',
        once: true
      }
    });

    counter.dataset.animated = 'true';
  });
}

// Run counter animations
animateCounters();

// ---- GSAP SCROLLTRIGGER ANIMATIONS ----
gsap.registerPlugin(ScrollTrigger);

// Section reveal animations
document.querySelectorAll('.section-header').forEach(header => {
  gsap.from(header, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: header,
      start: 'top 85%',
      once: true
    }
  });
});

// About section image reveal
const aboutImg = document.querySelector('.about-image-wrapper');
if (aboutImg) {
  gsap.from(aboutImg, {
    clipPath: 'inset(0 100% 0 0)',
    duration: 1.2,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: aboutImg,
      start: 'top 75%',
      once: true
    }
  });
}

// Solution cards parallax glow
document.querySelectorAll('.solution-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
  });
});

// Timeline steps sequential animation
const processSteps = document.querySelectorAll('.process-step');
processSteps.forEach((step, i) => {
  gsap.from(step, {
    opacity: 0,
    y: 60,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: step,
      start: 'top 85%',
      once: true
    },
    delay: i * 0.15
  });
});

// Timeline line animation
const timelineLine = document.querySelector('.process-timeline::before');
const processTimeline = document.querySelector('.process-timeline');
if (processTimeline) {
  gsap.from(processTimeline, {
    '--line-height': '0%',
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: processTimeline,
      start: 'top 70%',
      once: true
    }
  });
}

// Gallery image reveal
document.querySelectorAll('.gallery-item').forEach((item, i) => {
  gsap.from(item, {
    opacity: 0,
    scale: 0.85,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 90%',
      once: true
    },
    delay: i * 0.08
  });
});

// ---- 3D TILT EFFECT ----
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xCenter = rect.width / 2;
    const yCenter = rect.height / 2;

    const rotateX = ((y - yCenter) / yCenter) * -8;
    const rotateY = ((x - xCenter) / xCenter) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ---- LIGHTBOX ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentGalleryIndex = 0;
let galleryImages = [];

document.querySelectorAll('.gallery-item').forEach((item, index) => {
  const img = item.querySelector('img');
  if (img) {
    galleryImages.push(img.src);
    item.addEventListener('click', () => {
      currentGalleryIndex = index;
      openLightbox(img.src);
    });
  }
});

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = 'auto';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
  if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
});

// ---- TESTIMONIAL SLIDER ----
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialDots = document.getElementById('testimonialDots');
let currentSlide = 0;
let testimonialCount = 0;
let testimonialAutoplay;

if (testimonialTrack) {
  const slides = testimonialTrack.querySelectorAll('.testimonial-card');
  testimonialCount = slides.length;

  // Create dots
  if (testimonialDots) {
    for (let i = 0; i < testimonialCount; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      testimonialDots.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentSlide = index;
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    if (!testimonialDots) return;
    testimonialDots.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonialCount;
    goToSlide(currentSlide);
  }

  // Autoplay
  testimonialAutoplay = setInterval(nextSlide, 5000);

  // Pause on hover
  testimonialTrack.addEventListener('mouseenter', () => clearInterval(testimonialAutoplay));
  testimonialTrack.addEventListener('mouseleave', () => {
    testimonialAutoplay = setInterval(nextSlide, 5000);
  });
}

// ---- RIPPLE EFFECT ----
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const wave = document.createElement('span');
    wave.classList.add('ripple-wave');
    wave.style.left = x + 'px';
    wave.style.top = y + 'px';
    this.appendChild(wave);

    setTimeout(() => wave.remove(), 600);
  });
});

// ---- BACK TO TOP ----
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ---- FORM SUBMISSION ----
const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = enquiryForm.querySelector('button[type="submit"]');
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
        enquiryForm.reset();
      }, 2500);
    }, 1500);
  });
}

// Contact form (contact page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 2500);
    }, 1500);
  });
}

// ---- PARALLAX SECTIONS ----
document.querySelectorAll('[data-parallax]').forEach(el => {
  gsap.to(el, {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});

// ---- PAGE HEADER ANIMATION (inner pages) ----
const pageHeader = document.querySelector('.page-header');
if (pageHeader) {
  const phTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  phTl.from('.page-breadcrumb', { opacity: 0, y: 20, duration: 0.5, delay: 0.3 })
    .from('.page-header h1', { opacity: 0, y: 40, duration: 0.7 }, '-=0.2')
    .from('.page-header p', { opacity: 0, y: 30, duration: 0.5 }, '-=0.3');
}

// ---- CAPACITY CARDS HOVER (homes/commercial pages) ----
document.querySelectorAll('.capacity-card').forEach(card => {
  gsap.from(card, {
    opacity: 0,
    y: 50,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      once: true
    }
  });
});

// ---- INDUSTRY CARDS ANIMATION ----
document.querySelectorAll('.industry-card').forEach((card, i) => {
  gsap.from(card, {
    opacity: 0,
    scale: 0.9,
    y: 30,
    duration: 0.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 88%',
      once: true
    },
    delay: i * 0.1
  });
});

// ---- MAP FADE IN (contact page) ----
const contactMap = document.querySelector('.contact-map');
if (contactMap) {
  gsap.from(contactMap, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: contactMap,
      start: 'top 80%',
      once: true
    }
  });
}

// ---- ACTIVE NAV LINK HIGHLIGHT ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else if (!href.startsWith('#')) {
    link.classList.remove('active');
  }
});
