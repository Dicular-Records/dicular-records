## Redaktionsoberfläche (Decap) lokal öffnen
**Letzte Verwendung:** 2026-10-23
**Zweck:** Inhalte (Artists, Releases, News, Events) im Browser bearbeiten, bevor der Online-Login eingerichtet ist. Änderungen landen direkt als Dateien im Ordner (kein GitHub-Login, kein Passwort).
**Befehl/Schritte** (zwei Git-Bash-Fenster):
```bash
# 1) Entwicklungsserver des Redesigns (Port 4322)
cd /c/Users/yoka/Claude-Arbeit/Dicular-Records-Redesign && npm run dev -- --port 4322
# 2) Decap-Lokal-Server (Port 8081), schreibt in diesen Ordner
GIT_REPO_DIRECTORY="C:/Users/yoka/Claude-Arbeit/Dicular-Records-Redesign" PORT=8081 npx decap-server
```
Dann im Browser **http://localhost:4322/admin/index.html** öffnen → „Login“ (ohne Passwort).
In der Claude-App: Startkonfigurationen `redesign-dev` und `decap-redesign`.
**Wo nachschauen:** Änderungen erscheinen sofort unter http://localhost:4322/… ; danach committen (`git add -A && git commit`) und für die Vorschau neu hochladen (`vorschau-netlify.md`).
**Stolpersteine:**
- Im Entwicklungsserver nur `/admin/index.html`, nicht `/admin/` (im fertigen Build geht beides).
- Lokaler Betrieb schreibt ohne Rückfrage in die Dateien; die „Veröffentlichen“-Stufen (Entwurf → Prüfung → Bereit) gibt es erst mit Online-Login.
- **Online-Zugang** (Tomtron, Artists): braucht den GitHub-Login über einen Login-Dienst (geplant: PHP-Skript auf dem Plesk-Server, DEC Nr. 30) — wird beim Rechte-Setup eingerichtet.
