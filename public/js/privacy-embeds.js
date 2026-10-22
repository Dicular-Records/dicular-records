/*
 * Zwei-Klick-Lösung für eingebettete Player (nicht Teil des Originals).
 * Das Theme verwandelt Links auf YouTube, SoundCloud und Mixcloud beim Laden in eingebettete Player
 * (main.js, $.fn.transformlinks) — dabei gehen Daten an Google/DoubleClick bzw. SoundCloud, ohne dass
 * jemand geklickt hat. Hier wird stattdessen ein Platzhalter gezeigt; erst ein Klick lädt den Player
 * (YouTube über youtube-nocookie.com). Gleiches gilt für den SoundCloud-Player der Artist-Seiten
 * (src/components/SoundCloud.astro, Platzhalter mit data-embed-src).
 */
(function ($) {
  if (!$) return;
  var YT = /(?:https?:)?\/\/(?:\w{0,3}\.)?youtube\.\w{2,3}\/watch\?v=([\w-]{11})/i;
  var SC = /https?:\/\/soundcloud\.com\/[a-zA-Z0-9\/\-_]+/i;
  var MC = /https?:\/\/www\.mixcloud\.com\/[\w-]{0,150}\/[\w-]{0,150}\/?/i;

  var css = '.dicular-embed{position:relative;background:#00121b;border:2px solid #2a5982;margin:0 0 20px;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;box-sizing:border-box}'
    + '.dicular-embed .btn{margin:0 0 10px}.dicular-embed p{margin:0;font-size:13px;line-height:1.5;color:#adadad}.dicular-embed p a{color:#2cc894}'
    + '.dicular-embed-video{aspect-ratio:16/9;width:100%}.dicular-embed iframe{display:block;width:100%;border:0}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function placeholder(provider, src, height, label) {
    var box = $('<div class="dicular-embed"></div>').addClass(height ? '' : 'dicular-embed-video').css(height ? { minHeight: height + 'px' } : {});
    box.attr({ 'data-embed-src': src, 'data-embed-height': height || '' });
    box.append($('<div></div>')
      .append($('<a href="#" class="btn accentcolor dicular-embed-load"></a>').text('▶ ' + label))
      .append($('<p></p>').html('Loads ' + provider + '. Data is then sent to ' + provider + ' — see our <a href="/privacy-policy/">privacy policy</a>.')));
    return box;
  }
  function embedFor(href) {
    var m = href.match(YT);
    if (m) return { provider: 'YouTube', label: 'Play video', src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0' };
    m = href.match(SC);
    if (m) return { provider: 'SoundCloud', label: 'Play on SoundCloud', height: 166, src: 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(m[0]) + '&color=%232a5982&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&visual=false' };
    m = href.match(MC);
    if (m) return { provider: 'Mixcloud', label: 'Play on Mixcloud', height: 120, src: 'https://www.mixcloud.com/widget/iframe/?feed=' + encodeURIComponent(m[0]) + '&autoplay=1' };
    return null;
  }

  // Links, die das Theme einbetten würde, vorher durch Platzhalter ersetzen
  function protect(container) {
    $(container).find("a[href*='youtube.com'],a[href*='mixcloud.com'],a[href*='soundcloud.com'],[data-autoembed]")
      .not('.qw-disableembedding').not('.vc_general').not('.dicular-embed a').each(function () {
        var a = $(this), e = embedFor(a.attr('data-autoembed') || a.attr('href') || '');
        if (e) a.replaceWith(placeholder(e.provider, e.src, e.height, e.label));
      });
  }
  if ($.fn.transformlinks) {
    var orig = $.fn.transformlinks;
    $.fn.transformlinks = function (target) { protect(target || 'body'); return orig.apply(this, arguments); };
  }

  // Klick → Player laden
  $(document).on('click', '.dicular-embed-load', function (ev) {
    ev.preventDefault();
    var box = $(this).closest('.dicular-embed'), h = box.attr('data-embed-height');
    var frame = $('<iframe allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>').attr('src', box.attr('data-embed-src'));
    if (h) frame.attr('height', h); else frame.css({ height: '100%' });
    box.empty().css({ padding: 0, border: 0 }).append(frame);
  });
})(window.jQuery);
