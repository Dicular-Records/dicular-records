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

  // ------------------------------------------------ Player: Track-Knöpfe und Dicular Radio teilen sich ein <audio>
  var player = document.getElementById('player'), current = null;
  var radioBtn = document.getElementById('radioBtn'), radioNow = document.getElementById('radioNow');
  var playlist = JSON.parse(radioBtn.dataset.playlist || '[]'), pos = 0;
  for (var i = playlist.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = playlist[i]; playlist[i] = playlist[j]; playlist[j] = t; }
  function setOn(btn) { document.querySelectorAll('.play.on, .radio-disc.on').forEach(function (b) { b.classList.remove('on'); }); if (btn) btn.classList.add('on'); current = btn; }
  function start(src, btn) { player.src = src; player.play().catch(function () {}); setOn(btn); }
  document.querySelectorAll('.play').forEach(function (b) {
    b.addEventListener('click', function () {
      if (current === b && !player.paused) { player.pause(); setOn(null); return; }
      start(b.dataset.src, b);
    });
  });
  function radioTrack() { var t = playlist[pos]; radioNow.textContent = 'Läuft: ' + t.title + (t.artist ? ' – ' + t.artist : ''); start(t.src, radioBtn); }
  radioBtn.addEventListener('click', function () {
    if (current === radioBtn && !player.paused) { player.pause(); setOn(null); radioNow.textContent = 'Pausiert'; return; }
    if (playlist.length) radioTrack();
  });
  player.addEventListener('ended', function () {
    if (current === radioBtn) { pos = (pos + 1) % playlist.length; radioTrack(); } else setOn(null);
  });
})();
