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
    '.project-card',
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
})();
