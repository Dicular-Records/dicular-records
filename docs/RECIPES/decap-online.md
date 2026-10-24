## Redaktionsoberfläche (Decap) online
**Letzte Verwendung:** 2026-10-23
**Zweck:** Inhalte (Releases, News, Events, Artists) im Browser pflegen, ohne etwas zu installieren. Anmeldung mit dem eigenen GitHub-Konto.
**Adresse:** https://dicular.provolution.org/admin/ → „Mit GitHub anmelden“
**Wer darf:** jedes GitHub-Konto mit Schreibrecht auf `Dicular-Records/dicular-records` (Mitglied der Organisation Dicular-Records). Ein kostenloses GitHub-Konto reicht.

**Ablauf beim Speichern** (editorial_workflow):
1. „Speichern“ legt einen Entwurf an (Pull Request auf den Zweig `redesign`).
2. Status auf „Bereit“ setzen, dann „Veröffentlichen“ → Änderung landet in `redesign`.
3. Netlify baut automatisch (ca. 1–2 Min.), danach ist sie auf der Vorschau sichtbar.

**Technik (einmalig eingerichtet 2026-10-23):**
- GitHub-OAuth-App „Dicular Records CMS“ der Organisation: https://github.com/organizations/Dicular-Records/settings/applications/3957304 (Callback `https://api.netlify.com/auth/done`).
- Netlify-Projekt `dicular-redesign` → Project configuration → Security → OAuth → Provider GitHub (Client-ID + Secret der App). Das Secret steht nur dort, nirgends im Repo.
- `public/admin/config.yml`: `branch: redesign`, `site_url: https://dicular.provolution.org`. Decap nimmt als Login-Dienst automatisch `api.netlify.com`.
- Netlify ist mit dem Repo verbunden (Zweig `redesign`, keine Vorschau-Builds für Pull Requests), um Build-Guthaben zu sparen.

**Neue Seite mit Menüpunkt:**
1. „Seiten“ → „+ Seite“: Titel, Text, optional Kopfbild → speichern und veröffentlichen. Die Seite liegt dann unter `/<name>/` (Name aus dem Titel).
2. „Menü“ → „Hauptmenü“ → „Menüpunkt hinzufügen“: Beschriftung eintragen, bei „Seite“ die neue Seite wählen, an die gewünschte Stelle ziehen → veröffentlichen.
Menüpunkte können statt einer Seite auch eine Adresse haben (z. B. `/releases/` oder einen externen Link).

**Neue Person freischalten:** https://github.com/orgs/Dicular-Records/people → „Invite member“ → GitHub-Name eintragen → Rolle „Member“; danach im Repo Schreibrecht geben (Repo → Settings → Collaborators and teams).

**Stolpersteine:**
- Während das Login-Fenster offen ist, die Seite nicht neu laden („Invalid state key“).
- Neues Secret erzeugt? Dann auch in Netlify eintragen, sonst schlägt der Login fehl.
- Netlify-Guthaben ist knapp (mit provolution.org geteilt). Jede Veröffentlichung kostet einen Build.
- Beim Livegang auf Plesk: `branch: main` und eigener Login-Dienst per PHP (DEC Nr. 30), die Netlify-Lösung gilt nur für die Vorschau.
