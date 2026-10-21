// WordPress-Menü-Markup (wp_nav_menu): <li> durch Zeilenumbruch getrennt — der Leerraum zwischen
// inline-block-Einträgen ist Teil des Original-Layouts (Abstände, "/"-Trenner im Footer).
// Der Eintrag der aktuellen Seite bekommt wie in WordPress "current-menu-item … current_page_item" (Unterstrich im Menü).
type Item = { id: number; pageId: number; label: string; href: string };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function menuHtml(items: Item[], withIds: boolean, currentPageId?: number): string {
  return items
    .map((m) => {
      const current = m.pageId === currentPageId ? ` current-menu-item page_item page-item-${m.pageId} current_page_item` : '';
      return `<li${withIds ? ` id="menu-item-${m.id}"` : ''} class="menu-item menu-item-type-post_type menu-item-object-page${current} menu-item-${m.id}"><a href="${esc(m.href)}"${current ? ' aria-current="page"' : ''}>${esc(m.label)}</a></li>`;
    })
    .join('\n') + '\n';
}
