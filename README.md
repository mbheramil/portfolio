# portfolio

A futuristic, single-page portfolio. Built with Vite + TypeScript + Three.js.

## Editing content

All copy lives in **`src/content.ts`** — bio, projects, stack, process, socials, email, résumé URL.
Edit that file and push. The site rebuilds automatically via GitHub Actions.

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. The GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.

## First-time setup

1. In your repo settings → **Pages** → set Source to **GitHub Actions**.
2. Drop your résumé into `public/resume.pdf` (referenced by `site.resumeUrl` in `src/content.ts`).
3. Add real project covers to `public/` and update `cover` URLs in `src/content.ts`.

## Easter eggs

- `⌘K` / `Ctrl+K` — command palette
- `↑ ↑ ↓ ↓ ← → ← → B A` — surprise
- Type `matrix` in the terminal (palette → Open terminal)

## Structure

```
src/
  main.ts            — entry, boot sequence
  content.ts         — ALL editable content
  modules/
    cursor.ts        — custom cursor
    hero.ts          — Three.js particle field
    scroll.ts        — reveal-on-scroll, nav state, typewriter
    palette.ts       — Cmd+K command palette
    terminal.ts      — easter-egg terminal
    easter.ts        — konami code → matrix rain
    sections.ts      — renders content into the DOM
  styles/
    main.css         — design system + components
```
