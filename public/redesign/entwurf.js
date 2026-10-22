/* Redesign-Entwurf Startseite: Varianten-Umschalter, Intro, Kopfleiste, Einblenden, Player/Radio */
(function () {
  var body = document.body;

  // ------------------------------------------------ Varianten (Logo-Drehung, Abgrenzung): URL ?logo=record&sep=b, sonst zuletzt gewählt
  var store = { get: function (k) { try { return localStorage.getItem('entwurf-' + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('entwurf-' + k, v); } catch (e) {} } };
  var params = new URLSearchParams(location.search);
  var state = { logo: params.get('logo') || store.get('logo') || 'coin', sep: params.get('sep') || store.get('sep') || 'a' };
  function apply() {
    body.classList.remove('logo-coin', 'logo-record', 'sep-a', 'sep-b', 'sep-c');
    body.classList.add('logo-' + state.logo, 'sep-' + state.sep);
    document.querySelectorAll('[data-set]').forEach(function (b) { b.setAttribute('aria-pressed', String(state[b.dataset.set] === b.dataset.val)); });
    var u = new URL(location.href); u.searchParams.set('logo', state.logo); u.searchParams.set('sep', state.sep); history.replaceState(null, '', u);
  }
  function replayIntro() {
    body.classList.remove('intro-done');
    var l = document.getElementById('introLogo');
    l.style.animation = 'none'; void l.offsetWidth; l.style.animation = '';
    document.querySelectorAll('.intro-title, .intro-bar').forEach(function (el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
  }
  document.querySelectorAll('[data-set]').forEach(function (b) {
    b.addEventListener('click', function () {
      state[b.dataset.set] = b.dataset.val; store.set(b.dataset.set, b.dataset.val); apply();
      if (b.dataset.set === 'logo') { scrollTo({ top: 0 }); replayIntro(); }
    });
  });
  document.querySelector('[data-replay]').addEventListener('click', function () { scrollTo({ top: 0 }); replayIntro(); });
  apply();
  // auf schmalen Bildschirmen eingeklappt starten
  if (innerWidth < 900) document.getElementById('switcher').removeAttribute('open');

  // ------------------------------------------------ Intro fertig → Glanz, Lichtlauf übers Menü
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('introLogo').addEventListener('animationend', function (e) { if (e.target.id === 'introLogo') body.classList.add('intro-done'); });
  if (reduce) body.classList.add('intro-done');

  // ------------------------------------------------ Kopfleiste: ab Ende des Intros Hintergrund/Abgrenzung
  var intro = document.getElementById('intro');
  function onScroll() { body.classList.toggle('scrolled', scrollY > intro.offsetHeight - 90); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Menü am Handy
  var toggle = document.querySelector('.menu-toggle'), nav = document.getElementById('nav');
  toggle.addEventListener('click', function () { var open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });

  // ------------------------------------------------ Einblenden beim Scrollen (einmalig)
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // ------------------------------------------------ Player: eine Warteschlange für Release-Tracks oder Dicular Radio,
  // gesteuert über die Knöpfe auf der Seite und die Player-Leiste (zurück / abspielen / vor / spulen)
  var player = document.getElementById('player');
  var radioBtn = document.getElementById('radioBtn'), radioNow = document.getElementById('radioNow');
  var bar = document.getElementById('playerbar'), seek = document.getElementById('pbSeek');
  var trackBtns = [].slice.call(document.querySelectorAll('.play'));
  var releaseQueue = trackBtns.map(function (b) { return { title: b.dataset.title, artist: (b.parentNode.querySelector('em') || {}).textContent || '', src: b.dataset.src, btn: b }; });
  var radioQueue = JSON.parse(radioBtn.dataset.playlist || '[]');
  for (var i = radioQueue.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = radioQueue[i]; radioQueue[i] = radioQueue[j]; radioQueue[j] = t; }
  var queue = [], idx = 0, mode = null; // mode: 'release' | 'radio'

  function mark() {
    document.querySelectorAll('.play.on, .radio-disc.on').forEach(function (b) { b.classList.remove('on'); });
    var playing = !player.paused;
    bar.classList.toggle('playing', playing);
    if (!playing) return;
    if (mode === 'radio') radioBtn.classList.add('on'); else if (queue[idx] && queue[idx].btn) queue[idx].btn.classList.add('on');
  }
  function load(n) {
    if (!queue.length) return;
    idx = (n + queue.length) % queue.length;
    var t = queue[idx];
    player.src = t.src; player.play().catch(function () {});
    bar.hidden = false;
    document.getElementById('pbTitle').textContent = t.title;
    document.getElementById('pbArtist').textContent = t.artist || '';
    document.getElementById('pbSource').textContent = mode === 'radio' ? 'Dicular Radio' : 'Release · ' + (idx + 1) + '/' + queue.length;
    if (mode === 'radio') radioNow.textContent = 'Läuft: ' + t.title + (t.artist ? ' – ' + t.artist : '');
  }
  function playPause() { if (!queue.length) return; if (player.paused) player.play().catch(function () {}); else player.pause(); }
  function playFrom(m, q, n) {
    if (mode === m && idx === n && player.src) { playPause(); return; }
    mode = m; queue = q; load(n);
  }
  trackBtns.forEach(function (b, n) { b.addEventListener('click', function () { playFrom('release', releaseQueue, n); }); });
  radioBtn.addEventListener('click', function () { playFrom('radio', radioQueue, mode === 'radio' ? idx : 0); });
  document.getElementById('pbToggle').addEventListener('click', playPause);
  // zurück: nach den ersten Sekunden an den Anfang des Tracks, sonst zum vorherigen
  document.getElementById('pbPrev').addEventListener('click', function () { if (player.currentTime > 3) player.currentTime = 0; else load(idx - 1); });
  document.getElementById('pbNext').addEventListener('click', function () { load(idx + 1); });
  player.addEventListener('ended', function () {
    if (mode === 'release' && idx === queue.length - 1) { mark(); return; } // Release zu Ende → anhalten
    load(idx + 1);
  });
  ['play', 'pause'].forEach(function (ev) { player.addEventListener(ev, mark); });
  player.addEventListener('pause', function () { if (mode === 'radio') radioNow.textContent = 'Pausiert'; });

  // Fortschritt und Spulen
  var fmt = function (s) { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };
  var dragging = false;
  player.addEventListener('timeupdate', function () {
    document.getElementById('pbCur').textContent = fmt(player.currentTime);
    document.getElementById('pbDur').textContent = fmt(player.duration);
    if (!dragging && player.duration) seek.value = Math.round(player.currentTime / player.duration * 1000);
  });
  seek.addEventListener('input', function () { dragging = true; });
  seek.addEventListener('change', function () { if (player.duration) player.currentTime = seek.value / 1000 * player.duration; dragging = false; });
})();
