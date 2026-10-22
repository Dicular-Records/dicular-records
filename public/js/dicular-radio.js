/*
 * Dicular Radio (nicht Teil des Originals): Der Radio-Knopf der Kopfzeile spielt alle Release-Tracks des Labels
 * in zufälliger Reihenfolge über den Player des Themes (main.js, Klick auf a[data-mp3url]).
 * Die Liste steht im Attribut data-playlist (src/components/Header.astro). Ist ein Track zu Ende, wird der nächste
 * gestartet — dafür wird soundManager.createSound umhüllt und ein onfinish ergänzt, nur solange das Radio läuft.
 */
(function ($) {
  var btn = document.getElementById('dicularRadio');
  if (!btn || !$) return;
  var list;
  try { list = JSON.parse(btn.getAttribute('data-playlist') || '[]'); } catch (e) { list = []; }
  if (!list.length) return;
  for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = list[i]; list[i] = list[j]; list[j] = t; }
  var pos = 0;
  btn.setAttribute('data-mp3url', list[0]);
  // Lief das Radio auf der vorigen Seite, setzt das Theme es per Cookie fort (programmatischer Klick ohne DOM-Ereignis)
  var active = !!($.cookie && $.cookie('playerstatus') === 'play' && list.indexOf($.cookie('playerurl')) >= 0);

  // Radio an/aus merken: Klick auf den Radio-Knopf = an, Klick auf einen anderen Track = aus
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-mp3url]');
    if (!a) return;
    active = a === btn;
    // main.js liest beim Radio-Klick eine Variable "mp3Url", die in seinem Gültigkeitsbereich fehlt (Fehler im Theme)
    if (active) window.mp3Url = btn.getAttribute('data-mp3url');
  }, true);

  function next() {
    pos = (pos + 1) % list.length;
    btn.setAttribute('data-mp3url', list[pos]);
    btn.setAttribute('data-state', '0');
    window.mp3Url = list[pos];
    $(btn).trigger('click');
  }
  function hook() {
    var sm = window.soundManager;
    if (!sm || sm.dicularRadio) return;
    sm.dicularRadio = true;
    var create = sm.createSound;
    sm.createSound = function (opts) {
      if (active && opts && opts.id === 'currentSound') {
        var prev = opts.onfinish;
        opts.onfinish = function () { if (prev) prev.apply(this, arguments); if (active) next(); };
      }
      return create.apply(this, arguments);
    };
  }
  hook();
  $(hook);
})(window.jQuery);
