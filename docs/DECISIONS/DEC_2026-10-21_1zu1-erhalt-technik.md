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
| 26 | **Editor „htmlrich“** (`public/admin/widgets/html-editor.js`) für Biografien und den eigenen Artist-Abschnitt: bearbeitet das HTML direkt (contenteditable), Darstellung in Schrift/Farben der Website, Einfügen nur als reiner Text | Rundlauf getestet (`scripts/cms-smoke-test.mjs`): nach einer Änderung ist nur der neue Text im HTML hinzugekommen, alles andere zeichengleich. |
| 27 | **Bereinigung** aller Artist-Inhalte beim Bauen (`src/lib/sanitize.ts`, sanitize-html): keine Skripte, Event-Handler, `javascript:`-Links, iframes, Styles-Blöcke | Artists veröffentlichen ohne Admin-Freigabe. Geprüft: alle 12 Artist-Seiten weiterhin 1:1, Schadcode-Test entfernt alles Gefährliche. |
| 28 | **Schutz gegen Decap-Fehler**: beim direkten Sprung zwischen zwei Einträgen per Adresse lädt die Oberfläche neu | Decap zeigt sonst die Felder des vorherigen Eintrags → Gefahr, fremden Inhalt zu überschreiben. |

## Hosting (2026-10-22, nach Gespräch Yoka/Tomtron)

**Entscheidung Yoka:** Domain und Server bleiben, wo sie sind. Die fertige Seite wird dort hochgeladen und verlinkt. Bis dahin wird ohne Zeitdruck weitergearbeitet.

Ist-Zustand, selbst ermittelt: DNS bei GoDaddy (`pdns13/14.domaincontrol.com`), Server `92.205.130.169` mit Plesk (Linux), nginx und PHP 8.5.

Daraus folgt (von Claude entschieden, ersetzt den Netlify-Teil der Übergabe):

| # | Entscheidung | Begründung |
|---|---|---|
| 29 | **Livebetrieb auf dem bestehenden Plesk-Server.** Nach jeder Änderung an `main` baut eine GitHub Action die Seite und lädt `dist/` per SFTP hoch. Netlify wird nicht gebraucht. | Die Astro-Seite ist rein statisch und läuft auf jedem Webserver. Artist-Änderungen gehen so weiterhin ohne Admin automatisch online. |
| 30 | **GitHub-Login für Decap** über ein kleines OAuth-Skript in PHP auf demselben Server, statt über Netlify | PHP ist vorhanden. Kein zusätzlicher Dienst und kein weiteres Konto. |
| 31 | **Kommentarformular und Demo-Upload** (Contact) per PHP-Skript auf dem Server statt Netlify Forms. Ersetzt den Versandweg aus Nr. 16. | Netlify Forms funktioniert nur auf Netlify. |
| 32 | **MP3s bleiben auf dem Server**, `audioBase` bleibt. Damit ist der offene Punkt aus Nr. 11 erledigt. | Server bleibt. Die Dateien liegen dort schon unter denselben Pfaden. |

Wird erst zum Umzug gebraucht: SFTP- bzw. Plesk-Zugang (als GitHub-Secret, nie im Repo) und ein Termin für die Umstellung von WordPress auf die neue Seite.

## Abschließender Gesamtvergleich (2026-10-22)

Zwei vollständige Läufe: 125 Seiten × Desktop/Mobil = 250 Aufnahmen gegen die Live-Seite (`scripts/visual-compare.mjs --all`).
Zweiter Lauf: **222 unter 0,5 %, 237 unter 1 %, 246 unter 2 %**.

| # | Entscheidung | Begründung |
|---|---|---|
| 33 | `theme-compat.js` wartet vor jedem `window.load`-Handler des Themes, bis die Webfonts geladen und laufende CSS-Übergänge abgeschlossen sind (mindestens zwei gezeichnete Bilder, höchstens 1,5 s). | Ursache war ein Zeitproblem im Original: Masonry misst die Kachelhöhen genau einmal. Die „Read More“-Buttons schrumpfen per 0,2-s-Übergang von 21 auf 14 px. Auf schnellem Hosting lief Masonry mitten in diesem Übergang, dadurch war jede Kachel ~10 px zu hoch. Jetzt landet das Layout bei jedem Laden auf denselben, vom Theme beabsichtigten Positionen. Friends mobil: 18,4 → 6,3 %, News Seite 2: 12,8 → 0,6 %. |

