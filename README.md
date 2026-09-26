# Physics Tutor & Compendium

An interactive tutor and compendium of physics principles, models, definitions,
formulas, lessons and explanations — spanning **classical and quantum** physics.
Content is organised by **domain** (mechanics, waves, thermodynamics,
electricity, magnetism, optics, quantum, relativity) and many lessons include
**interactive, animated visual explainers**.

## Features

- **Domain-based navigation** — browse by field of physics from the sidebar or overview grid.
- **Structured lessons** — each lesson has a definition, plain-language explanation, key formulas, and takeaways.
- **Interactive visual explainers** — animated Canvas simulations with live sliders:
  - Projectile motion, pendulum / SHM, transverse waves, orbital (Kepler) motion
  - Electric dipole field lines, DC circuit & Ohm's law, converging-lens ray diagram
  - Double-slit interference, quantum particle-in-a-box wavefunction
- **Instant search** across every lesson, definition and key point.
- **Responsive** layout with a collapsible sidebar for mobile.
- **Android companion (installable PWA)** — install to your home screen and use fully offline.
- **Zero build step / no dependencies** — pure HTML, CSS and vanilla JavaScript.

## Running locally

It's a static site, so any static file server works:

```bash
# from the repository root
python3 -m http.server 8099
# then open http://localhost:8099/
```

Or simply open `index.html` in a browser.

## Android companion (installable PWA)

The site is a **Progressive Web App**, so it doubles as an installable Android
app — no Play Store or native build required. Once installed it runs in its own
window (no browser chrome) and works **fully offline**.

**Install on Android (Chrome/Edge):**

1. Host the folder over **HTTPS** (a service worker requires HTTPS, except on
   `localhost`). Any static host works — GitHub Pages, Netlify, etc.
2. Open the site in Chrome/Edge on your Android device.
3. Tap the in-app **⬇ Install** button, or use the browser menu →
   **Install app** / **Add to Home screen**.
4. Launch it from your home screen like any other app; it will work offline.

Desktop Chrome/Edge show the same install option in the address bar.

### PWA files

```
manifest.webmanifest    App metadata (name, colors, icons, standalone display)
sw.js                   Service worker: precache + offline app shell
js/pwa.js               Registers the service worker and the install button
icons/                  App icons (192/512 standard + maskable, apple-touch)
```

> Note: the service worker only activates over HTTPS or `http://localhost`.
> Opening `index.html` directly via `file://` runs the app but without offline
> caching or install.

## Project structure

```
index.html              App shell (topbar, sidebar, content, search)
css/styles.css          Styling and responsive layout
js/data.js              Physics content: domains -> topics -> lessons
js/visualizations.js    Canvas visual explainers (one function per animation)
js/app.js               Navigation, hash routing, rendering and search
js/pwa.js               PWA service-worker registration and install prompt
manifest.webmanifest    Web app manifest for Android/desktop install
sw.js                   Service worker for offline support
icons/                  PWA app icons
```

## Adding content

- **New lesson:** add an object to a topic's `lessons` array in `js/data.js`.
  Optionally set `viz: "<id>"` to attach a visual explainer.
- **New visual explainer:** add `VISUALS.<id> = function(canvas, controls) { ... return cleanup; }`
  in `js/visualizations.js`, then reference that `<id>` from a lesson's `viz` field.
