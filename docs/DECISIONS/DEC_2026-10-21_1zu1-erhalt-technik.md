# DEC 2026-10-21 — Technik für den 1:1-Erhalt

**Kontext:** Übergabe „Dicular Records – 1:1-Erhalt + Artist-Self-Service". Ziel: Live-Seite (WordPress, Theme sonik) exakt erhalten, Inhalte als Dateien (Astro-Content-Collections), Design-Überarbeitung erst danach.

## Entscheidungen (von Claude getroffen, von Yoka zu bestätigen/korrigieren)

| # | Entscheidung | Begründung |
|---|---|---|
| 1 | **Neues Repo** `yokadeeds-dev/dicular-records` statt Weiterbau von `dicular-website-demo` | Demo (Juli 2026) hat ein Redesign + Platzhalter-Events; Übergabe verlangt 1:1 ohne Platzhalter. Demo bleibt als Referenz bestehen. |
| 2 | Lokaler Pfad `C:\Users\yoka\Claude-Arbeit\Dicular-Records` | Wird von „Claude Backup GDrive" gesichert, `node_modules` ist dort ausgeschlossen; nicht im OneDrive-Ordner (Sync-Last). |
| 3 | **Original-Theme-CSS/JS unverändert übernommen** (`public/wp-content/...`, gleiche Pfade wie live) | Pixelgenauigkeit + identisches Verhalten (Parallax, 360°-Player, Mobil-Menü) nur so erreichbar. Theme-Rahmen per Skript extrahiert (`scripts/extract-legacy-shell.mjs`), Assets per `scripts/mirror-theme-assets.sh`. |
| 4 | **URL-Struktur 1:1** (`/release/<slug>/`, `/artist/<slug>/`, …, Slash am Ende) | Bestehende Links/Google-Einträge bleiben gültig. |
| 5 | Medien als **Originaldateien** unter identischem Pfad (`/wp-content/uploads/...`), nicht die i0.wp.com-Verkleinerungen | „Bilder als Originaldateien". Folge: minimale Resampling-Unterschiede im Pixel-Diff. |
| 6 | **Ladeverhalten des Originals beibehalten** (Jetpack-Boost Critical-CSS + asynchrone Stylesheets) | Ohne das startet die Logo-Einblendung (WPBakery/skrollr) unsichtbar — Timing-abhängig. |
| 7 | **Entfernt:** Jetpack-Statistik (stats.wp.com), Google jsapi, Google-Maps-Script | Tracking ohne Funktion für die Darstellung; Maps lief live ohne API-Key (Warnung „NoApiKeys"). Kein sichtbarer Unterschied. |
| 8 | **„Sonik Radio"**: nur optisch, ohne Stream | Live spielt sie den Theme-Test-Stream „Qantum Themes Test Channel" (streams.radio.co) — kein Dicular-Inhalt. Übergabe: „optisch übernehmen, ohne Funktion". Umschaltbar in `src/data/site.json` (`radio.functional`). |
| 9 | **Release-Player auf der Startseite funktional** (MP3 `Mile-Diskovic_UFFFF.mp3`, 17 MB, im Repo) | Ist echter Dicular-Inhalt und spielt live. |
| 10 | Node.js portabel (`%LOCALAPPDATA%\Programs\node`, v24 LTS, im User-PATH) | winget-Installer wartete auf Admin-Freigabe; portable Version braucht keine. |

## Abnahme-Messung Startseite (Playwright, ganze Seite)

| Viewport | Seitenhöhe live / Nachbau | abweichende Pixel |
|---|---|---|
| Desktop 1440×900 | 2613 / 2613 | 0,02 % |
| Mobil 390×844 | 2862 / 2862 | 0,14 % |

Rest: Cover/Logo-Resampling (Entscheidung 5) und laufende Equalizer-Animation im Titel.

## Abnahme

- **2026-10-21: Startseite von Yoka abgenommen.** Entscheidungen 1–10 damit bestätigt (keine Einwände). Nächster Schritt: Unterseiten 1:1.
- Offen: Archivseiten (A/B/C) und Weglassen der 134 unverlinkten Demo-URLs — siehe `docs/SEITENINVENTAR.md`, Abschnitt C.

## Phase 2 — alle Unterseiten (2026-10-21)

| # | Entscheidung | Begründung |
|---|---|---|
| 11 | **Audio nicht im Repo:** die 33 Release-MP3s (642 MB) werden vorerst weiter von `dicular-records.com` abgespielt (`audioBase` in `src/data/site.json`). Vollständige Sicherung: `C:\Users\yoka\Claude-Arbeit\Dicular-Records-Medien` | Git/GitHub ist für so große Binärdateien ungeeignet. **Offen (Yoka):** Ziel-Hosting vor Abschaltung von WordPress. |
| 12 | Importierte Texte bleiben **wörtliches HTML** (`format: html`), neue Inhalte sind Markdown | Markdown würde Teile des WP-HTML verändern (z. B. `*Milia*` → kursiv). |
| 13 | **Reihenfolgen** der Übersichten aus der Live-Seite übernommen (`listOrder`); neue Einträge erscheinen vorne | WordPress sortiert teils nach unsichtbaren Feldern (Releases ohne Datum). |
| 14 | **„Related“-Regeln** aus dem Live-Verhalten: Releases = gleiches Genre, sonst die ersten 16 der Release-Liste; Artists = gleiches Artist-Genre (max. 4); News = gleiche Kategorie | Nachgebaut, nicht zufällig — damit neue Inhalte automatisch richtig erscheinen. |
| 15 | **Bild-Zuschnitte** (500×500, 600×350, 150×150) werden beim Build aus den Originalen erzeugt (`scripts/thumbs.mjs`) | Entspricht den WordPress-Bildgrößen des Themes; funktioniert auch für neue Uploads. |
| 16 | **Kommentarformular** unter News optisch 1:1, Einsendungen gehen per **Netlify Forms** an die Admins; es werden keine Kommentare angezeigt | Ohne WordPress gibt es keinen Kommentar-Server. Live existiert kein einziger Kommentar. |
| 17 | **Archivseiten** (Kategorie, Tag, Genre, Member-Typ, Autor) zunächst **alle übernommen** | 1:1-Grundsatz; sie sind von Beiträgen aus verlinkt. Entfernen bleibt möglich (offene Frage A/B/C). |
| 18 | „Weitere“ Felder für Self-Service: Artist `soundcloud` (Liste von URLs → eingebetteter Player + Menüpunkt) | Übergabe: SoundCloud-Feld auf der Artist-Seite. Bisher bei keinem Artist befüllt → keine sichtbare Änderung. |
| 19 | **`public/js/theme-compat.js`** (einzige Ergänzung am Theme-Verhalten): führt einen zu spät registrierten `window.load`-Handler sofort aus | Auf schnellem Hosting ist `load` schon vorbei, bevor das Theme sich anmeldet → Masonry, Quadrat-Kacheln und skrollr starteten nie. Stellt das Live-Verhalten her; Theme-Dateien bleiben unverändert. |
| 20 | **Critical-CSS je Seitentyp** (`src/legacy/critical/*.css`) und zwei Kopf-Varianten (Boost / normal) wie im Original | Jetpack Boost erzeugt es pro Vorlage; Tag- und Autoren-Archive laden live ohne Boost. |
| 21 | Release-Feld **`headerPlayer`**: bei 17 Releases ist der 360°-Player im Kopf aus; deren Tracks spielen über den Player der Kopfleiste | Theme-Option je Release im Original. |
| 22 | **„Sonik Radio“** bleibt ohne Stream (Entscheidung 8), Klick tut nichts | Kein Einfluss auf die Initialisierung (geprüft). |

## Redaktionsoberfläche (2026-10-22)

| # | Entscheidung | Begründung |
|---|---|---|
| 23 | **Decap CMS 3.17.1** unter `/admin/`, deutsch, GitHub-Login, jede Änderung als Pull Request; lokal testbar mit `decap-server` | Übergabe-Architektur. Rechte per GitHub (CODEOWNERS/Pfadprüfung), weil Decap selbst keine Rechte pro Person kennt — Artists *sehen* alle Artist-Einträge, Änderungen an fremden landen aber bei den Admins. |
| 24 | Importierte Texte **nicht** in Markdown umwandeln | Test an allen 12 Artist-Seiten: 5–40 % Pixelabweichung (Absatzabstände, Bildgrößen). Stattdessen kommt für Texte mit `format: html` ein **HTML-fähiger WYSIWYG-Editor** (eigenes Decap-Widget), der die Original-Formatierung direkt bearbeitet — 1:1 bleibt erhalten, Artists sehen normalen Text statt Code. |
| 25 | Editor-Vorschau aus | Die Standard-Vorschau von Decap ist ungestylt; die echte Vorschau liefert der Netlify-Vorschau-Link im Original-Design. |
