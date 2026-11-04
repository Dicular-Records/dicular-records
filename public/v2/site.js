/* Redesign V2: Die Seite nimmt die Farbe des Covers an, das gerade in der Bildmitte liegt; Kacheln färben beim Darüberfahren. */
(function () {
  var root = document.documentElement, current = getComputedStyle(root).getPropertyValue('--c');
  function set(c) { root.style.setProperty('--c', c); }
  window.dicularAccent = function (c) { current = c; set(c); }; // für „Cover wählen“
  var areas = document.querySelectorAll('[data-c]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { current = en.target.dataset.c; set(current); } });
    }, { rootMargin: '-50% 0px -50% 0px' });
    areas.forEach(function (el) { io.observe(el); });
  }
  document.querySelectorAll('[data-c-hover]').forEach(function (el) {
    el.addEventListener('mouseenter', function () { set(el.dataset.cHover); });
    el.addEventListener('mouseleave', function () { set(current); });
    el.addEventListener('focus', function () { set(el.dataset.cHover); });
    el.addEventListener('blur', function () { set(current); });
  });

  // Logo im Hintergrund: Der Mittelpunkt wandert beim Scrollen um das Bild, so zeigt jeder Abschnitt einen anderen Ausschnitt.
  // Die Form dreht sich, die Lichtschicht dreht sich gegenläufig und bleibt dadurch stehen: Die Ringe gleiten durchs Licht.
  var rille = document.getElementById('rille'), light = rille && rille.querySelector('i'), intro = document.getElementById('intro');
  var OPACITY = intro ? 0.4 : 0.24; // Unterseiten haben mehr Lesetext
  if (rille) {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var drift = !reduce && innerWidth >= 900; // am Handy nur beim Scrollen, das schont den Akku
    var start = performance.now();
    var frame = function (now) {
      var y = reduce ? 0 : scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight), t = y / max;
      var vw = innerWidth, vh = innerHeight;
      var cx = vw * (0.5 + 0.62 * Math.cos(t * Math.PI * 3 + 0.7)), cy = vh * (0.5 + 0.72 * Math.sin(t * Math.PI * 3 + 0.7));
      var a = y * 0.035 + (drift ? (now - start) * 0.0012 : 0);
      rille.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) rotate(' + a.toFixed(2) + 'deg)';
      light.style.transform = 'rotate(' + (-a).toFixed(2) + 'deg)';
      // auf der Startseite erst nach dem Logo-Intro einblenden
      var h = intro ? intro.offsetHeight : 0;
      rille.style.opacity = h ? (OPACITY * Math.max(0, Math.min(1, (y - h * 0.25) / (h * 0.5)))).toFixed(3) : OPACITY;
    };
    frame(start);
    if (drift) {
      var loop = function (now) { if (!document.hidden) frame(now); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    } else if (!reduce) {
      addEventListener('scroll', function () { requestAnimationFrame(frame); }, { passive: true });
    }
  }
})();
