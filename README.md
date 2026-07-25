# portfolio

Personal site. Vite + TypeScript + Three.js, deployed to GitHub Pages.
Live at [mbheramil.com](https://mbheramil.com).

No framework, no runtime dependencies beyond Three.js, no backend.

## Editing content

All copy lives in **`src/content.json`** — bio, projects, lab entries, stack,
scale stats, socials, email, résumé URL. `src/content.ts` is a thin typed
wrapper around it.

Two ways to edit it:

- **Admin panel** at `/admin` — a single dependency-free HTML file that reads
  and writes `content.json` straight through the GitHub Contents API. Image
  uploads become commits; saving triggers the Actions build. Needs a GitHub
  token with write access to this repo.
- **By hand** — edit `src/content.json` and push.

Several sections are runtime-conditional: emptying an array in `content.json`
removes that whole section along with its nav links and command-palette
entries. Section numbers are derived from what actually rendered, so nothing
leaves a gap.

## Local dev

```bash
npm install
npm run dev     # localhost:5173
```

`/admin` works from localhost too — it talks directly to the GitHub API, so it
edits the live repo regardless of where it's served from.

## Build

```bash
npm run build   # tsc --noEmit && vite build → dist/
```

`.github/workflows/deploy.yml` runs this and deploys on every push to `main`.

## Easter eggs

- `⌘K` / `Ctrl+K` or `/` — command palette
- `↑ ↑ ↓ ↓ ← → ← → B A` — matrix rain
- Palette → "Open terminal" — try `help`, `theme`, `matrix`

## Structure

```
index.html           — home
case.html            — case study template (?p=<project-id>)

src/
  main.ts            — home entry
  case.ts            — case study entry
  content.json       — ALL editable content
  content.ts         — typed wrapper around content.json
  modules/
    sections.ts      — renders content into the DOM
    hero.ts          — Three.js particle field (custom GLSL shader)
    scroll.ts        — reveal-on-scroll, nav state, typewriter
    nav-numbers.ts   — derives section numbers from rendered sections
    palette.ts       — command palette
    terminal.ts      — easter-egg terminal
    easter.ts        — konami code → matrix rain
    contact-form.ts  — EmailJS submission + mailto fallback
    html.ts          — shared escaping / template helpers
  styles/
    main.css         — design system + components

public/
  admin/index.html   — content editor (GitHub API as backend)
  screenshots/       — project covers and gallery images
```

## Résumé

The Résumé card, palette command, and terminal `resume` command all stay hidden
until `resumeUrl` is set in `content.json` — so the link can never 404. Drop a
PDF at `public/resume.pdf` and set `"resumeUrl": "/resume.pdf"` to enable them.
