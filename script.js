/* ═══════════════════════════════════════════════════════
   YUDHISTIRA GILANG — Portfolio Script
   Features: cursor, nav, reveal, skill bars, dark/light mode
═══════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════
// DARK / LIGHT MODE
// ══════════════════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved preference (default: dark)
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
if (savedTheme === 'light') body.classList.add('light');

// Toggle handler
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');

  // Ripple effect on toggle button
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:absolute; width:80px; height:80px; border-radius:50%;
    background:${isLight ? 'rgba(200,93,24,0.2)' : 'rgba(230,120,50,0.2)'};
    top:50%; left:50%; transform:translate(-50%,-50%) scale(0);
    animation: rippleAnim 0.5s ease-out forwards; pointer-events:none;
  `;
  themeToggle.style.position = 'relative';
  themeToggle.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
});

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim { to { transform: translate(-50%,-50%) scale(1); opacity: 0; } }`;
document.head.appendChild(style);

// ══════════════════════════════════════════════════════
// CUSTOM CURSOR
// ══════════════════════════════════════════════════════
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
});
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if (cursorFollower) {
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
  }
  requestAnimationFrame(animateFollower);
}
animateFollower();

const hoverables = document.querySelectorAll('a, button, .project-card, .soft-skill, .theme-toggle');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    if (cursorFollower) {
      cursorFollower.style.width = '50px'; cursorFollower.style.height = '50px';
      cursorFollower.style.borderColor = 'rgba(230,120,50,0.8)';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    if (cursorFollower) {
      cursorFollower.style.width = '32px'; cursorFollower.style.height = '32px';
      cursorFollower.style.borderColor = 'rgba(230,120,50,0.5)';
    }
  });
});

// ══════════════════════════════════════════════════════
// NAVIGATION SCROLL
// ══════════════════════════════════════════════════════
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ══════════════════════════════════════════════════════
// HAMBURGER MENU
// ══════════════════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ══════════════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3').forEach(el => {
  revealObserver.observe(el);
});

// ══════════════════════════════════════════════════════
// ECO BAR CHART ANIMATION
// ══════════════════════════════════════════════════════
document.querySelectorAll('.eco-bar').forEach(bar => {
  const target = bar.style.width;
  bar.setAttribute('data-target', target);
  bar.style.width = '0';
});
const ecoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.eco-bar').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.getAttribute('data-target'); }, 200 + i * 300);
      });
      ecoObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const ecoChart = document.querySelector('.eco-chart');
if (ecoChart) ecoObserver.observe(ecoChart);

// ══════════════════════════════════════════════════════
// SKILL BAR ANIMATION
// ══════════════════════════════════════════════════════
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  const width = bar.getAttribute('data-width');
  bar.style.width = '0';
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(bar.parentElement);
});

// ══════════════════════════════════════════════════════
// SMOOTH SCROLL
// ══════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ══════════════════════════════════════════════════════
// ACTIVE NAV HIGHLIGHT
// ══════════════════════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) link.style.color = 'var(--cream)';
      });
    }
  });
}, { passive: true });

// ══════════════════════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════════════════════
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Mengirim...'; btn.style.opacity = '0.7'; btn.disabled = true;
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'flex';
    }, 1500);
  });
}

// ══════════════════════════════════════════════════════
// HERO INITIAL REVEAL
// ══════════════════════════════════════════════════════
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal, .hero .reveal-delay-1, .hero .reveal-delay-2, .hero .reveal-delay-3').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
});

// ══════════════════════════════════════════════════════
// PARALLAX HERO BG TEXT
// ══════════════════════════════════════════════════════
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBgText.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

// ══════════════════════════════════════════════════════
// PROJECT CARD TILT
// ══════════════════════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rotX = ((y - rect.height / 2) / rect.height) * -4;
    const rotY = ((x - rect.width / 2) / rect.width) * 4;
    card.style.transform = `translateY(-5px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ══════════════════════════════════════════════════════
// CONSOLE EASTER EGG
// ══════════════════════════════════════════════════════
console.log('%cYudhistira Gilang Narendratama', 'color:#e67832;font-family:Montserrat,sans-serif;font-size:20px;font-weight:900;');
console.log('%cTeknik Infrastruktur Sipil — ITS Surabaya 2022', 'color:#f0ead8;font-size:12px;');
console.log('%c✉ yudhistira.ygn@gmail.com', 'color:#888;font-size:11px;');
