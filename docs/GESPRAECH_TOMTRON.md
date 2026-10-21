# Gespräch mit Tomtron — neue Dicular-Website

## Was gleich bleibt
- Das **Aussehen ist 1:1 identisch** (Pixelvergleich aller 125 Seiten).
- **Alle Adressen bleiben gleich**: alte Links, Google-Einträge und geteilte Posts funktionieren weiter.
- Alle Inhalte sind übernommen: Releases, Artists, News, Events, Friends, Team, Impressum.

## Was besser wird

**1. Kein WordPress-Ballast mehr**
- Keine Updates mehr für WordPress, das Theme und rund 15 Plugins (WPBakery, WooCommerce …), keine kaputten Seiten nach Updates.
- Kein Datenbank-Server, kein Login-Formular für Angreifer: Die Seite besteht nur noch aus fertigen Dateien. Dadurch ist sie sicherer und schneller.

**2. Inhalte pflegen ohne Webdesigner**
- Bearbeitet wird im Browser über einfache Formulare (Titel, Text, Bild, SoundCloud-Link) statt mit dem Page-Builder.
- Das Design kann dabei nicht versehentlich kaputtgehen, weil Inhalt und Gestaltung getrennt sind.

**3. Artists pflegen ihre Seite selbst**
- Jeder Artist bekommt ein eigenes Login und kann **nur seine eigene Seite** ändern, z. B. Bio, Foto, SoundCloud-Player.
- Claude prüft jede Änderung automatisch: Pflichtfelder, Bildgröße, funktionierende Links.
- Alles andere (Releases, News, Events, Startseite …) bleibt bei euch zwei Admins: **Tomtron und Yoka geben frei.**

**4. GitHub: Gedächtnis und Sicherheitsnetz**
- **Jede Änderung wird gespeichert**: wer, was, wann. Jeder frühere Stand ist mit einem Klick wiederherstellbar.
- **Vorschau vor der Veröffentlichung**: Änderungen lassen sich vorher als Testseite ansehen.
- **Eingebautes Backup**: Die komplette Website liegt bei GitHub und lokal. Fällt ein Anbieter aus, ist die Seite in Minuten woanders wieder online.
- **Keine Abhängigkeit** von einem Hoster, Theme-Hersteller oder Designer.

**5. Kosten**
- Hosting bei Netlify ist für eine Seite dieser Größe voraussichtlich im kostenlosen Tarif möglich. GitHub-Konten sind kostenlos.
- Die WordPress-Hosting- und Plugin-Kosten entfallen.

## Was sich für Tomtron ändert
- Einmalig ein **kostenloses GitHub-Konto** anlegen, das ist dann das Login für die Website.
- Freigaben gehen per Klick: Ein Artist ändert seine Seite, Claude prüft, die Seite geht online. Andere Änderungen geben Tomtron oder Yoka frei.

## Ehrlich: offene Punkte
| Thema | Stand | Zu entscheiden |
|---|---|---|
| Release-MP3s (642 MB) | spielen noch von der alten Seite, Sicherung vorhanden | Wo sollen sie künftig liegen? |
| Demo-Upload auf „Contact“ | braucht WordPress, funktioniert danach nicht mehr | Upload-Link (z. B. Dropbox/WeTransfer) oder nur noch E-Mail? |
| Kommentare unter News | Formular bleibt, Einsendungen kommen per E-Mail an die Admins | Okay so? Bisher gab es keinen einzigen Kommentar. |
| Redaktions-Oberfläche + Artist-Logins | als Nächstes | – |
| Design-Überarbeitung | bewusst erst nach dem Umzug | Wünsche sammeln |

## Was ich von Tomtron brauche
1. Seinen **GitHub-Benutzernamen** (Konto anlegen).
2. **Liste der Artists**, die ihre Seite selbst pflegen sollen, mit Kontakt.
3. **Zugang zur Domain** (wo ist dicular-records.com registriert, wer hat das Login?). Den braucht es für die Umstellung.
4. Entscheidungen zu MP3-Speicherort und Demo-Upload (siehe oben).

## Ablauf bis zur Umstellung
1. Vorschau-Adresse bei Netlify zum Durchklicken
2. Abnahme durch Tomtron und Yoka
3. Domain auf die neue Seite umstellen (Ausfall: keiner bis wenige Minuten)
4. WordPress noch einige Wochen als Rückfallebene behalten, danach abschalten
