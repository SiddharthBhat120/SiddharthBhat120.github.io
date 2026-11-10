/* SB—120 · games: ink snake, slide the print, ink pairs */
(() => {
  const $ = s => document.querySelector(s);
  const PINK = '#ff48b0', BLUE = '#2b3bd6', INK = '#1b1a24', PAPER = '#f2ede3', PAPER2 = '#e8e0d1', YELLOW = '#ffe14d';
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} }
  };

  /* =====================================================
     05 · INK SNAKE
     ===================================================== */
  const cv = $('#snake');
  if (cv) {
    const ctx = cv.getContext('2d');
    const N = 20, C = cv.width / N;
    const stage = $('#snakeStage'), overlay = $('#snakeOverlay');
    const title = $('#snakeTitle'), msg = $('#snakeMsg'), startBtn = $('#snakeStart');
    const scoreEl = $('#snakeScore'), bestEl = $('#snakeBest'), ateEl = $('#snakeAte');
    const FRUITS = ['React', 'Angular', 'TypeScript', 'Node.js', 'MongoDB', 'Socket.IO', 'Python', 'Kotlin', 'Flask', 'JWT',
      'SQLite', 'Playwright', 'Vitest', 'PWA', 'Express', 'LLMs', 'Compose', 'Git', 'Linux', 'MySQL'];
    let snake, dir, queue, fruit, fruitName, score, best = +(store.get('sb120-snake-best') || 0), speed, timer = null, state = 'idle', eaten, pulse = 0;
    bestEl.textContent = best;

    const reset = () => {
      snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
      dir = { x: 1, y: 0 }; queue = []; score = 0; speed = 140; eaten = [];
      scoreEl.textContent = 0; ateEl.textContent = 'nothing yet…';
      placeFruit();
    };
    const placeFruit = () => {
      let p;
      do { p = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
      while (snake.some(s => s.x === p.x && s.y === p.y));
      fruit = p; fruitName = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    };

    const draw = () => {
      ctx.fillStyle = PAPER2; ctx.fillRect(0, 0, cv.width, cv.height);
      // dotted grid
      ctx.fillStyle = 'rgba(27,26,36,.12)';
      for (let i = 1; i < N; i++) for (let j = 1; j < N; j++) ctx.fillRect(i * C - 1, j * C - 1, 2, 2);
      ctx.globalCompositeOperation = 'multiply';
      // fruit: pink ink + blue misprint ring, gently pulsing
      pulse += .15;
      const fx = fruit.x * C + C / 2, fy = fruit.y * C + C / 2, r = C * .38 + Math.sin(pulse) * 1.2;
      ctx.fillStyle = PINK; ctx.beginPath(); ctx.arc(fx, fy, r, 0, 7); ctx.fill();
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx + 2, fy - 1, r, 0, 7); ctx.stroke();
      ctx.fillStyle = INK; ctx.fillRect(fx - 1, fy - r - 4, 2, 5);
      // snake: blue body, pink plate offset for that riso look
      const seg = (s, col, dx, dy, pad) => { ctx.fillStyle = col; ctx.fillRect(s.x * C + pad + dx, s.y * C + pad + dy, C - pad * 2, C - pad * 2); };
      snake.forEach((s, i) => seg(s, BLUE, 0, 0, i === 0 ? 1 : 2));
      snake.forEach((s, i) => { if (i % 2 === 0) seg(s, PINK, 2, 2, 5); });
      ctx.globalCompositeOperation = 'source-over';
      // eyes
      const h = snake[0], ex = h.x * C + C / 2, ey = h.y * C + C / 2;
      ctx.fillStyle = PAPER;
      const ox = dir.y !== 0 ? 4 : 0, oy = dir.x !== 0 ? 4 : 0;
      ctx.beginPath(); ctx.arc(ex + dir.x * 4 - ox, ey + dir.y * 4 - oy, 2.6, 0, 7); ctx.arc(ex + dir.x * 4 + ox, ey + dir.y * 4 + oy, 2.6, 0, 7); ctx.fill();
      // fruit label
      ctx.font = '700 11px "JetBrains Mono", monospace';
      const tw = ctx.measureText(fruitName).width;
      let lx = Math.min(cv.width - tw - 8, Math.max(4, fx - tw / 2 - 4)), ly = fruit.y < 2 ? fy + 14 : fy - 28;
      ctx.fillStyle = YELLOW; ctx.fillRect(lx, ly, tw + 8, 15);
      ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.strokeRect(lx + .5, ly + .5, tw + 7, 14);
      ctx.fillStyle = INK; ctx.fillText(fruitName, lx + 4, ly + 11);
    };

    const step = () => {
      if (queue.length) {
        const n = queue.shift();
        if (n.x !== -dir.x || n.y !== -dir.y) dir = n;
      }
      const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      const hitWall = h.x < 0 || h.y < 0 || h.x >= N || h.y >= N;
      const grows = h.x === fruit.x && h.y === fruit.y;
      const body = grows ? snake : snake.slice(0, -1);
      if (hitWall || body.some(s => s.x === h.x && s.y === h.y)) return gameOver(hitWall ? 'Hit the margin!' : 'Bit your own tail!');
      snake.unshift(h);
      if (grows) {
        score++; scoreEl.textContent = score;
        if (!eaten.includes(fruitName)) eaten.push(fruitName);
        ateEl.innerHTML = eaten.map(n => `<i>${n}</i>`).join('');
        speed = Math.max(65, speed - 4);
        placeFruit();
        clearInterval(timer); timer = setInterval(step, speed);
      } else snake.pop();
      draw();
    };

    const show = (t, m, b) => { title.textContent = t; msg.textContent = m; startBtn.textContent = b; overlay.classList.remove('hide'); };
    const start = () => {
      reset(); state = 'run'; overlay.classList.add('hide'); draw();
      clearInterval(timer); timer = setInterval(step, speed);
      stage.focus({ preventScroll: true });
    };
    const pause = () => {
      if (state === 'run') { state = 'pause'; clearInterval(timer); show('Paused', `Score ${score}. Take a sip of chai.`, 'Resume ▸'); }
      else if (state === 'pause') { state = 'run'; overlay.classList.add('hide'); timer = setInterval(step, speed); stage.focus({ preventScroll: true }); }
      else start();
    };
    const gameOver = why => {
      clearInterval(timer); state = 'over';
      stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake');
      let line = `${why} Score ${score}.`;
      if (score > best) { best = score; store.set('sb120-snake-best', best); bestEl.textContent = best; line += ' New best! ✺'; }
      if (eaten.length) line += ` You collected ${eaten.length} skill${eaten.length > 1 ? 's' : ''}.`;
      show('Game over', line, 'Play again ▸');
    };
    startBtn.addEventListener('click', () => (state === 'pause' ? pause() : start()));

    const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const turn = d => {
      const last = queue.length ? queue[queue.length - 1] : dir;
      const n = DIRS[d];
      if ((n.x === last.x && n.y === last.y) || (n.x === -last.x && n.y === -last.y)) return;
      if (queue.length < 3) queue.push(n);
    };
    const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
    stage.addEventListener('keydown', e => {
      if (KEYS[e.key]) { e.preventDefault(); if (state === 'run') turn(KEYS[e.key]); else if (state !== 'pause') { start(); turn(KEYS[e.key]); } }
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'p' || e.key === 'Escape') { e.preventDefault(); pause(); }
    });
    // pause when the player scrolls away
    new IntersectionObserver(es => { if (!es[0].isIntersecting && state === 'run') pause(); }, { threshold: .3 }).observe(stage);
    document.querySelector('.dpad').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.d === 'pause') return pause();
      if (state !== 'run') { if (state === 'pause') pause(); else start(); }
      turn(b.dataset.d);
    });
    // swipe
    let sx = null, sy = null;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
    stage.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24 || state !== 'run') return;
      turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    });

    reset();
    document.fonts.ready.then(draw);
  }

  /* =====================================================
     06 · SLIDE THE PRINT
     ===================================================== */
  const board = $('#slideBoard');
  if (board) {
    const info = $('#slideInfo');
    let n = 3, tiles = [], empty, moves = 0, t0 = 0, tick = null, won = false, art = '';

    const makeArt = () => {
      const c = document.createElement('canvas'); c.width = c.height = 600;
      const g = c.getContext('2d');
      g.fillStyle = PAPER; g.fillRect(0, 0, 600, 600);
      g.globalCompositeOperation = 'multiply';
      g.fillStyle = PINK; g.beginPath(); g.arc(390, 220, 170, 0, 7); g.fill();
      g.fillStyle = BLUE;
      for (let y = 330; y < 600; y += 20) for (let x = 20; x < 330; x += 20) {
        const r = Math.max(0, 8 - Math.hypot(x - 170, y - 470) / 26); if (r > .4) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
      }
      g.font = '800 250px "Bricolage Grotesque", sans-serif';
      g.fillStyle = BLUE; g.fillText('SB', 40, 330);
      g.fillStyle = PINK; g.fillText('SB', 50, 338);
      g.font = '800 120px "Bricolage Grotesque", sans-serif';
      g.fillStyle = BLUE; g.fillText('120', 330, 540);
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = INK; g.fillRect(30, 40, 540, 4);
      g.font = '700 22px "JetBrains Mono", monospace';
      g.fillText('ISSUE Nº120', 30, 30); g.fillText('✺', 548, 30);
      g.fillRect(30, 570, 200, 3);
      return c.toDataURL();
    };

    const pos = i => ({ x: i % n, y: Math.floor(i / n) });
    const place = t => {
      const p = pos(t.at);
      t.el.style.transform = `translate(${p.x * 100}%, ${p.y * 100}%)`;
    };
    const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    const upd = () => { info.textContent = `Moves ${moves} · ${fmt(t0 ? Math.floor((Date.now() - t0) / 1000) : 0)}`; };

    const build = () => {
      board.innerHTML = ''; board.style.setProperty('--n', n); board.classList.remove('won');
      const full = document.createElement('div'); full.className = 'full'; full.style.backgroundImage = `url(${art})`; board.appendChild(full);
      const stamp = document.createElement('div'); stamp.className = 'stamp-win'; board.appendChild(stamp);
      tiles = [];
      for (let i = 0; i < n * n - 1; i++) {
        const el = document.createElement('button');
        el.type = 'button'; el.className = 'tile';
        el.setAttribute('aria-label', 'Tile ' + (i + 1));
        const p = pos(i);
        el.style.backgroundImage = `url(${art})`;
        el.style.backgroundSize = `${n * 100}% ${n * 100}%`;
        el.style.backgroundPosition = `${p.x / (n - 1) * 100}% ${p.y / (n - 1) * 100}%`;
        el.innerHTML = `<span class="no">${i + 1}</span>`;
        const t = { home: i, at: i, el };
        el.addEventListener('click', () => tryMove(t));
        board.appendChild(el); tiles.push(t);
      }
      empty = n * n - 1;
      shuffle();
    };
    const adjacent = (a, b) => { const p = pos(a), q = pos(b); return Math.abs(p.x - q.x) + Math.abs(p.y - q.y) === 1; };
    const shuffle = () => {
      // random walk from solved state -> always solvable
      let prev = -1;
      for (let k = 0; k < n * n * 40; k++) {
        const opts = tiles.filter(t => adjacent(t.at, empty) && t !== prev);
        const t = opts[Math.floor(Math.random() * opts.length)];
        [t.at, empty] = [empty, t.at]; prev = t;
      }
      if (tiles.every(t => t.at === t.home)) return shuffle();
      tiles.forEach(place);
      moves = 0; won = false; t0 = 0; clearInterval(tick); upd(); board.classList.remove('won');
    };
    const tryMove = t => {
      if (won || !adjacent(t.at, empty)) return;
      if (!t0) { t0 = Date.now(); tick = setInterval(upd, 1000); }
      [t.at, empty] = [empty, t.at]; place(t); moves++; upd();
      if (tiles.every(x => x.at === x.home)) {
        won = true; clearInterval(tick);
        const secs = Math.floor((Date.now() - t0) / 1000);
        const key = 'sb120-slide-best-' + n, prevBest = +(store.get(key) || 0);
        const isBest = !prevBest || moves < prevBest;
        if (isBest) store.set(key, moves);
        board.querySelector('.stamp-win').innerHTML = `Printed!<small>${moves} moves · ${fmt(secs)}${isBest ? ' · best ✺' : ` · best ${prevBest}`}</small>`;
        setTimeout(() => board.classList.add('won'), 250);
      }
    };
    board.addEventListener('keydown', e => {
      // arrow = direction the tile moves into the gap
      const d = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [1, 0], ArrowRight: [-1, 0] }[e.key];
      if (!d) return;
      e.preventDefault();
      const p = pos(empty), tx = p.x + d[0], ty = p.y + d[1];
      if (tx < 0 || ty < 0 || tx >= n || ty >= n) return;
      const t = tiles.find(t => t.at === ty * n + tx); t && tryMove(t);
    });
    $('#slideShuffle').addEventListener('click', shuffle);
    const peek = $('#slidePeek');
    const on = e => { e.preventDefault(); board.classList.add('peek'); }, off = () => board.classList.remove('peek');
    peek.addEventListener('pointerdown', on); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => peek.addEventListener(ev, off));
    peek.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') on(e); });
    peek.addEventListener('keyup', off);
    $('#slideSize').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $('#slideSize').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      n = +b.dataset.n; build();
    });

    Promise.all([document.fonts.load('800 100px "Bricolage Grotesque"'), document.fonts.load('700 16px "JetBrains Mono"')])
      .catch(() => {}).finally(() => { art = makeArt(); build(); });
  }

  /* =====================================================
     07 · INK PAIRS
     ===================================================== */
  const grid = $('#memGrid');
  if (grid) {
    const info = $('#memInfo');
    const DECK = [['React', PINK], ['Angular', BLUE], ['Node.js', YELLOW], ['MongoDB', PINK], ['Kotlin', BLUE], ['Python', YELLOW], ['Socket.IO', PINK], ['LLMs', BLUE]];
    let open = [], moves = 0, pairs = 0, lock = false;

    const deal = () => {
      grid.innerHTML = ''; open = []; moves = 0; pairs = 0; lock = false; upd();
      const cards = [...DECK, ...DECK].map(([name, col]) => ({ name, col })).sort(() => Math.random() - .5);
      cards.forEach((c, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'mcard'; b.dataset.name = c.name;
        b.setAttribute('aria-label', 'Card ' + (i + 1) + ', face down');
        b.innerHTML = `<span class="in"><span class="face back"><span>✺</span></span><span class="face front"><i style="background:${c.col}"></i><b>${c.name}</b></span></span>`;
        b.addEventListener('click', () => flip(b));
        grid.appendChild(b);
        b.animate([{ transform: 'translateY(-20px) rotate(-6deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: i * 35, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      });
    };
    const upd = () => { info.textContent = pairs === DECK.length ? `Cleared in ${moves} moves ✺` : `Moves ${moves} · Pairs ${pairs}/${DECK.length}`; };
    const flip = b => {
      if (lock || b.classList.contains('up') || b.classList.contains('done')) return;
      b.classList.add('up'); b.setAttribute('aria-label', b.dataset.name);
      open.push(b);
      if (open.length < 2) return;
      moves++;
      const [a, c] = open;
      if (a.dataset.name === c.dataset.name) {
        a.classList.add('done'); c.classList.add('done'); open = []; pairs++; upd();
        if (pairs === DECK.length) {
          const best = +(store.get('sb120-mem-best') || 0);
          if (!best || moves < best) store.set('sb120-mem-best', moves);
          info.textContent = `Cleared in ${moves} moves ✺ ${!best || moves < best ? 'new best!' : 'best ' + best}`;
        }
      } else {
        lock = true; upd();
        setTimeout(() => {
          a.classList.remove('up'); c.classList.remove('up');
          a.setAttribute('aria-label', 'Card, face down'); c.setAttribute('aria-label', 'Card, face down');
          open = []; lock = false;
        }, 800);
      }
    };
    $('#memReset').addEventListener('click', deal);
    deal();
  }
})();
