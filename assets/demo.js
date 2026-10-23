// Shared widgets for COM310 demo pages.
//   Stepper({ root, code, tags, steps, panelColumns, clips })
//       Click-through trace of the code. With clips: true, it also drives an animation:
//       a step with clip: N plays clips/NN when you reach it, and the video holds still
//       on steps without a clip. One Next button moves the code and the animation together.
//   Player({ root, clips })
//       Animation clips on their own, one per click, for pages without a trace.
// See _template/index.html for how a page puts these together.

var COM310 = window.COM310 || (window.COM310 = { widgets: [], active: null });

// Keyboard: arrow keys and the space bar go to whichever section was clicked last.
function registerWidget(root, onKey) {
  var w = { root: root, onKey: onKey };
  COM310.widgets.push(w);
  if (!COM310.active) COM310.active = w;
  var activate = function () { COM310.active = w; };
  root.addEventListener('pointerdown', activate);
  root.addEventListener('focusin', activate);
  if (!COM310.keysBound) {
    COM310.keysBound = true;
    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.tagName === 'SUMMARY')) return;
      if (COM310.active) COM310.active.onKey(e);
    });
  }
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

// ---------------------------------------------------------------- ClipStage
// Two stacked videos so a new clip can load behind the current one and swap in without a
// blank flash. Clips come as .mp4 (H.264) and .webm (VP9); the browser gets whichever it plays.
function ClipStage(stage, count) {
  var probe = document.createElement('video');
  var ext = probe.canPlayType('video/mp4; codecs="avc1.42E01E"') ? '.mp4' : '.webm';
  var vids = [document.createElement('video'), document.createElement('video')];
  vids.forEach(function (v) {
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    stage.appendChild(v);
  });
  var front = 0, token = 0, onEnded = null;

  function src(n) { return 'clips/' + (n < 10 ? '0' : '') + n + ext; }
  function load(v, n) { if (v.dataset.n !== String(n)) { v.src = src(n); v.dataset.n = String(n); v.load(); } }
  function swapTo(v, t) {
    if (t !== token) return;
    var old = vids[front];
    v.classList.add('front');
    if (old !== v) { old.classList.remove('front'); old.pause(); }
    front = vids.indexOf(v);
  }
  function whenReady(v, fn) {
    if (v.readyState >= 1) fn(); else v.addEventListener('loadedmetadata', fn, { once: true });
  }
  function preload(n) { if (n >= 1 && n <= count) load(vids[1 - front], n); }

  // Play clip n from the start.
  function play(n) {
    var t = ++token, v = vids[1 - front];
    load(v, n);
    whenReady(v, function () {
      if (t !== token) return;
      v.currentTime = 0;
      var done = false;
      var go = function () { if (!done) { done = true; swapTo(v, t); preload(n + 1); } };
      v.addEventListener('playing', go, { once: true });
      var p = v.play();
      if (p && p.catch) p.catch(go);
    });
  }

  // Show clip n paused on its first or last frame.
  function still(n, atEnd) {
    var t = ++token, v = vids[1 - front];
    load(v, n);
    whenReady(v, function () {
      if (t !== token) return;
      v.pause();
      var target = atEnd ? Math.max(0, v.duration - 0.04) : 0;
      if (Math.abs(v.currentTime - target) < 0.01 && v.readyState >= 2) { swapTo(v, t); return; }
      v.addEventListener('seeked', function () { swapTo(v, t); }, { once: true });
      v.currentTime = target;
    });
  }

  vids.forEach(function (v) {
    v.addEventListener('ended', function () { if (v === vids[front] && onEnded) onEnded(Number(v.dataset.n)); });
  });

  load(vids[0], 1); vids[0].classList.add('front');
  return { play: play, still: still, onEnded: function (fn) { onEnded = fn; } };
}

