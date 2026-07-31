/* ============================================================
   FLORES EL VIEJÓN — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('is-locked');

  initPreloader();
  initHeaderScroll();
  initMobileNav();
  initRevealObserver();
  initTypewriter();
  initParticles();
  initParallax();
  initCounters();
  initWhatsappForm();
  initFooterYear();
});

/* ---------------- Preloader ---------------- */
function initPreloader() {
  const MIN_TIME = 1900;
  const start = Date.now();

  const finish = () => {
    const elapsed = Date.now() - start;
    const wait = Math.max(MIN_TIME - elapsed, 0);
    setTimeout(() => {
      document.documentElement.classList.add('loaded');
      document.documentElement.classList.remove('is-locked');
      setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) loader.style.display = 'none';
      }, 1300);
    }, wait);
  };

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
    setTimeout(finish, 3500); // safety fallback
  }
}

/* ---------------- Header scroll state ---------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const toggle = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------------- Mobile nav ---------------- */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

/* ---------------- Scroll reveal ---------------- */
function initRevealObserver() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------- Typewriter ---------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'ramos con carácter',
    'arreglos para bodas',
    'detalles de cumpleaños',
    'flores para toda ocasión',
    'entregas puntuales, palabra de honor',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = words[wordIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  };

  tick();
}

/* ---------------- Particles ---------------- */
function initParticles() {
  const canvases = [
    document.getElementById('particles-canvas'),
    ...document.querySelectorAll('[data-particles]'),
  ].filter(Boolean);

  if (!canvases.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  canvases.forEach((canvas) => setupParticleField(canvas));
}

function setupParticleField(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height, dpr;
  let rafId;

  const colors = ['rgba(46,79,115,.55)', 'rgba(217,164,65,.7)', 'rgba(94,133,172,.5)', 'rgba(239,200,118,.65)'];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const count = Math.max(14, Math.min(40, Math.round((width * height) / 32000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 4,
      speed: 0.15 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 0.4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.sway += p.swaySpeed;
      p.y -= p.speed;
      p.x += p.drift + Math.sin(p.sway) * 0.3;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  window.addEventListener('resize', resize, { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!rafId) draw();
      } else {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }, { threshold: 0.05 });
  io.observe(canvas.parentElement);
}

/* ---------------- Parallax (transform-based, mobile-safe) ---------------- */
function initParallax() {
  const banners = document.querySelectorAll('[data-parallax]');
  if (!banners.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = Array.from(banners).map((banner) => ({
    banner,
    bg: banner.querySelector('[data-parallax-bg]'),
  })).filter((l) => l.bg);

  let ticking = false;

  function update() {
    const vh = window.innerHeight;
    layers.forEach(({ banner, bg }) => {
      const rect = banner.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (rect.top) / vh; // -1..1 roughly
      const offset = progress * 60;
      bg.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ---------------- Counters ---------------- */
function initCounters() {
  const items = document.querySelectorAll('.stat-number');
  if (!items.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count || '0');
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value)) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  items.forEach((item) => observer.observe(item));
}

/* ---------------- Contact form -> WhatsApp ---------------- */
function initWhatsappForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WHATSAPP_NUMBER = '5215555555555'; // TODO: reemplazar por el número real del negocio

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const occasion = form.occasion.value;
    const date = form.date.value;
    const message = form.message.value.trim();

    let text = `Hola Flores El Viejón, quisiera solicitar una cotización.\n`;
    text += `Nombre: ${name}\n`;
    text += `Teléfono: ${phone}\n`;
    text += `Ocasión: ${occasion}\n`;
    if (date) text += `Fecha de entrega deseada: ${date}\n`;
    if (message) text += `Mensaje: ${message}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
}

/* ---------------- Footer year ---------------- */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
