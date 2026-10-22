## Redesign-Vorschau auf dicular.provolution.org aktualisieren
**Letzte Verwendung:** 2026-10-22
**Zweck:** Den Zweig `redesign` als Vorschau für Tomtron veröffentlichen (nicht der Livebetrieb, der bleibt auf dem Plesk-Server).
**Befehl/Schritte** (im Ordner `C:\Users\yoka\Claude-Arbeit\Dicular-Records-Redesign`, Git-Bash):
```bash
npm run build
npx netlify-cli deploy --prod --dir dist
```
Der Ordner ist mit dem Netlify-Projekt verknüpft (`.netlify/state.json`, nicht im Repo). Die Anmeldung des Werkzeugs liegt im Netlify-Konfigurationsordner des Benutzers. Falls sie fehlt: `npx netlify-cli login` → im Browser „Authorize“.
**Wo nachschauen:** https://app.netlify.com → Team „Provolution“ → Projekt `dicular-redesign` · Vorschau: https://dicular.provolution.org/
**Stolpersteine:**
- Netlifys Git-Verbindung für private Repositories einer **Organisation** kostet Pro (20 $/Monat). Darum Upload per Kommandozeile statt automatischem Build.
- `netlify.toml` im Zweig `redesign` setzt `noindex` und leitet `/` auf `/entwurf/` um. Der Livebetrieb nutzt diese Datei nicht.
- Beim GitHub-Popup „Authorize Netlify“ ist der Knopf ein paar Sekunden gesperrt (Schutz von GitHub). Während das Popup offen ist, darf der Netlify-Tab nicht neu geladen werden, sonst kommt „Invalid state key“.
