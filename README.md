# French Tip Nails · EU31 start guide

Cechovní plán na první 3 dny serveru EU31 (Shakes & Fidget). Web: **https://kubalooop.github.io/ftn-eu31-guide/**

Odkazy s přednastaveným režimem: `…/#f2p` a `…/#eco`.

## Co kde upravit

| Co | Soubor |
|---|---|
| Datum a čas startu (živé hodiny v harmonogramu) | `assets/js/config.js` → `startAt` |
| Texty, checklisty, časy v timeline | `index.html` |
| Barvy / světlý a tmavý režim | `assets/css/tokens.css` |
| Vzhled komponent | `assets/css/components.css` |

### Pravidla pro checklisty
- Každý checkbox má **unikátní `id`**. Podle něj si prohlížeč pamatuje odškrtnutí, takže existující `id` neměň a nepoužívej znovu.
- `data-only="eco"` / `data-only="f2p"` zobrazí prvek jen v daném režimu.
- Položky timeline (`.tl-item`) mají `data-start` / `data-end` v minutách od startu (16:00 = 0, 22:30 = 390). `data-deadline` = popisek v odpočtu, `data-for` = jen pro ECO/F2P (druhý režim ho vidí zašedlý).

### Náhled živých hodin bez data
Otevři stránku s `?sim=17` (start byl před 17 minutami) nebo `?sim=-30` (start za 30 minut).

## Lokálně
Stačí otevřít `index.html` v prohlížeči. Nic se nebuilduje.

## Nasazení
GitHub Pages z větve `main`, složka `/`. Každý push na `main` se do minuty projeví na webu.

---
Data: S&F Guide Hub (Vaaz, Darth Monk). Infografiky © SF Tavern.
