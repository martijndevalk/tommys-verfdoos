# Tommy's Verfdoos

Een schone, minimalistische Astro + React kickstarter applicatie.

## ✨ Kenmerken

- **Astro & React**: Het beste van twee werelden voor snelle performance
- **Clean Sheet**: Geen overbodige componenten, puur een wit canvas ("App.tsx")
- **PWA-ready**: Inclusief web manifest en basic Service Worker config
- **Yarn**: Volledig geconfigureerd voor het gebruik van Yarn

## 🚀 Aan de slag

### 1. Installeren
Gebruik Yarn voor het installeren van de dependencies:

```bash
yarn install
```

### 2. Ontwikkelen
Start de lokale ontwikkelserver:

```bash
yarn dev
```

Je blanco canvas is bereikbaar via `http://localhost:4321/tommys-verfdoos`.
*Let op: de base URL in `astro.config.mjs` is `/tommys-verfdoos` dus de server roep je daarop aan.*

### 3. Bouwen & Productie
Bouw de bestanden voor productie:

```bash
yarn build
```

De output wordt weggeschreven in de `dist/` folder.

## 🛠️ Aanpassen

Je kunt beginnen door jouw eigen logica en componenten toe te voegen aan:
**`src/components/App.tsx`**

Style vars (CSS variabelen waaronder kleuren & spacing) kunnen worden aangepast in:
**`src/layouts/Layout.astro`**

Succes met bouwen!
