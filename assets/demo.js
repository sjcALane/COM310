// Shared widgets for COM310 demo pages.
//   Stepper({ root, code, tags, steps, panelColumns })  click-through trace of code
//   Player({ root, clips })                              animation clips, one per step
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
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      if (COM310.active) COM310.active.onKey(e);
    });
  }
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

// ---------------------------------------------------------------- Stepper
function Stepper(cfg) {
  var root = document.getElementById(cfg.root || 'trace');
  var q = function (role) { return root.querySelector('[data-role="' + role + '"]'); };
  var i = 0;
  var tags = cfg.tags || {};
  if (cfg.panelColumns === 2) q('panels').classList.add('cols-2');

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
    var s = cfg.steps[i];
    var at = s.at || [];
    q('code').innerHTML = cfg.code.map(function (line, n) {
      var here = at.filter(function (a) { return a.line === n; });
      var marks = here.map(function (a) { return tagHTML(a.tag); }).join('');
      return '<div class="ln' + (here.length ? ' on' : '') + '"><span class="marks">' + marks + '</span>' + esc(line) + '</div>';
    }).join('');
    q('panels').innerHTML = (s.panels || []).map(function (p) {
      var r = panelHTML(p);
      return '<section class="' + r.cls + '">' + r.html + '</section>';
    }).join('');
    var out = s.out || [];
    q('out').innerHTML = out.length ? out.map(esc).join('<br>') : '<span class="muted">nothing yet</span>';
    q('cap').textContent = s.text || '';
    q('count').textContent = 'Step ' + (i + 1) + ' of ' + cfg.steps.length;
    q('back').disabled = i === 0;
    q('next').disabled = i === cfg.steps.length - 1;
  }

  function go(d) { var n = i + d; if (n >= 0 && n < cfg.steps.length) { i = n; draw(); } }
  q('next').addEventListener('click', function () { go(1); });
  q('back').addEventListener('click', function () { go(-1); });
  q('reset').addEventListener('click', function () { i = 0; draw(); });
  registerWidget(root, function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
    else if (e.key === 'Home') { i = 0; draw(); }
  });
  draw();
}

// ---------------------------------------------------------------- Player
// Each clip picks up exactly where the last one ended, so the animation reads as one
// continuous movie that pauses after every step.
function Player(cfg) {
  var root = document.getElementById(cfg.root || 'watch');
  var q = function (role) { return root.querySelector('[data-role="' + role + '"]'); };
  var clips = cfg.clips;
  var stage = q('stage');
  var vids = [document.createElement('video'), document.createElement('video')];
  vids.forEach(function (v) {
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    stage.appendChild(v);
  });
  var front = 0, i = 0, played = false, playingAll = false;
  // Clips come as .mp4 (H.264) and .webm (VP9). Use mp4 where the browser can, webm otherwise.
  var probe = document.createElement('video');
  var ext = probe.canPlayType('video/mp4; codecs="avc1.42E01E"') ? '.mp4' : '.webm';
  function srcOf(k) { return clips[k].src.replace(/\.mp4$/, '') + ext; }

  function load(v, k) { if (v.dataset.k !== String(k)) { v.src = srcOf(k); v.dataset.k = String(k); v.load(); } }

  function show(k, autoplay) {
    var back = vids[1 - front];
    load(back, k);
    var swap = function () {
      back.classList.add('front'); vids[front].classList.remove('front');
      vids[front].pause(); front = 1 - front;
      if (k + 1 < clips.length) load(vids[1 - front], k + 1);
    };
    if (autoplay) {
      back.currentTime = 0;
      var p = back.play();
      var done = false;
      var once = function () { if (!done) { done = true; swap(); } };
      back.addEventListener('playing', once, { once: true });
      if (p && p.catch) p.catch(function () { once(); });
    } else {
      back.addEventListener('loadeddata', function () { swap(); }, { once: true });
      if (back.readyState >= 2) swap();
    }
    i = k; played = autoplay; draw();
  }

  function draw() {
    q('cap').textContent = played ? clips[i].text : (cfg.intro || 'Press Play to start the animation.');
    q('count').textContent = 'Clip ' + (i + 1) + ' of ' + clips.length;
    var primary = q('next');
    primary.textContent = played ? 'Next' : 'Play';
    primary.disabled = played && i === clips.length - 1;
    q('back').disabled = i === 0 && !played;
  }

  function next() {
    if (!played) { show(i, true); return; }
    if (i < clips.length - 1) show(i + 1, true);
  }
  function prev() { if (i > 0) show(i - 1, true); else if (played) show(0, true); }
  function replay() { show(i, true); }
  function reset() { playingAll = false; show(0, false); }

  vids.forEach(function (v) {
    v.addEventListener('ended', function () {
      if (playingAll && v === vids[front] && i < clips.length - 1) show(i + 1, true);
      else if (playingAll) playingAll = false;
    });
  });

  q('next').addEventListener('click', next);
  q('back').addEventListener('click', prev);
  q('replay').addEventListener('click', function () { if (played) replay(); else next(); });
  q('all').addEventListener('click', function () { playingAll = true; show(0, true); });
  q('reset').addEventListener('click', reset);
  registerWidget(root, function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { reset(); }
  });
  load(vids[0], 0); vids[0].classList.add('front');
  load(vids[1], 1 < clips.length ? 1 : 0);
  draw();
}
