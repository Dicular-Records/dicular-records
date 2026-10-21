// Bereinigt HTML aus dem Self-Service (Artists veröffentlichen ohne Admin-Freigabe):
// keine Skripte, Formulare, eingebetteten Fremdseiten oder Event-Handler; Links nur http(s)/mailto.
// Erlaubt bleibt alles, was die übernommenen WordPress-Biografien nutzen → Darstellung unverändert (1:1 geprüft).
import sanitizeHtml from 'sanitize-html';

export function sanitizeArtistHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'span', 'div', 'br', 'h1', 'h2', 'u', 's', 'font']),
    allowedAttributes: {
      '*': ['class', 'style', 'dir', 'title', 'id', 'data-*'],
      a: ['href', 'target', 'rel', 'name'],
      img: ['src', 'alt', 'width', 'height', 'srcset', 'sizes', 'decoding', 'loading', 'data-recalc-dims'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    parser: { decodeEntities: false },
  });
}
