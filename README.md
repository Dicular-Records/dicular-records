# Dicular Records — Website

1:1-Nachbau von [dicular-records.com](https://dicular-records.com) (WordPress/Sonik-Theme) als statische [Astro](https://astro.build)-Seite; Inhalte als Dateien in `src/content/`, später pflegbar über Decap CMS (Artist-Self-Service).

**Stand:** alle Seiten 1:1 nachgebaut (Gesamtvergleich: docs/DECISIONS), Redaktionsoberfläche unter /admin/, Verbesserungen A–H (Bilder, Ballast, Datenschutz, Teilen, Dicular Radio). Livebetrieb später auf dem bestehenden Server (Plesk). Entscheidungen: `docs/DECISIONS/`.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/content/` | Inhalte (Collections: `pages`, `releases`, `artists`, `news`, `events`) |
| `src/data/` | Menü (`menu.json`), Site-Daten/Social-Links (`site.json`) |
| `src/legacy/` | Theme-Rahmen wörtlich aus der Live-Seite (generiert, nicht von Hand ändern) |
| `src/layouts/Legacy.astro`, `src/components/` | Seitengerüst, Header, Footer, Release-Block (Theme-Markup 1:1) |
| `public/wp-content/` | Original-Theme-Assets und Medien unter den Original-Pfaden |
| `public/js/` | eigene Ergänzungen: Theme-Kompatibilität, Zwei-Klick-Player, Dicular Radio |
| `scripts/` | Extraktion, Asset-/Medien-Spiegelung, Nachbearbeitung des Builds, Prüfungen |

## Befehle

```bash
npm install
npm run dev                                  # http://localhost:4321
npm run build && npm run preview             # Produktions-Build ansehen (build verkleinert danach Bilder, entfernt Ballast,
                                             #   schreibt sitemap.xml/robots.txt: scripts/optimize-dist.mjs)
node scripts/check-pages.mjs                 # alle Seiten: JS-Fehler, Fehlerseiten, Anfragen an fremde Server, unscharfe Bilder
node scripts/page-weight.mjs                 # Ladegewicht ausgewählter Seiten
node scripts/visual-compare.mjs / /releases/ # Pixel-Vergleich live ↔ Nachbau (braucht laufendes preview), Ergebnis in compare/
node scripts/extract-legacy-shell.mjs        # Theme-Rahmen neu aus der Live-Seite ziehen
bash scripts/mirror-theme-assets.sh          # Theme-CSS/JS/Fonts spiegeln
bash scripts/fetch-original.sh <url>...      # Original-Medien unter gleichem Pfad nach public/ laden
```

Unter Git-Bash Pfade mit `MSYS_NO_PATHCONV=1` übergeben (sonst wird `/` zu einem Windows-Pfad).
