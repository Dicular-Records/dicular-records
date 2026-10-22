/*
 * Kompatibilität für das Sonik-Theme auf schnellem statischem Hosting (nicht Teil des Originals).
 * Das Theme meldet sich erst in jQuery(document).ready für window "load" an (main.js, qwInitTheme) und
 * startet dort Masonry, quadratische Kacheln und skrollr. Lädt die Seite schneller als das Ready-Signal
 * (lokal/CDN), ist "load" bereits vorbei und diese Funktionen laufen nie. Hier wird ein später
 * registrierter load-Handler dann trotzdem ausgeführt.
 *
 * Vor jedem window-load-Handler wird gewartet, bis Webfonts geladen und laufende CSS-Übergänge fertig sind —
 * wie auf dem langsameren WordPress-Server. Grund: Masonry misst die Kachelhöhen genau einmal. Die
 * „Read More“-Buttons schrumpfen per Übergang (0,2 s) von 21 auf 14 px; auf schnellem Hosting startet dieser
 * Übergang erst mit dem ersten gezeichneten Bild, also gleichzeitig mit Masonry → Kacheln ~10 px zu hoch.
 */
(function ($) {
  if (!$ || !$.fn || !$.fn.load) return;

  function whenSettled(fn) {
    var done = false;
    var go = function () { if (!done) { done = true; setTimeout(fn, 0); } };
    setTimeout(go, 1500); // Obergrenze, falls ein Übergang nie endet
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fonts.then(null, function () {}).then(function () {
      // zwei Bilder zeichnen lassen, damit ausstehende Übergänge überhaupt starten
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var running = document.getAnimations ? document.getAnimations().filter(function (a) {
            return typeof CSSTransition !== 'undefined' && a instanceof CSSTransition;
          }) : [];
          Promise.all(running.map(function (a) { return a.finished.then(null, function () {}); })).then(go);
        });
      });
    });
  }

  var origLoad = $.fn.load;
  $.fn.load = function (fn) {
    if (this[0] === window && typeof fn === 'function' && arguments.length === 1) {
      if (document.readyState === 'complete') { whenSettled(fn); return this; }
      var self = this;
      return origLoad.call(this, function () { whenSettled(function () { fn.call(self[0]); }); });
    }
    return origLoad.apply(this, arguments);
  };
})(window.jQuery);
