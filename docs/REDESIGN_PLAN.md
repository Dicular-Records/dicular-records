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

- Entscheidungen zu den Ideen oben (mit Yoka/Tomtron)
- Reihenfolge: zuerst Startseite als Entwurf, danach Release-, Artist- und Übersichtsseiten
