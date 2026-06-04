// ============================================
// NAV — add backdrop on scroll
// ============================================
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ============================================
// SCROLL REVEAL — Intersection Observer
// ============================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    // Stagger siblings within the same parent
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const index = siblings.indexOf(entry.target);
    const delay = index * 80;

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);

    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px',
});

revealEls.forEach((el) => revealObserver.observe(el));

// ============================================
// GAME OF LIFE — hero background
// ============================================
const golCanvas = document.getElementById('gol-canvas');

if (golCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = golCanvas.getContext('2d');
  const CELL  = 12;
  const FPS   = 120;
  const DENSITY = 0.18;
  let cols, rows, grid, next;

  function makeGrid() {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() < DENSITY ? 1 : 0)
    );
  }

  function resize() {
    golCanvas.width  = golCanvas.offsetWidth;
    golCanvas.height = golCanvas.offsetHeight;
    cols = Math.floor(golCanvas.width  / CELL);
    rows = Math.floor(golCanvas.height / CELL);
    grid = makeGrid();
    next = Array.from({ length: rows }, () => new Array(cols).fill(0));
  }

  function step() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            n += grid[(r + dr + rows) % rows][(c + dc + cols) % cols];
          }
        }
        const alive = grid[r][c];
        next[r][c] = alive ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
      }
    }
    [grid, next] = [next, grid];
  }

  function draw() {
    ctx.clearRect(0, 0, golCanvas.width, golCanvas.height);
    ctx.fillStyle = 'rgba(44, 35, 24, 0.025)';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(() => { step(); draw(); }, FPS);
}

// ============================================
// CHARACTER — show when footer is reached
// ============================================
const character = document.querySelector('.hero-character');
const footer = document.querySelector('.footer');

if (character && footer) {
  const characterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        character.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  characterObserver.observe(footer);
}

// ============================================
// HERO ROLE CYCLING
// Edit: add/remove roles here
// ============================================
const roles = [
  'Software Developer',
  'CRM Systems Developer',
  'Management Panel Builder',
  'Automation-Focused Developer',
  'Node.js Developer',
  'FastAPI Developer',
  'Next.js Developer',
  'Go Developer',
  'React Native Developer',
  'System-Oriented Developer',
  'AI-Assisted Builder',
  'Self-Hoster',
  'Infrastructure Builder',
  'Accessibility-Minded Developer',
  'Process Optimizer',
];

const roleEl = document.getElementById('role-text');
let roleIndex = 0;

if (roleEl) {
  roleEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  roleEl.style.display = 'inline-block';

  setInterval(() => {
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(5px)';

    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.textContent = roles[roleIndex];
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 300);
  }, 2000);
}
