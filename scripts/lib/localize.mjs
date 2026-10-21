// URL-Umschreibung Live-WordPress → Nachbau (gemeinsam für Extraktion und Import).
// - i0.wp.com-Bildproxy → Originaldatei unter gleichem Pfad (ohne Resize-Parameter)
// - c0.wp.com (WP-Core-CDN) → lokale Kopie
// - absolute Links auf dicular-records.com → relative Pfade
// - ?ver=… an CSS/JS entfernen
export function localizeUrls(s) {
  return s
    .replace(/https:\/\/i[0-9]\.wp\.com\/(?:www\.)?dicular-records\.com\/([^"'\s?)]+)(\?[^"'\s)]*)?/g, '/$1')
    .replace(/https:\/\/c0\.wp\.com\/c\/[^/]+\//g, '/')
    .replace(/https?:\/\/(?:www\.)?dicular-records\.com\/?/g, '/')
    .replace(/(\.(?:css|js))\?ver=[^"'\s]*/g, '$1');
}

/** Bild-URL (auch i0-Proxy) → lokaler Originalpfad */
export function localImage(url) {
  if (!url) return undefined;
  return localizeUrls(url.replace(/&#0?38;|&amp;/g, '&')).replace(/[?#].*$/, '');
}
