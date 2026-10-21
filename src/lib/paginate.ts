// WordPress-Paginierung: /basis/, /basis/page/2/, … (Astro-Route [...page])
export interface PageInfo<T> { items: T[]; current: number; last: number; base: string }

export function wpPaginate<T>(items: T[], perPage: number, base: string, extraProps: Record<string, unknown> = {}) {
  const last = Math.max(1, Math.ceil(items.length / perPage));
  return Array.from({ length: last }, (_, i) => ({
    params: { page: i === 0 ? undefined : `page/${i + 1}` },
    props: { ...extraProps, pageInfo: { items: items.slice(i * perPage, (i + 1) * perPage), current: i + 1, last, base } satisfies PageInfo<T> },
  }));
}

export const pageUrl = (base: string, n: number) => (n <= 1 ? base : `${base}page/${n}/`);

/** Body-Klassen-Zusatz für Folgeseiten ("paged … paged-2 page-paged-2") */
export const pagedClass = (n: number, isPage = true) => (n > 1 ? { prefix: 'paged ', suffix: ` paged-${n}${isPage ? ` page-paged-${n}` : ''}` } : { prefix: '', suffix: '' });

/** Nummerierte Paginierung wie qt-pagination des Themes (Beitrags-Archive zeigen sie auch bei nur einer Seite: always) */
export function paginationHtml(base: string, current: number, last: number, always = false): string {
  if (last <= 1 && !always) return '';
  let out = '<ul class="qt-pagination pagination text-center">';
  out += current === 1
    ? '<li class="disabled"><a href="#"><i class="mdi-hardware-keyboard-arrow-left"></i></a></li>'
    : `<li class="prev"><a href="${base}" title="First">\n        <i class="fa fa-arrow-left"></i></a></li>`;
  for (let n = 1; n <= last; n++) {
    out += n === current ? `<li class="active"><a href="#" class="maincolor-text">${n}</a></li>` : `<li><a href="${pageUrl(base, n)}">${n}</a></li>`;
  }
  return out + '</ul>';
}
