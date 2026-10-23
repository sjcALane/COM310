// Shared stepper for COM310 demos.
// Each page calls Stepper({ code, tags, steps, panelColumns }). See _template/index.html for the format.
function Stepper(cfg) {
  var i = 0;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var tags = cfg.tags || {};
  if (cfg.panelColumns === 2) document.getElementById('panels').classList.add('cols-2');

  function tagHTML(t) { return '<span class="tag ' + (tags[t] || 'outline') + '">' + esc(t) + '</span>'; }

  function panelHTML(p) {
    var head = '<h2>' + (p.tag ? tagHTML(p.tag) : '') + esc(p.title) + '</h2>';
    if (p.gone) return { cls: 'panel gone', html: head + '<div>' + esc(p.gone) + '</div>' };
    var rows = (p.rows || []).map(function (r) {
      return '<dt>' + esc(r[0]) + '</dt><dd' + (r[2] ? ' class="hot"' : '') + '>' + esc(r[1]) + '</dd>';
    }).join('');
    return { cls: 'panel', html: head + '<dl class="kv">' + rows + '</dl>' };
  }

  function draw() {
    var s = cfg.steps[i];
    var at = s.at || [];
    $('code').innerHTML = cfg.code.map(function (line, n) {
      var here = at.filter(function (a) { return a.line === n; });
      var marks = here.map(function (a) { return tagHTML(a.tag); }).join('');
      return '<div class="ln' + (here.length ? ' on' : '') + '"><span class="marks">' + marks + '</span>' + esc(line) + '</div>';
    }).join('');
    $('panels').innerHTML = (s.panels || []).map(function (p) {
      var r = panelHTML(p);
      return '<section class="' + r.cls + '">' + r.html + '</section>';
    }).join('');
    var out = s.out || [];
    $('out').innerHTML = out.length ? out.map(esc).join('<br>') : '<span style="color:var(--muted)">nothing yet</span>';
    $('cap').textContent = s.text || '';
    $('cnt').textContent = 'Step ' + (i + 1) + ' of ' + cfg.steps.length;
    $('back').disabled = i === 0;
    $('next').disabled = i === cfg.steps.length - 1;
  }

  function go(d) { var n = i + d; if (n >= 0 && n < cfg.steps.length) { i = n; draw(); } }
  $('next').addEventListener('click', function () { go(1); });
  $('back').addEventListener('click', function () { go(-1); });
  $('reset').addEventListener('click', function () { i = 0; draw(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
    else if (e.key === 'Home') { i = 0; draw(); }
  });
  draw();
}
