/* Menü-Idee F, Synth-Panel: Ein Signal läuft sichtbar von „Out“ über die Buchsen bis zur aktuellen Seite. Fährt man über einen
   Menüpunkt, läuft die Signalfront dorthin und die Regler auf dem Weg leuchten auf. Läuft Musik, schlägt das Signal stärker aus.
   Ton nur nach Einschalten. */
(function () {
  var root = document.documentElement, top = document.getElementById('top');
  var out = document.getElementById('synOut'), home = document.getElementById('synHome'), soundBtn = document.getElementById('synSound');
  var player = document.getElementById('player');
  if (!top || !out || !home) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.createElement('canvas'); canvas.id = 'synSignal'; canvas.setAttribute('aria-hidden', 'true');
  top.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var links = [].slice.call(document.querySelectorAll('.nav a'));
  var currentLink = document.querySelector('.nav a[aria-current="page"]');
  var nodes = [], x0 = 0, y0 = 0, xEnd = 0, front = 0, goal = 0, goalLink = currentLink, colour = '#c4ced6', frames = 0;
  var SPEED = 1500, BEAT = 0.48; // Pixel pro Sekunde; ein Schlag bei 125 BPM

  function active() { return root.classList.contains('menu-f') && innerWidth > 900; }
  function jackX(el) { var r = el.getBoundingClientRect(); return r.left + r.width / 2; }
  function goalFor(link) { return link ? jackX(link.querySelector('.syn-jack')) : jackX(home); }

  function measure() {
    var box = top.getBoundingClientRect(), r = out.getBoundingClientRect(), ratio = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(box.width * ratio); canvas.height = Math.round(box.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    x0 = r.left + r.width / 2; y0 = r.top + r.height / 2 - box.top;
    nodes = links.map(function (a) { return { a: a, x: jackX(a.querySelector('.syn-jack')) }; });
    xEnd = nodes.length ? nodes[nodes.length - 1].x : box.width;
    goal = goalFor(goalLink);
  }

  function wave(x, t, amp) {
    var edge = Math.min(1, (x - x0) / 46) * Math.min(1, (front - x) / 46 + 0.25); // läuft am Anfang und an der Front weich aus
    var breathe = 0.72 + 0.28 * Math.sin(x * 0.005 - t * 1.4);
    return y0 + amp * edge * breathe * (0.62 * Math.sin(x * 0.046 - t * 6.2) + 0.38 * Math.sin(x * 0.113 - t * 9.7));
  }

  function draw(t) {
    var w = canvas.width, h = canvas.height;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h); ctx.restore();
    // Leiterbahn: ruhig und matt bis zur letzten Buchse
    ctx.globalAlpha = 0.22; ctx.lineWidth = 1; ctx.strokeStyle = colour; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xEnd, y0);
    // aufgedruckte Pfeile zeigen die Laufrichtung zwischen den Buchsen
    nodes.forEach(function (n, i) {
      var from = i ? nodes[i - 1].x : x0, mid = (from + n.x) / 2;
      ctx.moveTo(mid - 3, y0 - 3); ctx.lineTo(mid + 1, y0); ctx.lineTo(mid - 3, y0 + 3);
    });
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (front <= x0 + 1) return;
    // Mit Musik schlägt das Signal im Takt stärker aus
    var playing = player && !player.paused;
    var kick = playing ? Math.exp(-((t % BEAT) / BEAT) * 5) : 0;
    var amp = (playing ? 7 : 4.5) * (1 + 0.5 * kick);
    ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.strokeStyle = colour; ctx.shadowColor = colour; ctx.shadowBlur = 9;
    ctx.beginPath();
    for (var x = x0; x <= front; x += 3) { var y = wave(x, t, amp); if (x === x0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.stroke();
    // Impulse laufen durch das Signal zur Front
    var span = front - x0, count = Math.max(1, Math.round(span / 240));
    ctx.fillStyle = '#ffffff'; ctx.shadowBlur = 12;
    for (var i = 0; i < count; i++) {
      var px = x0 + ((t * 230 + (i / count) * span) % span);
      ctx.beginPath(); ctx.arc(px, wave(px, t, amp), 2, 0, Math.PI * 2); ctx.fill();
    }
    // Front
    ctx.fillStyle = colour; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(front, y0, 3.5 + kick, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  function light() {
    var there = Math.abs(front - goal) < 3;
    nodes.forEach(function (n) {
      n.a.classList.toggle('sig-lit', n.x <= front + 2);
      n.a.classList.toggle('sig-on', there && n.a === goalLink);
    });
    home.classList.toggle('sig-on', there && !goalLink);
  }

  var last = 0, running = false;
  function frame(now) {
    if (!active() || document.hidden) { running = false; return; }
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    var d = goal - front, stepBy = SPEED * dt;
    front = Math.abs(d) <= stepBy ? goal : front + (d > 0 ? stepBy : -stepBy);
    if (frames++ % 12 === 0) colour = getComputedStyle(root).getPropertyValue('--c').trim() || colour;
    draw(now / 1000); light();
    requestAnimationFrame(frame);
  }
  function run() {
    if (!active()) return;
    measure();
    if (reduce) { // keine Bewegung: Signal liegt still an
      colour = getComputedStyle(root).getPropertyValue('--c').trim() || colour;
      front = goal; draw(0); light(); return;
    }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }
  function aim(link) { goalLink = link; if (active()) { goal = goalFor(link); if (reduce) run(); } }

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

  links.forEach(function (a) {
    function enter() { aim(a); tick(); }
    function leave() { aim(currentLink); }
    a.addEventListener('mouseenter', enter); a.addEventListener('focus', enter);
    a.addEventListener('mouseleave', leave); a.addEventListener('blur', leave);
  });

  // Display: zeigt, was unter der Maus liegt; sonst den Namen des Geräts und was gerade läuft
  var line1 = document.getElementById('synLine1'), line2 = document.getElementById('synLine2'), typing = 0, shown = '';
  var IDLE = line1.textContent, IDLE2 = line2.textContent, pageName = currentLink ? currentLink.querySelector('.syn-label').textContent : IDLE2; // Gerätename steht im Display (Label: Dicular DR-1, Artist-Seite: Name des Artists)
  function say(a, b) {
    if (a + '|' + b === shown) return;
    shown = a + '|' + b; line1.textContent = a; clearInterval(typing);
    if (reduce) { line2.textContent = b; return; }
    var n = 0; line2.textContent = '';
    typing = setInterval(function () { n += 2; line2.textContent = b.slice(0, n); if (n >= b.length) clearInterval(typing); }, 16);
  }
  function idle() {
    var title = document.getElementById('pbTitle');
    if (player && !player.paused && title && title.textContent) say('Now playing', title.textContent);
    else say(IDLE, pageName);
  }
  function txt(root, sel) { var el = root.querySelector(sel); return el ? el.textContent.trim() : ''; }
  function describe(t) {
    var el = t.closest('[data-hint], .jump a, .play[data-title], .radio-disc, .btn, .mix-row, .gig-row, .news-card, .v2-tile, .v2-band, .v2-names a');
    if (!el) return null;
    if (el.dataset.hint) return [el.dataset.title || txt(el, '.syn-label') || el.textContent.trim(), el.dataset.hint];
    if (el.matches('.jump a')) return [el.textContent.trim(), 'Jump to this section'];
    if (el.matches('.play')) return [el.dataset.title, 'Play' + (el.dataset.artist ? ' · ' + el.dataset.artist : '')];
    if (el.matches('.radio-disc')) return ['Dicular Radio', 'All releases, shuffled'];
    if (el.matches('.btn')) return [el.textContent.trim(), el.target === '_blank' ? 'Opens in a new tab' : 'Opens this page'];
    if (el.matches('.mix-row')) return [txt(el, 'strong'), 'Mix. Play loads the SoundCloud player'];
    if (el.matches('.gig-row')) return [txt(el, 'strong'), txt(el, '.date').replace(/^(\d\d)/, '$1 ') + ' · ' + txt(el, '.gig-day')];
    if (el.matches('.news-card')) return [txt(el, 'strong'), txt(el, 'time')];
    if (el.matches('.v2-tile')) {
      var a = el.querySelector('a'), href = a ? a.getAttribute('href') : '';
      return [txt(el, '.namebar'), txt(el, '.tile-meta') || (/^\/release\//.test(href) ? 'View release' : 'Open profile')];
    }
    if (el.matches('.v2-band')) return [txt(el, 'h2'), 'View release'];
    return [el.textContent.trim(), 'Open artist'];
  }
  function point(e) {
    if (!active() || !e.target.closest) return;
    var d = describe(e.target);
    if (d) say(d[0], d[1]); else idle();
  }
  document.addEventListener('mouseover', point);
  document.addEventListener('focusin', point);
  if (player) { player.addEventListener('play', idle); player.addEventListener('pause', idle); player.addEventListener('playing', idle); }
  idle();

  // Die Front startet bei „Out“ und läuft beim Laden zur aktuellen Seite
  front = 0;
  function start() { if (front === 0) { measure(); front = x0; } run(); }
  addEventListener('resize', start);
  top.addEventListener('transitionend', function (e) { if (e.target === top) start(); });
  document.addEventListener('v2-menu', start);
  document.addEventListener('visibilitychange', start);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  start();
})();
