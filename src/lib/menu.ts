// WordPress-Menü-Markup (wp_nav_menu): <li> durch Zeilenumbruch getrennt — der Leerraum zwischen
// inline-block-Einträgen ist Teil des Original-Layouts (Abstände, "/"-Trenner im Footer).
type Item = { id: number; label: string; href: string };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function menuHtml(items: Item[], withIds: boolean): string {
  return items
    .map((m) => `<li${withIds ? ` id="menu-item-${m.id}"` : ''} class="menu-item menu-item-type-post_type menu-item-object-page menu-item-${m.id}"><a href="${esc(m.href)}">${esc(m.label)}</a></li>`)
    .join('\n') + '\n';
}
