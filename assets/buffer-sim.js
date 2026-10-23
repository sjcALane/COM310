// Producer-consumer simulator for COM310.
//   BufferSim({ root: 'sim', bounded: true, size: 4 })
// The producer makes an item, then puts it in the buffer. The consumer takes an item,
// then spends some time using it. Bounded buffers use the textbook rule: the buffer is
// full when (in + 1) % SIZE == out, so a buffer with SIZE slots holds SIZE - 1 items.

function BufferSim(cfg) {
  var root = document.getElementById(cfg.root || 'sim');
  var bounded = !!cfg.bounded;
  var SVGNS = 'http://www.w3.org/2000/svg';

  var body = root.querySelector('[data-role="body"]');
  body.classList.add('sim-body');
  body.innerHTML =
    '<div class="sim-grid">' +
      '<div class="sim-view"><svg data-role="svg" role="img" aria-label="Buffer contents"></svg></div>' +
      '<div class="sim-side">' +
        '<div class="sim-actor"><h3><span class="tag solid">P</span>Producer</h3><div class="sim-state" data-role="pstate"></div><div class="sim-meter"><span data-role="pbar"></span></div><div class="sim-small" data-role="pwait"></div></div>' +
        '<div class="sim-actor"><h3><span class="tag outline">C</span>Consumer</h3><div class="sim-state" data-role="cstate"></div><div class="sim-meter"><span data-role="cbar"></span></div><div class="sim-small" data-role="cwait"></div></div>' +
        '<dl class="kv sim-counts">' +
          '<dt>Items made</dt><dd data-role="made">0</dd>' +
          '<dt>Items used</dt><dd data-role="used">0</dd>' +
          '<dt>Items in the buffer</dt><dd data-role="inbuf">0</dd>' +
          '<dt>in</dt><dd data-role="in">0</dd>' +
          '<dt>out</dt><dd data-role="out">0</dd>' +
        '</dl>' +
      '</div>' +
    '</div>' +
    '<div class="sim-controls">' +
      '<label for="' + root.id + '-prod">Producer makes an item every <output data-role="prodv"></output> s</label>' +
      '<input type="range" id="' + root.id + '-prod" data-role="prod" min="0.2" max="2" step="0.1" value="' + (cfg.produce || 0.5) + '">' +
      '<label for="' + root.id + '-cons">Consumer uses each item for <output data-role="consv"></output> s</label>' +
      '<input type="range" id="' + root.id + '-cons" data-role="cons" min="0.2" max="2" step="0.1" value="' + (cfg.consume || 1.2) + '">' +
      (bounded ?
        '<label for="' + root.id + '-size">SIZE is <output data-role="sizev"></output> slots, so it holds at most <output data-role="holdv"></output> items</label>' +
        '<input type="range" id="' + root.id + '-size" data-role="size" min="2" max="8" step="1" value="' + (cfg.size || 4) + '">' : '') +
    '</div>' +
    '<div class="bar">' +
      '<button data-role="play" class="primary">Start</button>' +
      '<button data-role="reset">Start over</button>' +
    '</div>' +
    '<div class="out-label">What the C program would print</div>' +
    '<div class="out sim-log" data-role="log"></div>';

  var q = function (role) { return root.querySelector('[data-role="' + role + '"]'); };
  var svg = q('svg');
  var S;           // simulation state
  var running = false, last = 0;

  function num(role) { return parseFloat(q(role).value); }

  function reset() {
    var size = bounded ? Math.round(num('size')) : 0;
    S = {
      size: size,
      buf: bounded ? new Array(size).fill(null) : [],
      inp: 0, outp: 0,
      next: 1, made: 0, used: 0,
      p: { mode: 'making', t: 0, waited: 0, total: 0 },
      c: { mode: 'waiting', t: 0, waited: 0, total: 0, item: null },
      log: [], clock: 0
    };
    running = false;
    q('play').textContent = 'Start';
    labels();
    draw();
  }

  function say(line) { S.log.push(line); if (S.log.length > 7) S.log.shift(); }

  function count() { return bounded ? (S.inp - S.outp + S.size) % S.size : S.inp - S.outp; }
  function full() { return bounded && (S.inp + 1) % S.size === S.outp; }
  function empty() { return S.inp === S.outp; }

  function step(dt) {
    S.clock += dt;
    var P = num('prod'), C = num('cons');
    var p = S.p, c = S.c;
    p.total += dt; c.total += dt;

    // Producer
    if (p.mode === 'making') {
      p.t += dt;
      if (p.t >= P) { p.mode = 'ready'; p.t = 0; }
    }
    if (p.mode === 'ready' || p.mode === 'waiting') {
      if (full()) {
        if (p.mode !== 'waiting') say('Producer: buffer full, waiting');
        p.mode = 'waiting'; p.waited += dt;
      } else {
        var item = S.next++;
        if (bounded) { S.buf[S.inp] = item; S.inp = (S.inp + 1) % S.size; }
        else { S.buf[S.inp] = item; S.inp += 1; }
        S.made++;
        say('Producer: added item ' + item);
        p.mode = 'making'; p.t = 0;
      }
    }

    // Consumer
    if (c.mode === 'using') {
      c.t += dt;
      if (c.t >= C) { c.mode = 'ready'; c.t = 0; c.item = null; S.used++; }
    }
    if (c.mode === 'ready' || c.mode === 'waiting') {
      if (empty()) {
        if (c.mode !== 'waiting') say('Consumer: buffer empty, waiting');
        c.mode = 'waiting'; c.waited += dt;
      } else {
        var got = S.buf[S.outp];
        if (bounded) { S.buf[S.outp] = null; S.outp = (S.outp + 1) % S.size; }
        else { S.buf[S.outp] = null; S.outp += 1; }
        c.item = got;
        say('Consumer: took item ' + got);
        c.mode = 'using'; c.t = 0;
      }
    }
  }

  function labels() {
    q('prodv').textContent = num('prod').toFixed(1);
    q('consv').textContent = num('cons').toFixed(1);
    if (bounded) {
      q('sizev').textContent = Math.round(num('size'));
      q('holdv').textContent = Math.round(num('size')) - 1;
    }
  }

  function el(name, attrs, text) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function drawRing() {
    var n = S.size, cx = 200, cy = 190, R = 118, r = Math.min(34, 260 / n);
    svg.setAttribute('viewBox', '0 0 400 380');
    svg.innerHTML = '';
    svg.appendChild(el('circle', { cx: cx, cy: cy, r: R, class: 'sim-track' }));
    for (var k = 0; k < n; k++) {
      var a = -Math.PI / 2 + k * 2 * Math.PI / n;
      var x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      var v = S.buf[k];
      svg.appendChild(el('circle', { cx: x, cy: y, r: r, class: v === null ? 'sim-slot' : 'sim-slot filled' }));
      if (v !== null) svg.appendChild(el('text', { x: x, y: y + 7, class: 'sim-item' }, v));
      var lx = cx + (R - r - 22) * Math.cos(a), ly = cy + (R - r - 22) * Math.sin(a);
      svg.appendChild(el('text', { x: lx, y: ly + 5, class: 'sim-index' }, k));
      var labs = [];
      if (k === S.inp) labs.push('in');
      if (k === S.outp) labs.push('out');
      if (labs.length) {
        var ox = cx + (R + r + 26) * Math.cos(a), oy = cy + (R + r + 26) * Math.sin(a);
        svg.appendChild(el('text', { x: ox, y: oy + 6, class: 'sim-ptr' }, labs.join(' + ')));
      }
    }
    svg.appendChild(el('text', { x: cx, y: cy - 6, class: 'sim-center' }, count() + ' of ' + (n - 1)));
    svg.appendChild(el('text', { x: cx, y: cy + 18, class: 'sim-center small' }, 'items'));
  }

  function drawStrip() {
    var waiting = S.inp - S.outp, show = Math.min(waiting, 9);
    var w = 46, gap = 6, x0 = 20, y = 150;
    svg.setAttribute('viewBox', '0 0 560 300');
    svg.innerHTML = '';
    svg.appendChild(el('text', { x: x0, y: 70, class: 'sim-label' }, 'Items waiting, oldest first'));
    for (var k = 0; k < 10; k++) {
      var x = x0 + k * (w + gap);
      var has = k < show;
      svg.appendChild(el('rect', { x: x, y: y - 30, width: w, height: 60, rx: 6, class: has ? 'sim-slot filled' : 'sim-slot' }));
      if (has) svg.appendChild(el('text', { x: x + w / 2, y: y + 7, class: 'sim-item' }, S.buf[S.outp + k]));
    }
    if (waiting > 9) {
      svg.appendChild(el('text', { x: x0 + 9 * (w + gap) + w / 2, y: y + 7, class: 'sim-item' }, '+' + (waiting - 9)));
    }
    svg.appendChild(el('text', { x: x0, y: y + 70, class: 'sim-ptr left' }, 'out = ' + S.outp));
    svg.appendChild(el('text', { x: x0, y: y + 100, class: 'sim-ptr left' }, 'in = ' + S.inp));
    svg.appendChild(el('text', { x: x0, y: y + 130, class: 'sim-label' }, 'The buffer has grown to ' + waiting + (waiting === 1 ? ' item.' : ' items.')));
  }

  function stateText(a, who) {
    if (who === 'p') {
      if (a.mode === 'making') return 'making item ' + S.next;
      if (a.mode === 'waiting') return 'waiting: buffer full';
      return 'putting item in buffer';
    }
    if (a.mode === 'using') return 'using item ' + a.item;
    if (a.mode === 'waiting') return 'waiting: buffer empty';
    return 'taking an item';
  }

  function pct(a) { return a.total > 0 ? Math.round(100 * a.waited / a.total) : 0; }

  function draw() {
    if (bounded) drawRing(); else drawStrip();
    q('pstate').textContent = stateText(S.p, 'p');
    q('cstate').textContent = stateText(S.c, 'c');
    q('pstate').classList.toggle('waiting', S.p.mode === 'waiting');
    q('cstate').classList.toggle('waiting', S.c.mode === 'waiting');
    var P = num('prod'), C = num('cons');
    q('pbar').style.width = (S.p.mode === 'making' ? Math.round(100 * S.p.t / P) : 0) + '%';
    q('cbar').style.width = (S.c.mode === 'using' ? Math.round(100 * S.c.t / C) : 0) + '%';
    q('pwait').textContent = 'Spent ' + pct(S.p) + '% of the time waiting';
    q('cwait').textContent = 'Spent ' + pct(S.c) + '% of the time waiting';
    q('made').textContent = S.made;
    q('used').textContent = S.used;
    q('inbuf').textContent = count();
    q('in').textContent = S.inp;
    q('out').textContent = S.outp;
    q('log').innerHTML = S.log.length ? S.log.map(esc).join('<br>') : '<span class="muted">Press Start.</span>';
  }

  function frame(ts) {
    if (!running) return;
    var dt = last ? Math.min((ts - last) / 1000, 0.1) : 0;
    last = ts;
    var sub = 4;
    for (var k = 0; k < sub; k++) step(dt / sub);
    draw();
    requestAnimationFrame(frame);
  }

  function toggle() {
    running = !running;
    q('play').textContent = running ? 'Pause' : 'Resume';
    if (running) { last = 0; requestAnimationFrame(frame); }
  }

  q('play').addEventListener('click', toggle);
  q('reset').addEventListener('click', reset);
  q('prod').addEventListener('input', function () { labels(); draw(); });
  q('cons').addEventListener('input', function () { labels(); draw(); });
  if (bounded) q('size').addEventListener('input', function () { reset(); });
  registerWidget(root, function (e) {
    if (e.key === ' ') { e.preventDefault(); toggle(); }
    else if (e.key === 'Home') { reset(); }
  });
  reset();
}
