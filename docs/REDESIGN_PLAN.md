# Redesign Dicular Records — Planung

Zweig `redesign`, Arbeitsordner `C:\Users\yoka\Claude-Arbeit\Dicular-Records-Redesign`.
`main` bleibt die 1:1-Fassung (plus Verbesserungen A–H) und ist unabhängig vom Redesign nutzbar.

## Leitlinie (Yoka, 2026-10-22)

- **„Mashup“ = Lesart A:** Bestehendes nehmen, die DNA erhalten, alles etwas schicker und moderner machen.
  Die vorhandene Seite ist „gar nicht so schlecht“ → Weiterentwicklung, kein Bruch.
- **Neu ansetzen**, nicht auf dem Juli-Demo `dicular-website-demo` aufbauen.
- **Vorbild:** https://roofrecords.de/ — nicht wegen der Farben, sondern wegen der Art, wie Inhalte dargestellt werden:
  etwas Bewegung, aber nicht zu viel.
- **Logo:** Das Dicular-Logo dreht sich und wird eingeblendet, „ein wenig movie-artig“. Steht es, läuft ab und zu
  ein Glanzeffekt darüber (Licht von oben links nach unten rechts).
- **Menü im Chrome-Effekt** wie das Logo, rein optisch, „auch wenn es dafür Bildlinks statt Text braucht“.
  → Umsetzung als echter Text mit CSS-Metallverlauf (keine Bilder): bleibt lesbar für Google/Screenreader und ohne Grafik änderbar.
- **Kein Trennstrich unter dem Menü** („etwas plump“; gemeint ist der breite graue Balken der jetzigen Seite).
  Alternativen zur Wahl: A nur Raum + Milchglas beim Scrollen · B feine Chrome-Lichtkante, die zu den Rändern ausläuft · C weicher Schatten.

## Abgenommen

- **2026-10-22, Yoka:** Prototyp Logo-Intro + Chrome-Menü „mega gut, echt spitze; auch der Effekt auf den Menüs ist super“.
  Noch offen daran: Drehung Münze oder Schallplatte; Abgrenzung der Menüleiste (A/B/C).

## Entwurf Startseite (2026-10-22)

Seite `/entwurf/` (src/pages/entwurf/index.astro, public/redesign/entwurf.css + .js), echte Inhalte aus den Collections.
Lokal: Startkonfiguration `redesign-dev` → http://localhost:4322/entwurf/

- Intro: Logo-Einblendung + Glanz, Wortmarke wie Filmtitel; danach Lichtlauf über das Chrome-Menü
- Kopfleiste fixiert, kleines Logo erscheint beim Scrollen; **Abgrenzung umschaltbar A/B/C**
- Neuestes Release: Cover schräg mit Namensbalken, Genre-Wörter als Konturschrift, Hintergrund = Cover unscharf + Punktraster, Tracks direkt abspielbar
- Releases und Artists als schräge Karten mit blauen Namensbalken (gerade beim Darüberfahren)
- Dicular Radio als Scheibe (dreht beim Abspielen), alle Release-Tracks gemischt
- Gigs (Datum-Block, Upcoming/Past) und News nebeneinander
- Einblenden beim Scrollen von oben, einmalig; „Bewegung reduzieren“ wird respektiert
- **Umschalter (nur Entwurf):** Logo Münze/Schallplatte, Abgrenzung A/B/C, Intro nochmal; Auswahl steht in der Adresse (z. B. `?logo=record&sep=b`) → Link teilbar für Tomtron

## Rückmeldung Yoka zum Entwurf (2026-10-22)

- „richtig gutes Design, bin schwer begeistert“
- Menü **mittig** statt rechtsbündig → umgesetzt
- Player: Tracks **vor und zurück** skippen → Player-Leiste unten (zurück/abspielen/vor, Zeit, Spulen), gilt für Release-Tracks und Radio
- Vorschau für Tomtron über eine **Subdomain von provolution.org** (Netlify, DNS dort ebenfalls Netlify) statt Plesk → nur Vorschau, Livebetrieb bleibt Plesk (DEC Nr. 29). Zweig `redesign` hat dafür `noindex` und Weiterleitung / → /entwurf/ in netlify.toml.

