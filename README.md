# doova-site

De landingspagina van [Doova](https://github.com/BEMBOOMER/doova), een werkblad
voor macOS.

Statische site, geen build-stap: `index.html`, `styles.css`, `main.js` en
`assets/` staan in de root. Vercel herkent dit automatisch als "Other" en
serveert de map zoals hij is.

## Lokaal bekijken

```bash
python3 -m http.server 4310
```

Daarna [localhost:4310](http://localhost:4310) openen.

## Bij een nieuwe Doova-versie

Drie plekken in `index.html` verwijzen naar de release:

- het versielabel boven de titel
- de downloadknop in de hero
- de downloadknop en de specificaties onderaan

Zoek op het oude versienummer en vervang overal. De downloadlinks wijzen naar
`github.com/BEMBOOMER/doova/releases/download/<tag>/Doova_<versie>_aarch64.dmg`.

## Assets

`assets/doova-promo.mp4` is de promovideo (met geluid, daarom start hij pas na
een klik). `assets/poster.jpg` is het eindkader van diezelfde video en
`assets/app-shot.jpg` een kader uit het begin.
