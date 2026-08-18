// ── THEME TOGGLE ──
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const icons = { light: '🌙', dark: '☀️' };

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeToggle.textContent = icons[theme];
  localStorage.setItem('theme', theme);
}

// Load saved or default to light
applyTheme(localStorage.getItem('theme') || 'light');

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── CURSOR GLOW ──
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── PARTICLE CANVAS ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + .3,
    dx: (Math.random() - .5) * .3,
    dy: (Math.random() - .5) * .3,
    alpha: Math.random() * .5 + .1
  };
}
for (let i = 0; i < 90; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

// ── TYPED TEXT ──
const roles = [
  'Penetration Tester',
  'SOC Analyst',
  'Ethical Hacker',
  'Threat Hunter',
  'Red Team Operator',
  'Incident Responder'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = roles[roleIdx];
  typedEl.textContent = deleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++);
  if (!deleting && charIdx > current.length) { deleting = true; setTimeout(type, 1400); return; }
  if (deleting && charIdx < 0)  { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  setTimeout(type, deleting ? 45 : 80);
}
type();

// ── INTERSECTION OBSERVER ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');

    // Skill bars
    e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });

    // Counters
    e.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(timer);
      }, 40);
    });
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  '.skill-card, .project-card, .project-featured, .about-grid, .contact-wrap, .about-stats, .skill-bars, .skills-grid, .contact-cards, .cert-card, .timeline-item, .visa-doc, .avail-strip'
).forEach(el => { el.classList.add('fade-in'); observer.observe(el); });

// ── CONTACT FORM ──
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const f   = e.target;
  const btn = f.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');

  btn.textContent = 'Sending...';
  btn.disabled = true;
  success.style.display = 'none';
  error.style.display   = 'none';

  emailjs.send('<YOUR_SERVICE_ID>', '<YOUR_TEMPLATE_ID>', {
    from_name:    f.name.value.trim(),
    from_email:   f.email.value.trim(),
    service_type: f.service.value || 'General Inquiry',
    message:      f.message.value.trim()
  })
  .then(() => {
    success.style.display = 'block';
    f.reset();
    setTimeout(() => success.style.display = 'none', 5000);
  })
  .catch(() => {
    error.style.display = 'block';
    setTimeout(() => error.style.display = 'none', 5000);
  })
  .finally(() => {
    btn.textContent = 'Send Secure Message 🔒';
    btn.disabled = false;
  });
});
