/*
 * Kompatibilität für das Sonik-Theme auf schnellem statischem Hosting (nicht Teil des Originals).
 * Das Theme meldet sich erst in jQuery(document).ready für window "load" an (main.js, qwInitTheme) und
 * startet dort Masonry, quadratische Kacheln und skrollr. Lädt die Seite schneller als das Ready-Signal
 * (lokal/CDN), ist "load" bereits vorbei und diese Funktionen laufen nie. Hier wird ein später
 * registrierter load-Handler dann sofort ausgeführt — wie auf dem langsameren WordPress-Server.
 */
(function ($) {
  if (!$ || !$.fn || !$.fn.load) return;
  var origLoad = $.fn.load;
  $.fn.load = function (fn) {
    if (this[0] === window && typeof fn === 'function' && arguments.length === 1 && document.readyState === 'complete') {
      setTimeout(fn, 0);
      return this;
    }
    return origLoad.apply(this, arguments);
  };
})(window.jQuery);
