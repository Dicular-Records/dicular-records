/* Redesign: Varianten-Umschalter, Intro (Startseite), Kopfleiste, Einblenden, Zwei-Klick-Player, Player-Leiste/Radio */
(function () {
  var body = document.body, $ = function (id) { return document.getElementById(id); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  // Varianten beim Wechsel auf andere Seiten des Entwurfs mitnehmen
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    var u = new URL(a.href, location.href);
    if (u.origin === location.origin && !/\.[a-z0-9]{2,5}$/i.test(u.pathname)) { u.searchParams.set('logo', state.logo); u.searchParams.set('sep', state.sep); a.href = u.href; }
  }, true);
  var introLogo = $('introLogo');
  function replayIntro() {
    if (!introLogo) return;
    body.classList.remove('intro-done');
    introLogo.style.animation = 'none'; void introLogo.offsetWidth; introLogo.style.animation = '';
    document.querySelectorAll('.intro-title, .intro-bar').forEach(function (el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
  }
  document.querySelectorAll('[data-set]').forEach(function (b) {
    b.addEventListener('click', function () {
      state[b.dataset.set] = b.dataset.val; store.set(b.dataset.set, b.dataset.val); apply();
      if (b.dataset.set === 'logo') { scrollTo({ top: 0 }); replayIntro(); }
    });
  });
  var replay = document.querySelector('[data-replay]');
  if (replay) replay.addEventListener('click', function () { scrollTo({ top: 0 }); replayIntro(); });
  apply();
  // auf schmalen Bildschirmen eingeklappt starten
  if (innerWidth < 900) $('switcher').removeAttribute('open');

  // ------------------------------------------------ Intro (nur Startseite) fertig → Glanz, Lichtlauf übers Menü
  if (introLogo) {
    introLogo.addEventListener('animationend', function (e) { if (e.target === introLogo) body.classList.add('intro-done'); });
    if (reduce) body.classList.add('intro-done');
  }

  // ------------------------------------------------ Kopfleiste: Startseite ab Ende des Intros, Unterseiten immer „gescrollt“
  var intro = $('intro');
  if (intro) {
    // „glass“: sobald gescrollt wird, Milchglas unter dem Menü, damit das Intro-Logo darunter verschwindet
    var onScroll = function () { body.classList.toggle('scrolled', scrollY > intro.offsetHeight - 90); body.classList.toggle('glass', scrollY > 8); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // Menü am Handy
  var menuBtn = document.querySelector('.menu-toggle'), nav = $('nav');
  menuBtn.addEventListener('click', function () { var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); });

  // ------------------------------------------------ Einblenden beim Scrollen (einmalig)
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // ------------------------------------------------ Nur Entwurf: Die neue Startseite liegt noch unter /entwurf/ (unter / liegt die 1:1-Fassung)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    var url = new URL(a.href, location.href);
    if (url.origin === location.origin && url.pathname === '/') { e.preventDefault(); location.href = '/entwurf/' + url.search; }
  });

  // ------------------------------------------------ Sprachumschalter für zweisprachige Texte (EN/DE)
  document.querySelectorAll('.lang-switch').forEach(function (sw) {
    var prose = sw.parentElement.querySelector('[data-show-lang]');
    sw.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]'); if (!b || !prose) return;
      prose.setAttribute('data-show-lang', b.dataset.lang);
      sw.querySelectorAll('[data-lang]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });

  // ------------------------------------------------ Zwei-Klick-Player (YouTube, SoundCloud): erst der Klick lädt den fremden Inhalt
  document.addEventListener('click', function (e) {
    var load = e.target.closest && e.target.closest('.dicular-embed-load');
    if (!load) return;
    e.preventDefault();
    var box = load.closest('.dicular-embed'), h = box.getAttribute('data-embed-height');
    var frame = document.createElement('iframe');
    frame.src = box.getAttribute('data-embed-src');
    frame.allow = 'autoplay; encrypted-media; fullscreen'; frame.allowFullscreen = true;
    if (h) { frame.height = h; frame.style.height = h + 'px'; }
    box.innerHTML = ''; box.classList.add('loaded'); box.appendChild(frame);
    if (!player.paused) player.pause(); // eigene Musik anhalten
  });

  // ------------------------------------------------ Player: eine Warteschlange für Release-Tracks oder Dicular Radio,
  // gesteuert über die Knöpfe auf der Seite und die Player-Leiste (zurück / abspielen / vor / spulen)
  var player = $('player');
  var radioBtn = $('radioBtn'), radioNow = $('radioNow');
  var bar = $('playerbar'), seek = $('pbSeek');
  var trackBtns = [].slice.call(document.querySelectorAll('button.play'));
  var releaseQueue = trackBtns.map(function (b) { return { title: b.dataset.title, artist: b.dataset.artist || '', src: b.dataset.src, btn: b }; });
  var radioQueue = radioBtn ? JSON.parse(radioBtn.dataset.playlist || '[]') : [];
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
    $('pbTitle').textContent = t.title;
    $('pbArtist').textContent = t.artist || '';
    $('pbSource').textContent = mode === 'radio' ? 'Dicular Radio' : 'Release · ' + (idx + 1) + '/' + queue.length;
    if (mode === 'radio' && radioNow) radioNow.textContent = 'Now playing: ' + t.title + (t.artist ? ' – ' + t.artist : '');
  }
  function playPause() { if (!queue.length) return; if (player.paused) player.play().catch(function () {}); else player.pause(); }
  function playFrom(m, q, n) {
    if (mode === m && idx === n && player.src) { playPause(); return; }
    mode = m; queue = q; load(n);
  }
  trackBtns.forEach(function (b, n) { b.addEventListener('click', function () { playFrom('release', releaseQueue, n); }); });
  if (radioBtn) radioBtn.addEventListener('click', function () { playFrom('radio', radioQueue, mode === 'radio' ? idx : 0); });
  $('pbToggle').addEventListener('click', playPause);
  // zurück: nach den ersten Sekunden an den Anfang des Tracks, sonst zum vorherigen
  $('pbPrev').addEventListener('click', function () { if (player.currentTime > 3) player.currentTime = 0; else load(idx - 1); });
  $('pbNext').addEventListener('click', function () { load(idx + 1); });
  player.addEventListener('ended', function () {
    if (mode === 'release' && idx === queue.length - 1) { mark(); return; } // Release zu Ende → anhalten
    load(idx + 1);
  });
  ['play', 'pause'].forEach(function (ev) { player.addEventListener(ev, mark); });
  player.addEventListener('pause', function () { if (mode === 'radio' && radioNow) radioNow.textContent = 'Paused'; });

  // Fortschritt und Spulen
  var fmt = function (s) { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };
  var dragging = false;
  player.addEventListener('timeupdate', function () {
    $('pbCur').textContent = fmt(player.currentTime);
    $('pbDur').textContent = fmt(player.duration);
    if (!dragging && player.duration) seek.value = Math.round(player.currentTime / player.duration * 1000);
  });
  seek.addEventListener('input', function () { dragging = true; });
  seek.addEventListener('change', function () { if (player.duration) player.currentTime = seek.value / 1000 * player.duration; dragging = false; });
})();
