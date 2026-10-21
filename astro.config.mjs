// @ts-check
import { defineConfig } from 'astro/config';

// URL-Struktur 1:1 wie die WordPress-Seite (mit Slash am Ende), damit bestehende Links weiter funktionieren.
export default defineConfig({
  site: 'https://dicular-records.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