## Vorschau online (2026-10-22)

**https://dicular.provolution.org/** (leitet auf /entwurf/ um, noindex). Netlify-Projekt `dicular-redesign` im Team „Provolution“, Upload per Kommandozeile, kein automatischer Build (Git-Verbindung für private Org-Repos wäre Netlify Pro, 20 $/Monat; Yoka: Weg A). Aktualisieren: `docs/RECIPES/vorschau-netlify.md`.

## Unterseiten (2026-10-22)

Gemeinsamer Rahmen `src/layouts/Redesign.astro` (Kopfleiste, Chrome-Menü, Fußzeile, Player-Leiste, Umschalter), Stil/Logik `public/redesign/site.css` + `site.js`, Bausteine `RCard` (schräge Karte), `RTracks` (Trackliste), `RBody` (Text; Markdown-Reste wie **fett**/*kursiv*/## werden im Redesign formatiert, 1:1-Fassung unverändert).

- **Release-Seite** `/release/<slug>/`: Kopf mit schrägem Cover, Genre-Wörtern, Punktraster; Label/Datum, Artists + Genres als Chips, Tracks mit Kauf-Link je Track, Kauf-Buttons; Text; Videos per Zwei-Klick (youtube-nocookie); „More Releases“.
- **Artist-Seite** `/artist/<slug>/`: schräges Foto mit Namensbalken, Name in Chrome, Rollen/Herkunft, Genre-Chips, Sprungmarken; Biografie, Releases des Artists (jetzt immer, nicht nur bei gesetztem Music-Titel), SoundCloud per Zwei-Klick, Booking, eigener Abschnitt, „More Artists“.
- **Übersichten** (Baustein `RPageHead`: großer Chrome-Titel, Hintergrund unscharf + Punktraster), jeweils alles auf einer Seite statt Blättern:
  Releases nach Jahr gruppiert · Artists als Porträtkarten mit Rollen/Herkunft · News: neuester Beitrag groß, Rest als Kartenraster · Gigs: Upcoming (aufsteigend) und Past (neueste zuerst) mit Datum, Wochentag, Flyer, Ort.
  Alte Adressen `/releases/page/N/`, `/artists/page/N/`, `/dicular-rec-news/page/N/` → 301 auf die Übersicht (netlify.toml; **beim Umzug als .htaccess übernehmen**).
- Sichtbare Texte durchgehend **englisch** wie die Website (nur Entwurf-Umschalter und Hinweis deutsch).
- **News-Beitrag** (`RNews`): Kopf mit schrägem Beitragsbild, Datum, Kategorien; Text; „More News“. Titel-Dekor wie „### … ###“ wird für die Anzeige geglättet. **Kommentarformular entfällt im Entwurf** (live kein einziger Kommentar) — Entscheidung offen.
- **Event-Seite**: Flyer schräg, großer Datumsblock mit Wochentag, Upcoming/Past, Ort + Adresse, Tickets und Event-Link; Beschreibung; „More Gigs“.
- **Friends** (Übersicht als Karten mit Tätigkeiten) und **Friend-Seite** (Profilbild mit Namensbalken über dem Kopfbild, Tätigkeiten, Social Links, Text).
- **Textseiten** (`RPage`): About, Team, Dicular Digital (my-charts-2), Impressum, Privacy Policy im Lesesatz.
- **Contact** (`RContact`): Kontaktdaten + **Demo-Formular mit Link statt Upload**; öffnet die eigene Mail-App (keine Daten auf der Website, kein Server). Ersetzt das WordPress-Upload-Plugin — **Vorschlag, Entscheidung Yoka/Tomtron** (Alternative: Upload per PHP, DEC Nr. 31).
- Text-Robustheit: lange Links/kopierte Textstücke brechen um, `<pre>`-Blöcke aus kopierten Texten werden wie Fließtext gesetzt; Social-Links in der Fußzeile umbrechen am Handy.
- **Archive** (Kategorie, Tag, Autor als News-Raster `RNewsGrid`; Genre als Release-Karten; Member-Typ als Friend-Karten), jeweils eine Seite; leere Archive mit Hinweis. Chips verlinken: Genre am Release, Kategorie am Beitrag, Tätigkeit am Friend. Alte `/category/<x>/page/N/` und `/author/dicular-admin/page/N/` → 301.
- **Damit ist die ganze Seite im neuen Design** (alle 105 Seiten der Sitemap außer `/`, die im Entwurf noch die 1:1-Startseite ist; neue Startseite unter `/entwurf/`). Der Hinweis „folgt im neuen Design“ ist entfernt.
- Geprüft (Stand Archive): alle 105 Seiten der Sitemap × Desktop/Handy ohne Befund. Vorher: alle 90 neuen Seiten × Desktop/Handy ohne JS-Fehler, Fehlerseiten, Fremdanfragen, Querscrollen.
- Geprüft: 46 Seiten (Start, 33 Releases, 12 Artists) × Desktop/Handy ohne JS-Fehler, ohne Fehlerseiten, ohne Fremdanfragen, ohne Querscrollen.

## Dicular Digital (2026-10-22)

- Menüpunkt **Digital** → `/dicular-digital/` (alte WordPress-Seite `/my-charts-2/` → 301). Sublabel-Seite: freigestelltes Chrome-Logo mit Glanz, bisheriger Einleitungstext, aktuelles Release groß, weitere als „Catalogue“. Sublabel-Releases erkennt die Seite am Label (enthält „Digital“).
- **Erstes Release** `/release/yoka-sawasdeekah/`: DD001, Label DICULAR DIGITAL, Genre Psybient, Cover aus `Dicular-Records-Medien/Cover/YOKA-Sawasdeekah`. Platzhalter: **Coming soon**, Track ohne Hörprobe, Shops (Beatport, Bandcamp, Spotify, Apple Music) ohne Link als „soon“. Text EN mit Umschalter DE (Blöcke `<div class="lang" lang="en|de">` im Text).
- Neues Feld `upcoming` (Schema + Decap) und Shop-Links in Decap. Startseite zeigt oben das neueste **erschienene** Release; Übersicht gruppiert angekündigte unter „Coming soon“.
- Label-Shops verlinkt (Beatport, Bandcamp, SoundCloud), Spotify/Apple Music „soon“. **Erscheinungstermin laut Yoka in 2–3 Wochen (Stand 2026-10-22, also etwa Anfang/Mitte November 2026).**
- Offen: Hörprobe/MP3, genaues Datum, Release-Links der Shops (dann `upcoming` aus), Original-Logodatei von Tomtron.
- Geprüft: alle 106 Seiten der Sitemap × Desktop/Handy ohne Befund.

## Decap online (2026-10-23)

- Repo öffentlich (DEC Nr. 47, Secret-Prüfung der ganzen Historie ohne Befund). Netlify ist jetzt mit dem Repo verbunden und baut den Zweig `redesign` automatisch (keine PR-Vorschauen, Guthaben knapp).
- Login unter https://dicular.provolution.org/admin/ über die GitHub-OAuth-App „Dicular Records CMS“ der Organisation, Netlify als Login-Dienst (DEC Nr. 48). Decap schreibt in `redesign`. Rezept: `docs/RECIPES/decap-online.md`.
- Login getestet (Yoka, 2026-10-23): klappt. Offen: Tomtron als Mitglied einladen (GitHub-Name fehlt noch).

## Mixes (2026-10-23)

- 19 DJ-Sets und Promo-Mixe von soundcloud.com/dicular-records (alle Uploads ab 75 Min.; die 30 Uploads mit 4–9 Min. sind Tracks und bleiben draußen). Zeile wie bei Gigs (Datum, Titel, Ort, Länge, beteiligte Artists), rechts „Play“ lädt den SoundCloud-Player in die Zeile (Zwei-Klick).
- **Kein eigener Menüpunkt, keine Seite /mixes/** (Yoka 2026-10-23: Tomtron möchte das nicht). Die Mixe stehen nur auf den Artist-Seiten.
- Jeder Mix ist Artists zugeordnet und erscheint als Abschnitt „Mixes“ auf deren Artist-Seite (nach Biografie und Releases). **Yokachina-Mixe bei Yoka und bei Kachina** (Wunsch Yoka, es gibt kein eigenes Yokachina-Profil). Sirikit b2b Oli Inkognito nur bei Oli (Sirikit hat kein Profil).
- Inhalte in `src/content/mixes/`, pflegbar in Decap (Sammlung „Mixes“, Artists per Auswahl).
- Nebenbei behoben: Zwei-Klick-Player waren 150 px statt 166 px hoch (`site.js`).
- Geprüft: alle 107 Seiten der Sitemap × Desktop/Handy; einziger Befund die alte 1:1-Startseite `/` (fehlendes WordPress-Skript, betrifft das Redesign nicht, `/` leitet auf `/entwurf/`). Player in Chrome getestet.

## Seiten und Menü in Decap (2026-10-24)

- **Menü** kommt aus `src/data/hauptmenue.json` (nur Redesign; `menu.json` bleibt für die 1:1-Fassung). Decap: Bereich „Menü“, Einträge mit Beschriftung und entweder Seite (Auswahl) oder Adresse, Reihenfolge per Ziehen.
- **Seiten**: Decap-Bereich „Seiten“ zeigt About, Team, Contact, Impressum, Privacy Policy, Dicular Digital (Feld `editable: true`) und neue Seiten. Neue Seite erscheint unter `/<name>/` im Textseiten-Design (Titel, optionale Zeile darüber, Kopfbild, Text). Löschen in Decap aus (Impressum/Datenschutz schützen).
- „Gigs“ heißt überall „Events“ (Adresse bleibt `/gigs/`).
- Geprüft: Testseite + Menüpunkt gebaut und in Decap angezeigt, danach wieder entfernt; alle 107 Seiten × Desktop/Handy ohne neuen Befund.

## V2 (ab 2026-11-04): Das Cover bestimmt die Farbe

Yoka und Tomtron möchten mehr Abstand zum Ursprungsdesign, bei erhaltener Seele. **V1 bleibt unverändert** (Tag `redesign-v1`, Zweig `redesign`, https://dicular.provolution.org/). V2 ist ein Klon: Zweig `redesign-v2`, Ordner `Dicular-Records-Redesign-V2`, Vorschau https://v2--dicular-redesign.netlify.app/ (von Hand hochgeladen, Rezept unten).

- Richtung: Empfehlung C auf Basis von A, von Yoka bestätigt. Fast schwarzer Grund, Chrome-Logo als Lichtquelle, die Cover färben die Seite.
- `src/lib/cover-color.ts` berechnet beim Bauen die Akzentfarbe je Cover. `--c` färbt Knöpfe, Akzente und das Licht im Hintergrund; `public/v2/site.js` blendet beim Scrollen und beim Darüberfahren um. Standardfarbe aller Seiten: neuestes erschienenes Release; Release-Seiten: ihr eigenes Cover.
- Schrift Archivo breit und fett (`public/v2/fonts`), statt Dosis. Keine schrägen Karten, keine blauen Balken.
- Startseite neu: Logo-Intro, neuestes Release randlos, drei große Releases im Wechsel, Cover-Raster ohne Abstände, Radio, Artists als große Namen mit Foto beim Darüberfahren, Events + News.
- Unterseiten (2026-11-05, auf Wunsch Yoka neu aufgebaut, alle Seitentypen): Release, Artist, Event, News, Friend mit Kopf wie auf der Startseite (`.v2-hero.sub`, Titel greift über das Bild). Übersichten und Textseiten mit riesigem Chrome-Titel und schrägem Bild von rechts (`RPageHead`). Cover und Fotos wie hingeworfen (`V2Scatter`, Größen wiederholen sich alle acht Karten, `phase` verschiebt den Anfang), News frei versetzt (`RNewsGrid`), Termine mit großem Datum und versetzten Zeilen (`V2Events`), Lesetext versetzt statt mittig (`.v2-text`). Farbe: Release = Cover, Artist = neuestes Release, sonst Foto, Event/News/Friend = eigenes Bild, Release-Übersicht wechselt je Jahr beim Scrollen. Rahmen an Chips, Sprungmarken und Sprachumschalter entfallen. Am Handy bekommen Logo und Menü-Knopf Milchglas, damit Text nicht mit ihnen kollidiert.
- **Logo-Hintergrund in Chrome** (Idee Yoka): die Logo-Form riesig und angeschnitten hinter allen Seiten (`public/v2/logo-form.svg`, nachgezeichnet mit `scripts/trace-logo.py`, später durch Tomtrons Originaldatei ersetzen). Die Form dreht sich, das Licht steht still, die Reflexe nehmen die Cover-Farbe an. Der Mittelpunkt wandert beim Scrollen, jeder Abschnitt zeigt einen anderen Ausschnitt. Lesetext liegt auf dunkler Fläche. Stärke: `OPACITY` in `public/v2/site.js`. Am Handy dreht es nur beim Scrollen, bei „Bewegung reduzieren“ steht es still.
- Probe „Sawasdeekah aktuell“: https://v2-yoka--dicular-redesign.netlify.app/ (nur Vorschau, Inhalt im Repo bleibt Coming soon).
- Menü **„Cover wählen“** (nur Entwurf, Wunsch Yoka, zum Vergleichen mit Tomtron): beliebiges Release als aktuell schalten, Pfeile zum Durchblättern; tauscht Hero, Farbe und Player, gilt auch auf Unterseiten ohne eigenes Cover, teilbar per `?aktuell=<release>`. Vor dem Livegang entfernen (`public/v2/cover-pick.js`, Block in `entwurf/index.astro`, Zeile im Kopf von `Redesign.astro`).
- **Rückmeldung Yoka (2026-11-04):** Schrift bleibt. Cover-Darstellung aus V1 übernehmen (schräg, Namensbalken). Kein sichtbares Raster: keine Linien und Rahmen, freie Anordnung im Raum. Das Menü schwebte ohne Zusammenhang zum Design, Yoka fehlt dafür noch die Vorstellung, deshalb vier Ideen zum Umschalten.
- **Menü-Ideen** (`html.menu-a` bis `menu-d`, `public/v2/site.css`, offen für Yoka/Tomtron): A Ring (Logo-Viertel in der Ecke, Links auf den Rillen, klappt beim Scrollen zu), B Chrome-Schiene (Standard, Claudes Empfehlung), C Vollbild (nur Knopf, Links groß), D Namensbalken (wie auf den Covern). Am Handy immer Vollbild. Teilbar per `?menu=a`.
- Menü, Stand Yoka 2026-11-04: A und D gefallen am besten. A überarbeitet: Links immer sichtbar (Vermutung Yoka: das will Tomtron), Inhalt läuft unter einer Milchglas-Scheibe durch, kleines Logo erst nach dem Intro. Neu E = A mit den Balken aus D. A ist jetzt Standard. Endgültige Wahl offen (Yoka/Tomtron).
- Neu F = Synth-Panel (Idee Yoka, angelehnt an analoge Synthesizer, eigenes Design ohne Korg-Name oder -Optik): Regler und Buchsen je Menüpunkt, statt des Patch-Kabels (gefiel Yoka nicht, „zu statisch“) ein sichtbarer Signalfluss in Cover-Farbe: Welle mit Impulsen läuft von „Out“ durch die Buchsen zur aktuellen oder überfahrenen Seite, Regler auf dem Weg leuchten auf, bei laufender Musik stärkerer Ausschlag im Takt (`public/v2/synth.js`; die Musik selbst wird nicht ausgewertet). Klick-Ton nur nach Einschalten. Frontplatte mit Details (Wunsch Yoka): gebürstetes Metall, Skalen um die Regler, Modul-Aufdruck Oscillator/Filter/Amplifier je drei Menüpunkte, Fugen, aufgedruckte Pfeile, Lüftungsschlitze. Am Handy Vollbild.
- Die alte Vorschau `v2-yoka` ist überholt, das Menü „Cover“ ersetzt sie.
- Decap schreibt in V2 auf `redesign-v2`. Online-Login auf der V2-Adresse noch nicht getestet.
- Hochladen: `npm run build`, dann `npx netlify-cli deploy --dir=dist --alias=v2 --site=9251de6c-30e3-4be7-9ce8-235074d2249e --no-build`. Nie `--prod`, das würde V1 ersetzen.

## DNA, die bleibt

- Farben: Petrol `#00283a`, Akzent Blau `#2a5982`, Akzent Grün `#2cc894`, Text `#adadad`
- Schrift: Dosis (leicht für Fließtext, fett für Titel), große Titel mit Zierbalken darunter
- Rundes Metall-Logo (Kreis-Motiv) und Wortmarke „DICULAR RECORDS“
- Inhalte und Struktur: Releases, Artists, News, Gigs, Friends, Team; Player (360°-Player, Dicular Radio)

## Beobachtungen roofrecords.de (Divi-Theme)

| Element | Umsetzung dort |
|---|---|
| Fotos | jede Karte leicht gedreht (−4° … +4°), beim Darüberfahren gerade (0,2 s) |
| Namen | schwarzer Balken mit weißer, fetter Schrift, ragt seitlich über das Foto |
| Kopfbereich | gestapelte Riesenwörter, jedes leicht verdreht, über Foto mit Punktraster |
| Bewegung | Abschnitte gleiten beim Scrollen einmalig von oben herein |
| Raum | viel Weißraum, wenige Elemente pro Bildschirm, Leistungen als abgerundete Karten |

## Ideen (Sammlung, noch nicht entschieden)

- Logo-Intro wie ein Filmvorspann + gelegentlicher Glanz, Menü in Chrome mit einmaligem Lichtlauf nach dem Intro und Glanz beim Darüberfahren → Prototyp `public/prototypes/logo-intro.html` (Varianten: Münze / Schallplatte)
- Artist- und Release-Karten schräg mit Namensbalken in Dicular-Blau
- Kopfbereich mit gestapelten Genre-Wörtern (PROGRESSIVE / TRANCE / HOUSE / TECHNO) über dem aktuellen Release
- Sanftes Einblenden beim Scrollen; Bewegung respektiert „Bewegung reduzieren“ im Betriebssystem
- Player, der beim Seitenwechsel weiterspielt; Dicular Radio als feste Größe
- Kreis-Motiv als wiederkehrendes Element (Cover-Rahmen, Player, Übergänge)
- Eigener, schlanker Code statt WordPress-Theme-Rahmen

## Offen

- Entscheidungen Yoka/Tomtron: Logo Münze/Schallplatte · Menü-Abgrenzung A/B/C · Demo-Formular (Link + Mail-App) statt Upload · Kommentare unter News ja/nein
- Vor dem Livegang: neue Startseite von /entwurf/ nach / verschieben, Entwurf-Umschalter entfernen, Umleitungen als .htaccess, Inhaltspflege (###-Titel, „Weniger anzeigen“, Dateinamen als Tracktitel)

- Entscheidungen zu den Ideen oben (mit Yoka/Tomtron)
- Reihenfolge: zuerst Startseite als Entwurf, danach Release-, Artist- und Übersichtsseiten
