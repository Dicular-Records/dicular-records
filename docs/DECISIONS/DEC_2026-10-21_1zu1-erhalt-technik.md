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
