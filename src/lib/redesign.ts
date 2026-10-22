// Hilfen für das Redesign

/** "CHRIS MAICO SCHMIDT / DJ / Producer" → Name und Rollen getrennt */
export function artistName(full: string): { name: string; roles: string } {
  const [name, ...roles] = full.split(' / ').map((s) => s.trim()).filter(Boolean);
  return { name, roles: roles.join(' · ') };
}

/** Herkunftszeile aus WordPress ("German / ") ohne Schrägstrich-Reste */
export const cleanSubtitle = (s?: string) => (s ?? '').replace(/<[^>]+>/g, '').replace(/[\s/]+$/, '').replace(/^[\s/]+/, '').trim();

/** Member-Typ aus WordPress ("music-producer", "IOT") lesbar: "Music Producer", "IoT" */
const MEMBER_TYPES: Record<string, string> = { iot: 'IoT', seo: 'SEO' };
export const memberTypeName = (t: string) => MEMBER_TYPES[t] ?? t.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

/** Datum als "30 May 2025" */
export const fmtDate = (d?: Date) => d?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/**
 * Markdown-Reste in importierten WordPress-HTML-Texten (z. B. „**DIC032 | STEINTEKK – Milia**“, „*Milia*“, „## Release Notes“)
 * im Redesign als Formatierung darstellen. Nur in Textteilen außerhalb von Tags; die 1:1-Fassung zeigt sie weiter roh.
 */
export function inlineMarkdown(html: string): string {
  return html.split(/(<[^>]+>)/).map((part) => (part.startsWith('<') ? part : part
    .replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(„"'])\*([^*\s][^*\n]*?)\*(?=$|[\s.,!?;:)"'“])/g, '$1<em>$2</em>')
    .replace(/(^|\s)#{2,3}\s+/g, '$1<br><br>'))).join('');
}

/** YouTube-Link → Video-ID (für die Zwei-Klick-Einbettung über youtube-nocookie.com) */
export function youtubeId(url?: string): string | undefined {
  return url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];
}
