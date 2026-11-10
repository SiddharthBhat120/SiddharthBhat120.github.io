/* SB—120 · core interactions */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const root = document.documentElement;

  /* ---------- print-run intro ---------- */
  const press = $('.press');
  const start = () => {
    document.body.classList.add('loaded');
    setTimeout(() => press && press.classList.add('done'), reduce ? 0 : 1500);
  };
  if (reduce) start(); else setTimeout(start, 650);

  /* ---------- pointer → ink misregistration ---------- */
  let tx = 0, ty = 0, cx = 0, cy = 0, px = innerWidth / 2, py = innerHeight / 2;
  const cursor = $('.dot-cursor');
  addEventListener('pointermove', e => {
    px = e.clientX; py = e.clientY;
    tx = (px / innerWidth) * 2 - 1;
    ty = (py / innerHeight) * 2 - 1;
  }, { passive: true });
  const loop = () => {
    cx += (tx - cx) * .08; cy += (ty - cy) * .08;
    root.style.setProperty('--mx', cx.toFixed(3));
    root.style.setProperty('--my', cy.toFixed(3));
    if (cursor && fine) cursor.style.transform = `translate(${px}px, ${py}px)`;
    requestAnimationFrame(loop);
  };
  if (!reduce) requestAnimationFrame(loop);
  if (cursor && fine) {
    document.addEventListener('pointerover', e => {
      cursor.classList.toggle('big', !!e.target.closest('a, button, .sk, input, [data-tilt], .reg-stage'));
    });
  }

  /* ---------- masthead ---------- */
  const mast = $('#mast');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    mast.classList.toggle('scrolled', y > 20);
    mast.classList.toggle('hide', y > lastY && y > 400);
    lastY = y;
  }, { passive: true });

  const navLinks = $$('.mast nav a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'skills', 'play', 'resume', 'contact'].forEach(id => { const s = document.getElementById(id); s && spy.observe(s); });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .14 });
  $$('.rv, .pitch-page').forEach(el => io.observe(el));

  /* ---------- counters ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), d = reduce ? 1 : 1400;
    const step = t => {
      const k = Math.min(1, (t - t0) / d), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
      el.textContent = v;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    cio.unobserve(el);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- art tilt + ink shift ---------- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
        el.style.setProperty('--ax', (x * 2).toFixed(2));
        el.style.setProperty('--ay', (y * 2).toFixed(2));
      });
      el.addEventListener('pointerleave', () => ['--rx', '--ry', '--ax', '--ay'].forEach(p => el.style.removeProperty(p)));
    });
  }

  /* ---------- screenshot toggles ---------- */
  $$('.shot-toggle').forEach(b => b.addEventListener('click', () => {
    const art = b.closest('.art'), on = art.classList.toggle('show-shot');
    b.setAttribute('aria-pressed', on);
    b.textContent = on ? 'Drawing' : 'See it';
  }));
  $$('.shot img').forEach(img => img.addEventListener('error', () => {
    const art = img.closest('.art');
    art.querySelector('.shot-toggle')?.remove();
    img.closest('.shot').remove();
  }));

  /* ---------- streak grid (HabitTracker art) ---------- */
  const g = $('#streakGrid');
  if (g) {
    const NS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 35; i++) {
      const c = document.createElementNS(NS, 'rect');
      const col = i % 7, row = Math.floor(i / 7);
      c.setAttribute('x', col * 20); c.setAttribute('y', row * 20);
      c.setAttribute('width', 15); c.setAttribute('height', 15); c.setAttribute('rx', 3);
      const filled = i >= 11 && i < 32;
      c.setAttribute('class', filled ? (i % 5 === 0 ? 'b pop' : 'p pop') : 'sk');
      if (!filled) c.setAttribute('stroke-width', 1.5);
      if (filled) c.style.animationDelay = (i - 11) * 0.12 + 's';
      g.appendChild(c);
    }
  }

  /* ---------- sticker sheet ---------- */
  const sheet = $('#sheet');
  if (sheet) {
    const skills = [
      ['TypeScript', 'c-blue'], ['React', 'c-pink'], ['Angular 19', 'c-pink square'], ['Node.js', 'c-blue'],
      ['Express', ''], ['MongoDB', 'c-yellow'], ['Socket.IO', 'c-ink'], ['Python', 'c-yellow square'],
      ['Kotlin', 'c-pink'], ['Jetpack Compose', ''], ['Flask', 'c-blue square'], ['scikit-learn', 'c-yellow'],
      ['JWT + RBAC', 'c-ink square'], ['PWA', 'c-pink round'], ['LLMs', 'c-blue round'], ['Electron', ''],
      ['SQLite', ''], ['IndexedDB', 'c-yellow'], ['Playwright', 'c-ink'], ['Vitest', ''], ['Git', 'c-pink round'],
      ['WCAG 2.2', 'c-blue'], ['MySQL', ''], ['Framer Motion', 'c-pink'], ['Linux', 'c-ink round'], ['AI × Dev', 'c-yellow round']
    ];
    let z = 10;
    const place = () => {
      const W = sheet.clientWidth, H = sheet.clientHeight;
      const els = $$('.sk', sheet);
      // loose grid with jitter so it reads like a hand-stuck sheet
      const cols = Math.max(2, Math.floor(W / 190)), rows = Math.ceil(els.length / cols);
      els.forEach((el, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const cw = W / cols, rh = (H - 50) / rows;
        const x = c * cw + (cw - el.offsetWidth) * (.2 + Math.random() * .6);
        const y = 40 + r * rh + (rh - el.offsetHeight) * (.15 + Math.random() * .7);
        const rot = (Math.random() * 18 - 9).toFixed(1);
        el.dataset.x = x; el.dataset.y = y; el.dataset.r = rot;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      });
    };
    skills.forEach(([name, cls]) => {
      const el = document.createElement('span');
      el.className = 'sk ' + cls;
      el.textContent = name;
      el.setAttribute('role', 'listitem');
      sheet.appendChild(el);
      let sx, sy, ox, oy;
      el.addEventListener('pointerdown', e => {
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging'); el.style.zIndex = ++z;
        sx = e.clientX; sy = e.clientY; ox = +el.dataset.x; oy = +el.dataset.y;
      });
      el.addEventListener('pointermove', e => {
        if (!el.classList.contains('dragging')) return;
        const W = sheet.clientWidth - el.offsetWidth, H = sheet.clientHeight - el.offsetHeight;
        const x = Math.max(0, Math.min(W, ox + e.clientX - sx)), y = Math.max(0, Math.min(H, oy + e.clientY - sy));
        el.dataset.x = x; el.dataset.y = y;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${(e.clientX - sx) * .05}deg)`;
      });
      const up = () => {
        if (!el.classList.contains('dragging')) return;
        el.classList.remove('dragging');
        el.dataset.r = (Math.random() * 16 - 8).toFixed(1);
        el.style.transform = `translate(${el.dataset.x}px, ${el.dataset.y}px) rotate(${el.dataset.r}deg)`;
      };
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    sheet.setAttribute('role', 'list');
    document.fonts.ready.then(place);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(place, 200); });
  }

  /* ---------- hire stamp ---------- */
  const hireBtn = $('#hireBtn'), hired = $('#hired');
  const verdicts = ['Approved ✓', 'Hired!', 'Interview: yes', 'Shortlisted'];
  let vi = 0;
  hireBtn?.addEventListener('click', () => {
    hired.classList.remove('show'); void hired.offsetWidth;
    hired.textContent = verdicts[vi++ % verdicts.length];
    hired.classList.add('show');
  });
})();