// ---------------------------------------------------------------- Stepper
function Stepper(cfg) {
  var root = document.getElementById(cfg.root || 'trace');
  var q = function (role) { return root.querySelector('[data-role="' + role + '"]'); };
  var steps = cfg.steps;
  var i = 0;
  var tags = cfg.tags || {};
  var panels = q('panels');
  if (panels && cfg.panelColumns === 2) panels.classList.add('cols-2');

  // Animation support
  var stage = null, played = false;
  if (cfg.clips) {
    var count = 0;
    steps.forEach(function (s) { if (s.clip && s.clip > count) count = s.clip; });
    stage = ClipStage(q('stage'), count);
  }
  function clipAtOrBefore(k) {
    for (var j = k; j >= 0; j--) if (steps[j].clip) return steps[j].clip;
    return 0;
  }

  function tagHTML(t) { return '<span class="tag ' + (tags[t] || 'outline') + '">' + esc(t) + '</span>'; }

  function panelHTML(p) {
    var head = '<h3>' + (p.tag ? tagHTML(p.tag) : '') + esc(p.title) + '</h3>';
    if (p.gone) return { cls: 'panel gone', html: head + '<div>' + esc(p.gone) + '</div>' };
    var rows = (p.rows || []).map(function (r) {
      return '<dt>' + esc(r[0]) + '</dt><dd' + (r[2] ? ' class="hot"' : '') + '>' + esc(r[1]) + '</dd>';
    }).join('');
    return { cls: 'panel', html: head + '<dl class="kv">' + rows + '</dl>' };
  }

  function draw() {
    var s = steps[i];
    var at = s.at || [];
    q('code').innerHTML = cfg.code.map(function (line, n) {
      var here = at.filter(function (a) { return a.line === n; });
      var marks = here.map(function (a) { return a.tag ? tagHTML(a.tag) : ''; }).join('');
      return '<div class="ln' + (here.length ? ' on' : '') + '"><span class="marks">' + marks + '</span>' + esc(line) + '</div>';
    }).join('');
    if (panels) {
      panels.innerHTML = (s.panels || []).map(function (p) {
        var r = panelHTML(p);
        return '<section class="' + r.cls + '">' + r.html + '</section>';
      }).join('');
    }
    var out = s.out || [];
    q('out').innerHTML = out.length ? out.map(esc).join('<br>') : '<span class="muted">nothing yet</span>';
    q('cap').textContent = s.text || '';
    q('count').textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
    q('back').disabled = i === 0;
    var nx = q('next');
    if (stage && !played) { nx.textContent = 'Play'; nx.disabled = false; }
    else { nx.textContent = 'Next'; nx.disabled = i === steps.length - 1; }
    var rp = q('replay');
    if (rp) rp.disabled = !stage || !clipAtOrBefore(i);
  }

  function next() {
    if (stage && !played) {
      played = true;
      if (steps[i].clip) stage.play(steps[i].clip);
      draw(); return;
    }
    if (i >= steps.length - 1) return;
    i++;
    if (stage && steps[i].clip) stage.play(steps[i].clip);
    draw();
  }
  function back() {
    if (i === 0) return;
    i--;
    if (stage) { played = true; var c = clipAtOrBefore(i); if (c) stage.still(c, true); }
    draw();
  }
  function replay() {
    if (!stage) return;
    var c = steps[i].clip || clipAtOrBefore(i);
    if (c) { played = true; stage.play(c); draw(); }
  }
  function reset() {
    i = 0;
    if (stage) { played = false; if (steps[0].clip) stage.still(steps[0].clip, false); }
    draw();
  }

  q('next').addEventListener('click', next);
  q('back').addEventListener('click', back);
  q('reset').addEventListener('click', reset);
  if (q('replay')) q('replay').addEventListener('click', replay);
  registerWidget(root, function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); back(); }
    else if (e.key === 'Home') { reset(); }
  });
  draw();
}

// ---------------------------------------------------------------- Player
// Animation clips with captions and no code, for pages that don't have a trace.
function Player(cfg) {
  var root = document.getElementById(cfg.root || 'watch');
  var q = function (role) { return root.querySelector('[data-role="' + role + '"]'); };
  var clips = cfg.clips;
  var stage = ClipStage(q('stage'), clips.length);
  var i = 0, played = false, playingAll = false;

  function draw() {
    q('cap').textContent = played ? clips[i].text : (cfg.intro || 'Press Play to start the animation.');
    q('count').textContent = 'Clip ' + (i + 1) + ' of ' + clips.length;
    var nx = q('next');
    nx.textContent = played ? 'Next' : 'Play';
    nx.disabled = played && i === clips.length - 1;
    q('back').disabled = i === 0;
  }
  function playClip(k) { i = k; played = true; stage.play(k + 1); draw(); }
  function next() { if (!played) playClip(i); else if (i < clips.length - 1) playClip(i + 1); }
  function back() { if (i > 0) { i--; played = true; stage.still(i + 1, true); draw(); } }
  function reset() { playingAll = false; i = 0; played = false; stage.still(1, false); draw(); }

  stage.onEnded(function (n) {
    if (playingAll && n === i + 1 && i < clips.length - 1) playClip(i + 1);
    else if (playingAll) playingAll = false;
  });
  q('next').addEventListener('click', next);
  q('back').addEventListener('click', back);
  if (q('replay')) q('replay').addEventListener('click', function () { playClip(i); });
  if (q('all')) q('all').addEventListener('click', function () { playingAll = true; playClip(0); });
  q('reset').addEventListener('click', reset);
  registerWidget(root, function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); back(); }
    else if (e.key === 'Home') { reset(); }
  });
  draw();
}
