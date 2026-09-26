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
- **Zero build step / no dependencies** — pure HTML, CSS and vanilla JavaScript.

## Running locally

It's a static site, so any static file server works:

```bash
# from the repository root
python3 -m http.server 8099
# then open http://localhost:8099/
```

Or simply open `index.html` in a browser.

## Project structure

```
index.html              App shell (topbar, sidebar, content, search)
css/styles.css          Styling and responsive layout
js/data.js              Physics content: domains -> topics -> lessons
js/visualizations.js    Canvas visual explainers (one function per animation)
js/app.js               Navigation, hash routing, rendering and search
```

## Adding content

- **New lesson:** add an object to a topic's `lessons` array in `js/data.js`.
  Optionally set `viz: "<id>"` to attach a visual explainer.
- **New visual explainer:** add `VISUALS.<id> = function(canvas, controls) { ... return cleanup; }`
  in `js/visualizations.js`, then reference that `<id>` from a lesson's `viz` field.
