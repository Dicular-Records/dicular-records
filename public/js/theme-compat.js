/*
 * Kompatibilität für das Sonik-Theme auf schnellem statischem Hosting (nicht Teil des Originals).
 * Das Theme meldet sich erst in jQuery(document).ready für window "load" an (main.js, qwInitTheme) und
 * startet dort Masonry, quadratische Kacheln und skrollr. Lädt die Seite schneller als das Ready-Signal
 * (lokal/CDN), ist "load" bereits vorbei und diese Funktionen laufen nie. Hier wird ein später
 * registrierter load-Handler dann ausgeführt, sobald auch die Webfonts geladen sind — wie auf dem
 * langsameren WordPress-Server (Masonry misst Kachelhöhen; ohne fertige Schrift stimmen die Abstände nicht).
 */
(function ($) {
  if (!$ || !$.fn || !$.fn.load) return;
  var origLoad = $.fn.load;
  $.fn.load = function (fn) {
    if (this[0] === window && typeof fn === 'function' && arguments.length === 1 && document.readyState === 'complete') {
      var run = function () { setTimeout(fn, 0); };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(run, run); else run();
      return this;
    }
    return origLoad.apply(this, arguments);
  };
})(window.jQuery);
