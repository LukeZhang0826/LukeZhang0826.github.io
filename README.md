# lukeypookster.com

Source for my personal site, live at [lukeypookster.com](https://lukeypookster.com).

The repo is a monorepo holding three generations of the site. Only `lukeypookster3.0/`
is current. The other two are kept for reference and are not maintained.

Still a work in progress. Some media on the live site is placeholder content, and where
a piece is not mine it is labelled and credited in place.

## Layout

| Path | What it is |
| --- | --- |
| `lukeypookster3.0/` | The current site. Vite, React, TypeScript. This is the one to edit. |
| `docs/` | Build output. GitHub Pages serves the site from this folder. Do not hand-edit. |
| `lukeypookster2.0/` | v2, Next.js 13. Reference only. |
| `Archive/` | v1, webpack and three.js. Reference only. |

## Running the current site

```bash
cd lukeypookster3.0
npm ci
npm run dev      # http://localhost:3000
```

`npm run build` typechecks with `tsc` and then builds. `npm run lint` is `tsc --noEmit`,
so it typechecks without emitting.

## Deploying

Pages is configured to serve the `main` branch from `/docs`, with `lukeypookster.com` as
the custom domain. There is no CI step, so the built output is committed to the repo.

That means editing `lukeypookster3.0/src` alone changes nothing on the live site. The
full loop is:

```bash
cd lukeypookster3.0
npm run build        # writes to ../docs, per build.outDir in vite.config.ts
cd ..
git add -A docs
git commit -m "Rebuild docs"
git push
```

Pages then rebuilds on its own, usually inside a few minutes.

Two things about that build worth knowing. `emptyOutDir` is on, so the build wipes
`docs/` every time. `CNAME` and `.nojekyll` survive only because they live in
`lukeypookster3.0/public/` and get copied back in on each build, so leave them there.
And `base` is `./`, meaning asset paths are relative, so the build works whether it is
served from a domain root or a subfolder.

## Sections of the current site

Each section is deliberately its own visual world rather than a shared house style.

| # | Section | Centerpiece |
| --- | --- | --- |
| 00 | The Index | Randomized art-directed hero, one style per page load |
| 01 | Development | Experience accordion and project case studies |
| 02 | Animation | Film-strip reels with a projector treatment |
| 03 | Graphics & Design | Horizontal dictionary of design styles, plus work galleries |
| 04 | Photo / Arch | Renders, models, and photography |
| 05 | Music | Audio-reactive circle of fifths and a performing timeline |
| 06 | The Room | 3D room finale and contact |

Below-the-fold sections are code-split and mounted on approach, and the WebGL canvases
gate their render loops on an IntersectionObserver so nothing animates off-screen.

`lukeypookster3.0/CLAUDE.md` carries the detailed build notes and the decisions behind
each section.
