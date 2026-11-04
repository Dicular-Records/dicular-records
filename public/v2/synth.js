/* Menü-Idee F, Synth-Panel: Ein Patch-Kabel steckt in der Buchse der aktuellen Seite. Beim Darüberfahren zeigt der Stecker auf den
   Menüpunkt, beim Seitenwechsel wandert er von der alten Buchse zur neuen und das Kabel schwingt nach. Ton nur nach Einschalten. */
(function () {
  var root = document.documentElement, top = document.getElementById('top');
  var out = document.getElementById('synOut'), home = document.getElementById('synHome'), soundBtn = document.getElementById('synSound');
  if (!top || !out || !home) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = window.sessionStorage;
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NS, 'svg'); svg.id = 'synCable'; svg.setAttribute('aria-hidden', 'true');
  function shape(tag, cls, parent) { var el = document.createElementNS(NS, tag); el.setAttribute('class', cls); parent.appendChild(el); return el; }
  var shade = shape('path', 'syn-cable-shade', svg), line = shape('path', 'syn-cable-line', svg);
  var plugA = shape('rect', 'syn-plug', svg), plugB = shape('rect', 'syn-plug', svg);
  [plugA, plugB].forEach(function (p) { p.setAttribute('width', 10); p.setAttribute('height', 20); p.setAttribute('rx', 2); });
  document.body.appendChild(svg);

  var currentLink = document.querySelector('.nav a[aria-current="page"]');
  function jackOf(el) { return el ? el.querySelector('.syn-jack') : home; }
  function centre(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  var target = jackOf(currentLink);
  var from = { x: 0, y: 0 }, x = 0, y = 0, tx = 0, ty = 0, vx = 0, vy = 0, last = 0, running = false;

  function draw() {
    var dx = Math.abs(x - from.x), wobble = Math.min(70, (Math.abs(vx) + Math.abs(vy)) * 0.05);
    var sag = Math.min(190, 46 + dx * 0.13) + wobble;
    var swing = reduce ? 0 : Math.max(-46, Math.min(46, vx * -0.03));
    var d = 'M' + from.x + ' ' + from.y + 'C' + from.x + ' ' + (from.y + sag) + ' ' + (x + swing) + ' ' + (y + sag) + ' ' + x + ' ' + y;
    shade.setAttribute('d', d); line.setAttribute('d', d);
    plugA.setAttribute('x', from.x - 5); plugA.setAttribute('y', from.y - 3);
    plugB.setAttribute('x', x - 5); plugB.setAttribute('y', y - 3);
  }
  function step(now) {
    var dt = Math.min(0.033, (now - last) / 1000 || 0.016); last = now;
    vx += (90 * (tx - x) - 11 * vx) * dt; vy += (90 * (ty - y) - 11 * vy) * dt;
    x += vx * dt; y += vy * dt;
    draw();
    if (Math.abs(tx - x) + Math.abs(ty - y) < 0.3 && Math.abs(vx) + Math.abs(vy) < 2) { x = tx; y = ty; vx = vy = 0; draw(); running = false; return; }
    requestAnimationFrame(step);
  }
  function aim(el) {
    target = el;
    var c = centre(el); tx = c.x; ty = c.y;
    if (reduce) { x = tx; y = ty; draw(); return; }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); }
  }
  // Maße neu lesen (Fenstergröße, Panel eingefahren); Stecker springt ohne Schwingung auf die Buchse
  function settle() {
    from = centre(out);
    var c = centre(target); tx = c.x; ty = c.y;
    if (running) return; // Stecker ist unterwegs: nur das Ziel nachführen
    x = c.x; y = c.y; vx = vy = 0; draw();
  }

  // Ton: nur nach Einschalten, kurzes Klicken beim Drehen eines Reglers
  var audio = null, soundOn = false;
  function tick() {
    if (!soundOn || !audio) return;
    var o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
    o.type = 'square'; o.frequency.setValueAtTime(1500, t); o.frequency.exponentialRampToValueAtTime(380, t + 0.03);
    g.gain.setValueAtTime(0.035, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + 0.05);
  }
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    if (soundOn) { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); tick(); }
  });

  document.querySelectorAll('.nav a').forEach(function (a) {
    function enter() { if (root.classList.contains('menu-f')) { aim(jackOf(a)); tick(); } }
    function leave() { if (root.classList.contains('menu-f')) aim(jackOf(currentLink)); }
    a.addEventListener('mouseenter', enter); a.addEventListener('focus', enter);
    a.addEventListener('mouseleave', leave); a.addEventListener('blur', leave);
    a.addEventListener('click', function () { try { store.setItem('v2-plug', String(centre(jackOf(currentLink)).x)); } catch (e) {} }); // die Buchse, von der es losgeht
  });
  top.addEventListener('mouseleave', function () { if (root.classList.contains('menu-f')) aim(jackOf(currentLink)); });

  var started = false;
  function start() {
    if (!root.classList.contains('menu-f') || innerWidth <= 900) return;
    settle();
    if (started) return;
    started = true;
    // Seitenwechsel: von der alten Buchse zur neuen wandern
    var prev = null;
    try { prev = store.getItem('v2-plug'); store.removeItem('v2-plug'); } catch (e) {}
    if (prev && !reduce) { x = parseFloat(prev); vx = 0; draw(); aim(target); }
  }
  addEventListener('resize', start);
  top.addEventListener('transitionend', function (e) { if (e.target === top) start(); });
  document.addEventListener('v2-menu', start);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  start();
})();
