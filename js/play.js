/* SB—120 · back pages: terminal, misprint game, poster press, estimator */
(() => {
  const $ = s => document.querySelector(s);

  /* =====================================================
     01 · TERMINAL
     ===================================================== */
  const out = $('#termOut'), form = $('#termForm'), input = $('#termIn');
  if (out && form) {
    const hist = []; let hi = 0;
    const print = (text, cls = '') => {
      const d = document.createElement('div');
      d.className = 'line ' + cls; d.textContent = text;
      out.appendChild(d); out.scrollTop = out.scrollHeight;
    };
    const typeOut = async (lines) => {
      for (const [t, c] of lines) { print(t, c); await new Promise(r => setTimeout(r, 70)); }
    };

    const greetings = {
      hi: 'hello! 👋 welcome to issue nº120.',
      hello: 'hi there! nice of you to stop by.',
      hey: 'hey hey. want to see something cool? try `projects`.',
      namaste: 'namaste 🙏 swagat hai.',
      bye: 'leaving already? at least take the resume → `resume`',
      'thank you': 'no, thank YOU for reading this far.',
      thanks: 'anytime ✺'
    };
    const jokes = [
      'why do programmers prefer dark mode? because light attracts bugs.',
      'i told my code a joke. it didn\'t laugh. i guess it has no sense of humor(). ',
      'there are 10 kinds of recruiters: those who read binary and those who hire me anyway.',
      'a SQL query walks into a bar, sees two tables and asks: "can I JOIN you?"',
      '"it works on my machine" — so we shipped my machine. (that\'s docker.)'
    ];
    const cmds = {
      help: () => [
        ['commands:', 'acc'],
        ['  say("anything")   I reply', 'dim'], ['  print("x")        echoes, js-style', 'dim'],
        ['  whoami            who is siddharth', 'dim'], ['  projects          what I built', 'dim'],
        ['  skills            the stack', 'dim'], ['  hire()            the good button', 'dim'],
        ['  resume            download it', 'dim'], ['  coffee | joke     fuel & fun', 'dim'],
        ['  2 + 2             it does math too', 'dim'], ['  clear             wipe the page', 'dim'],
        ['psst: there are hidden ones.', 'bl']
      ],
      whoami: () => [
        ['siddharth bhat', 'acc'],
        ['full-stack developer · MCA @ St Aloysius, Mangaluru (2027)', ''],
        ['I build enterprise software with AI — less cost, less time.', 'ok']
      ],
      projects: () => [
        ['01  TaskFlow      enterprise PM platform · 47 endpoints · RBAC', ''],
        ['02  Beam Share    offline file transfer · android ⇄ iphone ⇄ windows', ''],
        ['03  CrowdMate     QR queues + safety tags · 69 tests · offline-first', ''],
        ['04  Paroh         AI digital twin · front-end lead', ''],
        ['05  PixelStore    gaming e-commerce · atomic stock', ''],
        ['06  Qualify Milk  10 ML models, honestly scored', ''],
        ['07  HabitTracker  native android · kotlin + compose', ''],
        ['08  TermGuard     rent & offer-letter checker · every point quoted', ''],
        ['09  BlackBox      incident timeline · 34k log lines → 23 moments', ''],
        ['→ scrolling you to them…', 'bl', () => document.getElementById('work').scrollIntoView({ behavior: 'smooth' })]
      ],
      skills: () => [
        ['frontend  react · angular · typescript · compose', ''],
        ['backend   node · express · socket.io · flask', ''],
        ['data/ai   mongodb · sqlite · scikit-learn · llms', ''],
        ['craft     git · ci · vitest · playwright · wcag', '']
      ],
      'hire()': () => [
        ['excellent decision. 🎉', 'ok'],
        ['opening an email to siddharth…', 'bl', () => { location.href = 'mailto:pbhat554@gmail.com?subject=Let%27s%20talk%20%E2%80%94%20from%20your%20portfolio'; }]
      ],
      resume: () => [['downloading Siddharth-Bhat-Resume.pdf …', 'ok', () => {
        const a = document.createElement('a'); a.href = 'assets/Siddharth-Bhat-Resume.pdf'; a.download = ''; a.click();
      }]],
      coffee: () => [
        ['      ( (', 'acc'], ['       ) )', 'acc'], ['    ........', ''], ['    |      |]', ''], ['    \\      /', ''], ['     `----\'', ''],
        ['brewing… ☕ productivity +40%', 'ok']
      ],
      joke: () => [[jokes[Math.floor(Math.random() * jokes.length)], '']],
      'sudo hire siddharth': () => [
        ['[sudo] password for recruiter: ********', 'dim'],
        ['permission granted. ✓', 'ok'],
        ['siddharth has been added to your team. onboarding starts monday.', 'acc']
      ],
      ls: () => [['taskflow/  beam-share/  crowdmate/  paroh/  pixelstore/  qualify-milk/  habit-tracker/  resume.pdf  secrets.txt', '']],
      'cat secrets.txt': () => [['nice try 😄 the only secret: I actually enjoy writing tests.', 'acc']],
      date: () => [[new Date().toString(), '']],
      exit: () => [['you can check out any time you like, but you can never leave. (scroll up ↑)', 'dim']],
      'rm -rf /': () => [['whoa whoa. not on my zine. 🛑', 'acc']],
      matrix: () => [['wake up, recruiter… the matrix has you… follow the pink rabbit → hire()', 'ok']],
      ink: () => [['two inks: fluoro pink #ff48b0 + riso blue #2b3bd6. overprint = purple.', 'acc']],
      '42': () => [['the answer to life, the universe and your hiring pipeline.', 'ok']]
    };

    const strArg = s => {
      const m = s.match(/^\s*(?:say|print|console\.log|echo)\s*\(?\s*(["'`])?([\s\S]*?)\1?\s*\)?\s*;?\s*$/i);
      return m ? m[2] : null;
    };

    const run = async raw => {
      const c = raw.trim();
      if (!c) return;
      print(c, 'cmd');
      hist.push(c); hi = hist.length;
      const lc = c.toLowerCase().replace(/;$/, '');

      if (lc === 'clear' || lc === 'cls') { out.innerHTML = ''; return; }

      if (/^say\b/.test(lc)) {
        const msg = (strArg(c) || '').trim(); const key = msg.toLowerCase().replace(/[!.?]+$/, '');
        if (!msg) return print('say what? try say("hi")', 'dim');
        if (greetings[key]) return print(greetings[key], 'ok');
        if (/hire|job|work/.test(key)) return print('music to my ears. type hire() 👀', 'acc');
        if (/name/.test(key)) return print('I\'m siddharth. you can call me sid.', 'ok');
        if (/how are you/.test(key)) return print('compiling happily, zero warnings. you?', 'ok');
        return print(`you said "${msg}". I say: let's build something together.`, 'ok');
      }
      if (/^(print|console\.log|echo)\b/.test(lc)) {
        const msg = strArg(c);
        print(msg ?? '', '');
        return print('// stdout ✓ — also, nice syntax.', 'dim');
      }
      if (/^[\d\s+\-*/().%]+$/.test(c) && /\d/.test(c)) {
        try {
          const v = Function('"use strict";return (' + c + ')')();
          if (typeof v === 'number' && isFinite(v)) return print(String(+v.toFixed(10)), 'ok');
        } catch (_) {}
        return print('math error. even calculators have bad days.', 'acc');
      }
      const f = cmds[lc] || cmds[lc.replace(/\(\)$/, '')] || cmds[lc + '()'];
      if (f) {
        const lines = f();
        for (const [t, cls, fx] of lines) { print(t, cls); await new Promise(r => setTimeout(r, 60)); fx && fx(); }
        return;
      }
      print(`command not found: ${c.split(/\s+/)[0]}. type help`, 'acc');
    };

    form.addEventListener('submit', e => { e.preventDefault(); const v = input.value; input.value = ''; run(v); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && hi > 0) { input.value = hist[--hi]; e.preventDefault(); }
      if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
    });
    document.getElementById('termChips').addEventListener('click', e => {
      const b = e.target.closest('button'); if (b) { run(b.textContent); }
    });

    // boot
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return; io.disconnect();
      typeOut([
        ['sid-os v1.20 · issue nº120', 'dim'],
        ['ready. type say("hi") to begin, or help.', 'ok']
      ]);
    }, { threshold: .3 });
    io.observe(out);
  }

  /* =====================================================
     02 · FIX THE MISPRINT
     ===================================================== */
  const stage = $('#regStage');
  if (stage) {
    const shapes = [
      '<path fill-rule="evenodd" d="M50 12a38 38 0 1 0 .01 0zM50 30a20 20 0 1 0 .01 0z"/>',
      '<path d="M50 6l11 30h32L67 55l10 32-27-19-27 19 10-32L7 36h32z"/>',
      '<rect x="12" y="12" width="34" height="34"/><rect x="54" y="54" width="34" height="34"/><circle cx="71" cy="29" r="17"/><circle cx="29" cy="71" r="17"/>'
    ];
    const pink = $('#regPink'), v = $('#regVerdict'), score = $('#regScore'), pull = $('#regPull');
    const s1 = $('#regSvg1'), s2 = $('#regSvg2');
    let round = 0, total = 0, x = 0, y = 0, done = false;

    const setRound = () => {
      done = false; v.classList.remove('show');
      s1.innerHTML = s2.innerHTML = shapes[round % shapes.length];
      const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 50;
      x = Math.cos(a) * d; y = Math.sin(a) * d; draw();
      score.textContent = `Round ${round + 1}/3 · score ${total}`;
      pull.textContent = 'Pull print';
    };
    const draw = () => { pink.style.transform = `translate(${x}px, ${y}px)`; };

    let sx, sy, ox, oy, dragging = false;
    stage.addEventListener('pointerdown', e => {
      if (done) return;
      dragging = true; stage.classList.add('drag'); stage.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY; ox = x; oy = y;
    });
    stage.addEventListener('pointermove', e => {
      if (!dragging) return;
      x = ox + e.clientX - sx; y = oy + e.clientY - sy; draw();
    });
    const end = () => { dragging = false; stage.classList.remove('drag'); };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
    stage.addEventListener('keydown', e => {
      if (done) return;
      const k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (k) { const m = e.shiftKey ? 10 : 2; x += k[0] * m; y += k[1] * m; draw(); e.preventDefault(); }
      if (e.key === 'Enter') pull.click();
    });

    pull.addEventListener('click', () => {
      if (done) {
        if (round >= 3) { round = 0; total = 0; }
        return setRound();
      }
      done = true;
      // distance in % of stage size, so mobile and desktop play fair
      const dist = Math.hypot(x, y) / stage.clientWidth * 100;
      const pts = Math.max(0, Math.round(100 - dist * 9));
      total += pts; round++;
      const grade = dist < 1 ? ['Gallery-ready', 'perfect registration'] :
                    dist < 3 ? ['Zine-worthy', 'tiny wobble, very riso'] :
                    dist < 7 ? ['Very riso', 'that\'s the charm, right?'] :
                               ['Misprint!', 'collector\'s item, maybe'];
      v.innerHTML = `${grade[0]}<small>${grade[1]} · +${pts}</small>`;
      v.classList.add('show');
      score.textContent = round >= 3 ? `Final score ${total}/300` : `Round ${round}/3 · score ${total}`;
      pull.textContent = round >= 3 ? 'Play again' : 'Next print →';
    });
    setRound();
  }

  /* =====================================================
     03 · POSTER PRESS
     ===================================================== */
  const cv = $('#poster');
  if (cv) {
    const ctx = cv.getContext('2d');
    const word = $('#posterWord'), mis = $('#posterMis'), inks = $('#inks');
    let A = '#ff48b0', B = '#2b3bd6', seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

    const grain = (() => {
      const g = document.createElement('canvas'); g.width = g.height = 200;
      const c = g.getContext('2d'), d = c.createImageData(200, 200);
      for (let i = 0; i < d.data.length; i += 4) { const n = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = n; d.data[i + 3] = 22; }
      c.putImageData(d, 0, 0); return g;
    })();

    const halftone = (cx, cy, R, col, step = 14) => {
      ctx.fillStyle = col;
      for (let y = cy - R; y < cy + R; y += step) for (let x = cx - R; x < cx + R; x += step) {
        const d = Math.hypot(x - cx, y - cy); if (d > R) continue;
        const r = (1 - d / R) * step * .55; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
    };

    const render = () => {
      const W = cv.width, H = cv.height, m = +mis.value;
      const text = (word.value || ' ').toUpperCase();
      const s0 = seed;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#f2ede3'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'multiply';

      // layer A: shapes
      const layer = (col, dx, dy, which) => {
        seed = s0;
        ctx.save(); ctx.translate(dx, dy);
        const bx = 80 + rnd() * 440, by = 120 + rnd() * 300, br = 120 + rnd() * 110;
        if (which === 0) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.fill(); }
        else halftone(600 - bx, 800 - by, br * 1.1, col, 13);
        // stripes
        const sy = 560 + rnd() * 120;
        ctx.fillStyle = col;
        if (which === 1) for (let i = 0; i < 5; i++) ctx.fillRect(40, sy + i * 18, 520, 8);
        // the word
        ctx.fillStyle = col;
        let fs = 230; ctx.font = `800 ${fs}px "Bricolage Grotesque"`;
        while (ctx.measureText(text).width > 540 && fs > 40) { fs -= 6; ctx.font = `800 ${fs}px "Bricolage Grotesque"`; }
        ctx.textBaseline = 'alphabetic';
        const ty = 300 + rnd() * 240;
        ctx.fillText(text, 30, ty);
        ctx.restore();
      };
      layer(A, 0, 0, 0);
      layer(B, m * .9, m * .6, 1);
      seed = s0;

      // ink-black small type
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#1b1a24';
      ctx.font = '700 16px "JetBrains Mono"';
      ctx.fillText('ISSUE Nº120', 30, 46);
      ctx.textAlign = 'right'; ctx.fillText('PRINTED BY YOU', 570, 46); ctx.textAlign = 'left';
      ctx.fillRect(30, 60, 540, 3);
      ctx.font = '400 13px "JetBrains Mono"';
      ctx.fillText('two-colour riso · sb—120 press · ' + new Date().toLocaleDateString(), 30, 772);
      ctx.drawImage(grain, 0, 0, W, H);
    };

    inks.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      inks.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      A = b.dataset.a; B = b.dataset.b; render();
    });
    word.addEventListener('input', render); mis.addEventListener('input', render);
    $('#posterShake').addEventListener('click', () => {
      seed = Math.floor(Math.random() * 233280); render();
      cv.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-2deg)' }, { transform: 'rotate(1.5deg)' }, { transform: 'rotate(0)' }], { duration: 380 });
    });
    $('#posterSave').addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = `riso-${(word.value || 'poster').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
      a.href = cv.toDataURL('image/png'); a.click();
    });
    Promise.all([
      document.fonts.load('800 100px "Bricolage Grotesque"'),
      document.fonts.load('700 16px "JetBrains Mono"')
    ]).catch(() => {}).finally(render);
  }

  /* =====================================================
     04 · PRICE-A-PROJECT
     ===================================================== */
  const mods = $('#mods');
  if (mods) {
    const AI = 0.45; // share of classic effort when I build with AI
    const upd = () => {
      const base = 2; // setup, deploy, QA
      const sum = [...mods.querySelectorAll('input:checked')].reduce((s, i) => s + +i.value, 0);
      const trad = sum ? base + sum : 0, ai = Math.round(trad * AI * 2) / 2;
      const max = 2 + 32;
      $('#tradBar').style.width = (trad / max * 100) + '%';
      $('#aiBar').style.width = (ai / max * 100) + '%';
      $('#tradW').textContent = trad + ' wks';
      $('#aiW').textContent = ai + ' wks';
      $('#saving').innerHTML = trad ? `You save <b>${(trad - ai).toFixed(1).replace('.0', '')} weeks</b> (~${Math.round((1 - AI) * 100)}%)` : 'Pick a module ↑';
    };
    mods.addEventListener('change', upd);
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { upd(); o.disconnect(); } }, { threshold: .3 }).observe(mods);
  }
})();