**Bekannte Restabweichungen** (alle von Claude geprüft, keine inhaltlichen Unterschiede):
- **Masonry-Seiten mobil** (News-Übersicht, Friends): Die Live-Seite schwankt selbst von Aufruf zu Aufruf um bis zu 90 px Gesamthöhe, weil dort dasselbe Zeitproblem zufällig zuschlägt. Lokal ist das Ergebnis stabil. Die Kacheln sind identisch (Messung mit `scripts/layout-diff.mjs`).
- **Member-Typ-Archive Desktop:** 3–6 px Höhenunterschied aus demselben Grund (max. 1,2 %).
- **Bildskalierung** (Event-Flyer, Artist-Kacheln, 0,5–3 %): Live liefert verkleinerte Bilder über den WordPress-Bild-CDN (i0.wp.com), lokal skaliert der Browser das Original. Optisch gleich, nur andere Glättung.
- **Blocksatz** (Artist-Biografien, ~1,6 %): Kantenglättung der Schrift um Bruchteile eines Pixels verschoben, Zeilenumbrüche identisch.

## Verbesserungen A–H (2026-10-22, Auftrag Yoka: „A und B“, danach „direkt mit C bis H weiter“)

| # | Entscheidung | Begründung |
|---|---|---|
| 34 | **A – Bilder:** Nach dem Build erzeugt `scripts/optimize-dist.mjs` verkleinerte WebP-Varianten (`/_img/<breite>/…`, Zwischenspeicher `.cache/img`). `<img>` bekommt ein srcset mit diesen Varianten, Hintergrundbilder werden WebP. Die Originale bleiben unverändert in `public/`. | Live leistet das der WordPress-Bild-CDN (i0.wp.com), der beim Umzug wegfällt. Bildgewicht je Seite −50 bis −95 % (Event-Flyer 4,9 → 0,2 MB). |
| 35 | **B – Ballast:** Derselbe Schritt entfernt Plugin-Dateien aus jeder Seite, die sie nicht braucht: Datei-Upload samt jQuery UI (nur Contact-Seite behält sie), Videogalerie, jQuery-UI-Slider, Icon-Komponente. Swipebox nur, wo Bild- oder Videolinks stehen. Was `main.js` direkt aufruft (FlipClock, prettySocial, skywheel, classie …), bleibt. | Prüfung je Bibliothek: Aufrufe im Theme-Code und Verwendung im Seiteninhalt. Ein fehlendes Plugin, das `main.js` aufruft, würde das ganze Theme-Skript abbrechen. 17–19 Anfragen weniger je Seite. Der Server komprimiert ohnehin (gzip), CSS/JS werden daher nicht weiter verkleinert. |
| 36 | **C – keine externen Inhalte:** 14 Emoji-Bilder von Facebook-Servern durch echte Emoji-Zeichen ersetzt. Ein Bild auf der Evosonic-Seite lag über i0.wp.com bei evosonic.de, jetzt liegt eine lokale Kopie unter `uploads/external/`. **Cookie-Leiste entfernt.** | Beim Laden einer Seite geht jetzt keine Anfrage mehr an Dritte. Die Leiste blockierte nichts und behauptete Werbung/Analyse (Text aus der Plugin-Vorlage). |
| 37 | **D – Demo-Reste:** alle 9 Tags entfernt; sie stammten aus dem Theme-Demo („Music wordpress themes“, „Cool music“ …) und hingen nur an den drei ältesten Beiträgen. Damit entfallen die 9 Tag-Seiten. Die URLs dieser Beiträge bleiben. **Nicht** entfernt: Member-Typen (gehören zu Szenekonzept), `sample-page` (= echte Contact-Seite mit Demo-Upload). Teil B des Inventars wird nicht übernommen. | Die Beiträge selbst sind echt (Label-Gründung, Willkommen DJ Tassilo, erstes Release); nur Adressen und Tags kamen aus dem Demo-Import. Adressen zu ändern würde bestehende Links brechen. |
| 38 | **E – Teilen und Google:** Jede Seite hat Beschreibung, Vorschaubild (wie live: Beitragsbild/Cover; sonst `site.shareImage`), `twitter:card`. Dazu `sitemap.xml` und `robots.txt` (erzeugt im Post-Build). Standardtext in `src/data/site.json` → `description`. | Live gab es nur Titel und Bild, keine Beschreibung. Die alte Sitemap (`wp-sitemap.xml`) fällt mit WordPress weg. |
| 39 | **F – „Dicular Radio“** statt „Sonik Radio“: Der Knopf spielt alle Release-Tracks des Labels (31) in zufälliger Reihenfolge und spielt nach jedem Track weiter (`public/js/dicular-radio.js`, Theme-Dateien unverändert). | Ersetzt Entscheidung 8 („optisch, ohne Funktion“) für die Verbesserungsphase. Ein toter Knopf mit dem Namen des Themes wird zur echten Funktion mit eigener Musik. Kein externer Stream nötig. |
| 40 | **G – Barrierefreiheit:** Alt-Texte für alle Bilder aus Vorlagen (Cover → Release-Titel, Fotos → Artist-Name, Flyer → Event-Titel …). Kontrast Fließtext #adadad auf #00283a = 6,8 : 1 (WCAG AA erfüllt). | Bilder im Fließtext beschreiben die Autoren künftig selbst im Editor. |
| 41 | **H – Datenschutzerklärung neu** (englisch wie die Website): bisher unveränderte WordPress-Vorlage (Gravatar, Login-Cookies, Spam-Dienst). Jetzt beschreibt sie, was tatsächlich passiert: Server-Logs, drei technische Player-Cookies, Kommentare per E-Mail, Videos erst nach Klick, Rechte, Aufsicht LDI NRW. Kommentarformular: drei funktionslose Kontrollkästchen entfernt (Name merken, E-Mail-Benachrichtigungen). Das Impressum ist technisch unverändert gültig. Original: `.cache/privacy-policy.wordpress-original.md`. | **Entwurf ohne Rechtsprüfung** — vor dem Umzug von Dieter Offermanns (Verantwortlicher) freigeben lassen. Offen: Name des Hosting-Anbieters ergänzen, Webmaster-Adresse im Impressum (szenekonzept@googlemail.com) noch aktuell? |
| 42 | **Zwei-Klick-Lösung für eingebettete Player** (`public/js/privacy-embeds.js`): Das Theme macht aus YouTube-, SoundCloud- und Mixcloud-Links beim Laden eingebettete Player. Live lädt dadurch z. B. die Barbaros-Release-Seite YouTube **und DoubleClick (Werbenetz)** ohne Klick. Jetzt erscheint ein Platzhalter im Seitenstil, erst der Klick lädt den Player (YouTube über youtube-nocookie.com). Der SoundCloud-Player der Artist-Seiten funktioniert genauso. | Gefunden mit `scripts/check-pages.mjs`, das alle 116 Seiten × 2 auf Fremdanfragen, JS-Fehler, Fehlerseiten und unscharfe Bilder prüft. Ergebnis danach: 0 Fremdanfragen, 0 JS-Fehler. Ohne die Zwei-Klick-Lösung wäre die Datenschutzerklärung falsch. |
| 43 | `sizes` für Bilder ohne eigenes srcset wie WordPress: `(max-width: Bpx) 100vw, Bpx` (B = width-Attribut, ohne Attribut die echte Bildbreite). **CMYK-JPEGs** (4 Event-Flyer, Druckvorlagen) bleiben unkonvertiert. | Der erste Versuch mit `100vw` ließ den Browser bei Größenänderung eine andere Datei nachladen, in ganzseitigen Screenshots fehlten dann Cover. Mit der WordPress-Regel wählt der Browser dieselbe Größe wie live. Ohne width-Attribut hätte `100vw` das 500-px-Foto auf der Evosonic-Seite auf volle Breite gezogen. CMYK: sharp rechnet die Farben anders um als der Browser (Flyer grün → türkis). Prüfung: kein Bild wird unschärfer angezeigt, als die größte verfügbare Variante erlaubt. **Vergleichswerkzeug:** Headless-Chromium zeichnete Bilder mit srcset im Ganzseiten-Screenshot teils schwarz, im Browser waren sie sichtbar (geprüft, auch bei Handybreite). `visual-compare.mjs` weist srcset vor dem Screenshot auf beiden Seiten einmal neu zu. |

