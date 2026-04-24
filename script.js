/* ============================================
   BIOSTAR - Main JavaScript
   ============================================ */

// ---- Navbar: scroll effect + active link ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link on scroll
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

// ---- Mobile Menu Toggle ----
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
const navCta = document.querySelector('.nav-cta');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
  if (navCta) navCta.classList.toggle('open');
});

// Close menu when a link is clicked
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    if (navCta) navCta.classList.remove('open');
  });
});

// ---- Smooth Scrolling ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Back to Top ----
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Scroll Reveal Animation ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger delay for grid children
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((el, i) => {
        if (el === entry.target) delay = i * 100;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Contact Form Validation ----
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
    .forEach(el => el.style.borderColor = '');

  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const projectType = document.getElementById('projectType');
  const message = document.getElementById('message');

  // Validate Full Name
  if (!fullName.value.trim()) {
    showError('nameError', fullName, 'Full name is required.');
    valid = false;
  } else if (fullName.value.trim().length < 2) {
    showError('nameError', fullName, 'Name must be at least 2 characters.');
    valid = false;
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showError('emailError', email, 'Email address is required.');
    valid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    showError('emailError', email, 'Please enter a valid email address.');
    valid = false;
  }

  // Validate Project Type
  if (!projectType.value) {
    showError('projectError', projectType, 'Please select a project type.');
    valid = false;
  }

  // Validate Message
  if (!message.value.trim()) {
    showError('messageError', message, 'Message is required.');
    valid = false;
  } else if (message.value.trim().length < 10) {
    showError('messageError', message, 'Message must be at least 10 characters.');
    valid = false;
  }

  if (valid) {
    // Simulate form submission
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      contactForm.reset();
      const successEl = document.getElementById('formSuccess');
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 5000);
    }, 1800);
  }
});

function showError(errorId, inputEl, message) {
  document.getElementById(errorId).textContent = message;
  inputEl.style.borderColor = '#ff4d6d';
  inputEl.style.boxShadow = '0 0 0 3px rgba(255,77,109,0.15)';
}

// Clear error on input
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
  .forEach(el => {
    el.addEventListener('input', function () {
      this.style.borderColor = '';
      this.style.boxShadow = '';
    });
  });

// ---- Button Ripple Effect ----
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ---- Animated Counter for Stats ----
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + '+';
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      const targets = [50, 30, 3];
      statNumbers.forEach((el, i) => {
        animateCounter(el, targets[i]);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ---- Dark / Light Mode Toggle ----
const themeToggle = document.getElementById('themeToggle');
const iconDark = themeToggle.querySelector('.theme-icon-dark');
const iconLight = themeToggle.querySelector('.theme-icon-light');

// Load saved preference
if (localStorage.getItem('biostar-theme') === 'light') {
  document.body.classList.add('light-mode');
  iconDark.style.display = 'none';
  iconLight.style.display = 'block';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');

  if (isLight) {
    iconDark.style.display = 'none';
    iconLight.style.display = 'block';
    localStorage.setItem('biostar-theme', 'light');
  } else {
    iconDark.style.display = 'block';
    iconLight.style.display = 'none';
    localStorage.setItem('biostar-theme', 'dark');
  }
});
