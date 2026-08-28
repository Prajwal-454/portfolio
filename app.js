import { animate, stagger, splitText } from 'animejs';

(() => {
  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // --- Photo fade: hero fades out, about fades in ---
  const heroPhoto = document.getElementById('heroPhoto');
  const aboutPhoto = document.getElementById('aboutPhoto');

  function updatePhotoFade() {
    const heroRect = heroPhoto.getBoundingClientRect();
    const aboutRect = aboutPhoto.getBoundingClientRect();
    const vh = window.innerHeight;

    // Hero photo fades out when its center passes 30% from top
    const heroCenterY = heroRect.top + heroRect.height / 2;
    if (heroCenterY < vh * 0.15) {
      heroPhoto.classList.add('faded');
    } else {
      heroPhoto.classList.remove('faded');
    }

    // About photo fades in when it enters the viewport
    if (aboutRect.top < vh * 0.85) {
      aboutPhoto.classList.add('visible');
    } else {
      aboutPhoto.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updatePhotoFade, { passive: true });
  // Initial check
  updatePhotoFade();

  // --- Mobile menu ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll reveal with stagger ---
  const revealGroups = [
    { selector: '.detail-card', parent: '.about-details' },
    { selector: '.skill-group', parent: '.skills-grid' },
    { selector: '.cert-card', parent: '.cert-grid' },
    { selector: '.contact-card', parent: '.contact-grid' },
  ];

  revealGroups.forEach(({ selector }) => {
    const items = document.querySelectorAll(selector);
    items.forEach((el, i) => {
      el.classList.add('reveal', `stagger-${Math.min(i + 1, 6)}`);
    });
  });

  const singleRevealSelectors = [
    '.timeline-item',
    '.hack-card',
    '.about-text',
  ];

  singleRevealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- Smooth active nav link ---
  const sections = document.querySelectorAll('.section, .hero-section');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 250;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + current;
      link.style.color = isActive ? '#111' : '';
    });
  }, { passive: true });

  // --- Magnetic hover on buttons ---
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translateY(-3px) translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // --- Anime.js Text Animation for Headers & Buttons ---
  const { chars } = splitText('h2, .btn', { words: false, chars: true });

  animate(chars, {
    // Property keyframes
    y: [
      { to: '-2.75rem', ease: 'outExpo', duration: 600 },
      { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
    ],
    // Property specific parameters
    rotate: {
      from: '-1turn',
      delay: 0
    },
    delay: stagger(50),
    ease: 'inOutCirc',
    loopDelay: 1000,
    loop: true
  });

  // --- Infinite Carousel ---
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const cards = carouselTrack.querySelectorAll('.project-card');
      const speed = 0.5;
      let position = 0;
      let paused = false;
      let resetting = false;

      function getTotalWidth() {
        let w = 0;
        const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 24;
        cards.forEach(card => { w += card.offsetWidth; });
        return w + gap * (cards.length - 1);
      }

      function getStartOffset() {
        return carouselTrack.parentElement.offsetWidth;
      }

      position = getStartOffset();
      carouselTrack.style.transform = `translateX(${position}px)`;

      function animate() {
        if (!paused && !resetting) {
          position -= speed;
          const totalWidth = getTotalWidth();
          const lastCardExit = -(getTotalWidth() - cards[cards.length - 1].offsetWidth -
            (parseFloat(getComputedStyle(carouselTrack).gap) || 24));
          if (totalWidth > 0 && position <= lastCardExit) {
            resetting = true;
            carouselTrack.style.transition = 'opacity 0.25s ease';
            carouselTrack.style.opacity = '0';
            setTimeout(() => {
              position = getStartOffset();
              carouselTrack.style.transform = `translateX(${position}px)`;
              requestAnimationFrame(() => {
                carouselTrack.style.opacity = '1';
                setTimeout(() => {
                  carouselTrack.style.transition = '';
                  resetting = false;
                }, 250);
              });
            }, 250);
          } else {
            carouselTrack.style.transform = `translateX(${position}px)`;
          }
        }
        requestAnimationFrame(animate);
      }

      carouselTrack.addEventListener('mouseenter', () => { paused = true; });
      carouselTrack.addEventListener('mouseleave', () => { paused = false; });
      carouselTrack.addEventListener('touchstart', () => { paused = true; }, { passive: true });
      carouselTrack.addEventListener('touchend', () => { paused = false; }, { passive: true });

      requestAnimationFrame(animate);
    }
  }
})();