Ladegewicht vorher → nachher (lokal, unkomprimiert; `scripts/page-weight.mjs`): Startseite 3,50 → 2,51 MB · Release 3,69 → 2,91 MB · Artist 3,09 → 2,35 MB · Friends 3,48 → 2,49 MB · Event 7,17 → 2,20 MB. Anfragen je Seite 63–80 → 45–61. Der Server komprimiert CSS/JS zusätzlich mit gzip (~1,8 MB → ~0,35 MB).

## GitHub-Organisation (2026-10-22)

| # | Entscheidung | Begründung |
|---|---|---|
| 44 | Repository liegt jetzt in der Organisation **Dicular-Records** (`Dicular-Records/dicular-records`, privat). Owner der Organisation: Konto `DicularRecords`. `yokadeeds-dev` ist **Member** mit Schreibrecht. Decap (`backend.repo`) und das lokale Remote sind umgestellt. | Das Label besitzt das Repository selbst, statt dass es an Yokas Entwickler-Konto hängt. Die Rechte für Artists laufen später über Teams der Organisation. **Offen (Yoka):** `yokadeeds-dev` zum Owner machen. Sonst kann diese Seite Branch-Schutz und Auto-Merge nicht einrichten; dafür braucht es Admin-Rechte. Die Sitzung darf Rechte nicht selbst vergeben. |
