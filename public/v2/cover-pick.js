/* Nur Entwurf: Ein beliebiges Release als „aktuell“ anzeigen, damit man die Wirkung der Cover vergleichen kann.
   Tauscht Hero, Farbe und Player. Bleibt beim Seitenwechsel erhalten; teilbar über ?aktuell=<release>. */
(function () {
  var list = JSON.parse(document.getElementById('coverData').textContent);
  var byId = {}; list.forEach(function (r) { byId[r.id] = r; });
  var original = list[0].id; // Liste beginnt mit dem echten aktuellen Release
  var root = document.documentElement, hero = document.getElementById('latest'), intro = document.getElementById('intro');
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} } };
  var shown = original;

  function titleInto(h, r) { h.className = r.size; h.style.setProperty('--w', r.w); h.textContent = r.title; }
  function text(tag, value, parent) { var el = document.createElement(tag); el.textContent = value; parent.appendChild(el); return el; }

  function fillHero(r) {
    hero.dataset.c = r.c; intro.dataset.c = r.c;
    var cover = hero.querySelector('.v2-hero-cover'), img = cover.querySelector('img');
    cover.href = '/release/' + r.id + '/'; img.src = r.cover; img.alt = r.fullTitle;
    cover.querySelector('.namebar').textContent = (r.catalog ? r.catalog + ' · ' : '') + 'New Release';
    hero.querySelector('.kicker').textContent = 'Out now on ' + r.label;
    titleInto(hero.querySelector('h2'), r);
    var tracks = hero.querySelector('.tracks'); tracks.textContent = '';
    r.tracks.forEach(function (t) {
      var li = document.createElement('li'), play;
      if (t.src) {
        play = document.createElement('button'); play.className = 'play';
        play.dataset.src = t.src; play.dataset.title = t.title; play.dataset.artist = t.artist || '';
        play.setAttribute('aria-label', 'Play ' + t.title); play.appendChild(document.createElement('i'));
      } else { play = document.createElement('span'); play.className = 'play none'; play.setAttribute('aria-hidden', 'true'); }
      li.appendChild(play);
      var name = document.createElement('span'); name.className = 'track-name';
      text('strong', t.title, name); if (t.artist) text('em', t.artist, name);
      li.appendChild(name); tracks.appendChild(li);
    });
    var actions = hero.querySelector('.actions'); actions.textContent = '';
    var view = text('a', 'View Release', actions); view.className = 'btn'; view.href = '/release/' + r.id + '/';
    if (r.buy) { var buy = text('a', r.buy.label, actions); buy.className = 'btn ghost'; buy.href = r.buy.url; buy.target = '_blank'; buy.rel = 'noopener'; }
  }
  function fillBand(el, r) {
    el.dataset.id = r.id; el.dataset.c = r.c;
    el.querySelectorAll('a').forEach(function (x) { x.href = '/release/' + r.id + '/'; });
    el.querySelector('img').src = r.cover; el.querySelector('img').alt = r.fullTitle;
    el.querySelector('.namebar').textContent = r.upcoming ? 'Coming soon' : (r.catalog || r.label);
    titleInto(el.querySelector('h2'), r);
  }
  function fillTile(el, r) {
    el.dataset.id = r.id; el.dataset.cHover = r.c; el.querySelector('a').href = '/release/' + r.id + '/';
    var img = el.querySelector('img'); img.src = r.thumb; img.alt = r.fullTitle;
    el.querySelector('.namebar').textContent = r.fullTitle;
  }

  // Das gewählte Release kommt nach oben; steht es weiter unten, rückt dort das bisher oben gezeigte hin
  function show(id) {
    var r = byId[id]; if (!r) return;
    var old = byId[shown];
    fillHero(r);
    var slot = document.querySelector('[data-id="' + id + '"]');
    if (slot && old) (slot.classList.contains('v2-band') ? fillBand : fillTile)(slot, old);
    shown = id;
    root.style.setProperty('--c', r.c);
    if (window.dicularAccent) window.dicularAccent(r.c);
    if (window.dicularBindTracks) window.dicularBindTracks();
    document.querySelectorAll('#coverPick button[data-pick]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.pick === id)); });
    var u = new URL(location.href);
    if (id === original) { store.del('v2-aktuell'); store.del('v2-aktuell-c'); u.searchParams.delete('aktuell'); }
    else { store.set('v2-aktuell', id); store.set('v2-aktuell-c', r.c); u.searchParams.set('aktuell', id); }
    history.replaceState(null, '', u);
  }

  var grid = document.getElementById('coverPickGrid'), pick = document.getElementById('coverPick');
  function step(by, e) {
    e.preventDefault(); // Menü nicht auf- oder zuklappen
    var i = list.findIndex(function (r) { return r.id === shown; });
    show(list[(i + by + list.length) % list.length].id);
    hero.scrollIntoView({ block: 'start' });
  }
  document.getElementById('coverPrev').addEventListener('click', function (e) { step(-1, e); });
  document.getElementById('coverNext').addEventListener('click', function (e) { step(1, e); });
  list.forEach(function (r) {
    var b = document.createElement('button'); b.type = 'button'; b.dataset.pick = r.id; b.title = r.fullTitle;
    b.setAttribute('aria-label', r.fullTitle);
    var img = document.createElement('img'); img.src = r.small; img.alt = ''; img.loading = 'lazy'; img.width = 150; img.height = 150;
    b.appendChild(img); grid.appendChild(b);
    // Menü schließt nach der Wahl, damit der Titel frei bleibt; zum Weiterblättern gibt es die Pfeile
    b.addEventListener('click', function () { show(r.id); pick.open = false; hero.scrollIntoView({ block: 'start' }); });
  });
  document.getElementById('coverPickReset').addEventListener('click', function () { show(original); });

  // Menü-Ideen vergleichen; gilt auch auf den Unterseiten
  var menus = document.querySelectorAll('[data-menu]');
  function setMenu(m) {
    ['b', 'c', 'd', 'e', 'f'].forEach(function (x) { root.classList.toggle('menu-' + x, x === m); });
    root.classList.toggle('menu-a', m === 'a' || m === 'e'); // E baut auf dem Ring auf
    menus.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.menu === m)); });
    document.getElementById('nav').classList.remove('open');
    store.set('v2-menu', m);
    document.dispatchEvent(new Event('v2-menu'));
  }
  menus.forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); setMenu(b.dataset.menu); }); });
  setMenu(['e', 'f', 'b', 'c', 'd', 'a'].filter(function (x) { return root.classList.contains('menu-' + x); })[0] || 'f');

  var wanted = new URLSearchParams(location.search).get('aktuell') || store.get('v2-aktuell');
  show(wanted && byId[wanted] ? wanted : original);
})();
