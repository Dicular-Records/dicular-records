/* Redesign V2: Die Seite nimmt die Farbe des Covers an, das gerade in der Bildmitte liegt; Kacheln färben beim Darüberfahren. */
(function () {
  var root = document.documentElement, current = getComputedStyle(root).getPropertyValue('--c');
  function set(c) { root.style.setProperty('--c', c); }
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
})();
