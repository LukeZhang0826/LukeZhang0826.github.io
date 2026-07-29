# Portfolio 3.0 — Project Context

Rebuild of Luke Zhang's personal site (live 2.0 at **lukeypookster.com**). Goal: an
**Awwwards-tier, deliberately eclectic / "maximum clash" anti-design** portfolio that
showcases four pillars — **development, 3D design, 2D graphic design, music**.

The 3.0 code lives in `lukeypookster3.0/`. The old `lukeypookster2.0/` (Next.js 13) and
`Archive/`, `failed version/` are reference only — do not edit them.

## Locked decisions
- **Cohesion model: "lean into the chaos."** Minimal shared spine; each section is its own
  clashing art-directed world (acid graphics, anti-design, cyber brutalism, Mondrian solids,
  tessellation/computational geometry, naturalism). **Chaos in the pixels, order in the code** —
  visuals clash freely but engineering stays disciplined (one scroll/transition engine, asset
  pipeline, shared primitives).
- **Stack: Vite + React + TS + Tailwind + Framer Motion + Lenis (smooth scroll).** No Next.js.
  SEO via prerender + per-section OG meta. Deploy on Vercel.
- **3D tooling: hybrid R3F + Spline.**
  - R3F / three.js (hand-rolled): hero geometry, the Music circle-of-fifths viz, the room finale, contact viz.
  - Spline (paid — user willing): the dedicated 3D-design showcase scene.
- **First build target: design-system + Section 00 hero vertical slice** — lock the "feel" on a
  real screen before mass-producing the other sections.
- **No em-dashes, ever (Luke's rule, 2026-06-27).** Zero em-dash characters anywhere the user can
  encounter them: JSX/UI copy, `src/data/*` strings, `index.html` title/meta, and even code
  comments. Use a plain ASCII hyphen `-`, a colon, or reword. Arrows (→ ↓ ↑ ←) are fine. The site
  was purged site-wide (src/, index.html, public/) on this date; do NOT reintroduce em-dashes when
  writing new copy or code.

## Section structure (each = own clashing art direction)
Roles are tagged with a `discipline` in `src/data/experience.ts` and routed to their section.
| # | Section | Discipline | Centerpiece / content |
|---|---------|-----------|------------------------|
| 00 | Index / Hero | — | **NOW A MULTI-STYLE RANDOMIZABLE HERO (2026-06-28 session 3).** The landing itself showcases the "maximum clash" thesis: it renders ONE of several clashing, art-directed "worlds" (one per design genre) and the user randomizes between them. **Architecture (the order in the chaos):** `components/sections/HeroSection.tsx` = thin shell — picks a **random style on each page load**, renders the active style component, remounts it on shuffle (nonce key) to replay its intro. `components/hero/heroStyles.ts` = the **registry** (`HERO_STYLES`) + **shared content** (`HERO_NAME`/`HERO_STATUS`/`HERO_ROLE`/`HERO_DISCIPLINES`) + per-style `control` theme; add a genre = one entry. `components/hero/StyleControl.tsx` = the bottom **`STYLE 01 ✦ VAPORWAVE ↻ Shuffle`** widget (just the pill; each style positions it; themed via data so it always matches the world). `components/hero/repel.tsx` = **shared cursor-repel system** (`RepelProvider`/`RepelText`/`RepelNode`): letters scatter away from the cursor (Obsidian graph / Coltrane feel) via **ONE pointermove listener + ONE rAF loop writing direct DOM transforms** (sleeps when idle; scales to all hero copy cheaply — do NOT go back to per-letter framer springs). **Only `vaporwave` exists so far** (plan ~5). The **scramble decode-in + `.hero-name` RGB-glitch are RESERVED for a future heavy-typography style** (`useScramble.ts` + `.hero-name` CSS kept on purpose, currently unused). **Style 01 = VaporwaveHero** (`components/hero/styles/VaporwaveHero.tsx` + the R3F `VaporwaveCanvas.tsx`): pink perspective **grid floor** + a **faded floor reflection** of the sky (nebula+stars, `starRoundFloor` uses `fwidth` so dots stay round at the grazing angle), **retro sun REMOVED 2026-07-05** (bust poster is the centerpiece; `SUN_VERT` kept for the sky's horizon clip), **dark-purple sky** with starfield + drifting **nebula** + glowing horizon line, **halftone+grain** overlays. Name (2026-07-05 poster rebuild) = **sideways-rotated grotesk caps running DOWN the left edge** (vertical-rl + text-orientation:sideways, `CHROMA` split shadow; **Fusterd graffiti BENCHED** - the self-hosted `public/fonts/Fusterd-Brush.woff2` + `graffiti` token + `.neon-pink`/`.neon-cyan` classes are KEPT for a future style). **(2026-07-05) copy stripped to poster-minimal: name + Enter CTA + marquee only** (status/role/intro/WIP removed; the name still repels the cursor). Layout = **canvas area (`flex-1`) + marquee strip STACKED to fill the viewport** (canvas ends above the marquee, no overlap); marquee pinned bottom. Text selection disabled on the hero. Palette: dark purple bg `#160A2B`, pink `#FF6AD5`/`#FF49C7`, cyan `#2DE2E6`, off-white `#FDEFF9`; selection `sel-vapor`. **Perf:** `VaporwaveCanvas` `frameloop` is IntersectionObserver-gated (pauses all shaders when scrolled off-screen); `fbm` is 3 octaves; font is woff2. **REMOVED / do not resurrect:** the icosphere blob, the spray-paint load animation (broke — name has no load-in yet, TODO), the block pointer-parallax (fought the repel + caused lag), the wireframe mountains, the name overlap experiment. Earlier dead-ends already deleted: `three/GeometryField.tsx`, `sections/AsciiField.tsx`, `sections/VaporwaveScene.tsx`, `sections/FloatingTags.tsx`. (bone/ink/**acid** hero was tried and rejected.) |
| 01 | Development | `dev` | BitGo ×2 / Kobo / Azoma / Viva / Clairify + projects (IceMeister, Alpha Connect 4, Spotify Indie, Finanseer). DONE: accordion experience + Tofu-style cards + case-study drawer. |
| 02 | Animation | `3d` (data tag) / HUD lights **music + design** | **REBUILT BELOW THE HERO into a FILM-STRIP REEL + VINTAGE PROJECTOR (2026-06-28 long session).** **Hero UNCHANGED:** full-bleed looping GIF `public/animation/us-mediadesign-emeszack-portfolio-01.gif` (by **EmesZack**, credit overlay present → instagram.com/emeszack2000) via `components/animation/AnimationHero.tsx` (`<img>` object-cover, cursor-parallax), `aspect-video`, label **"Poetry in motion"** in `font-anim` **Shippori Mincho** + vertical kanji **動**. (dedouze (David Mata) remains the *style* north-star for the GIF; the old Escher cube / `GreasePencilScene`/`CityScene`/Spline/`.glb` dead-ends stay DELETED - NPR/grease-pencil doesn't survive glTF export.) **Everything below the hero was replaced** - the old dedouze doodle GRIDS, `LoopTile`, `TiltCard`, `DoodleField.tsx`, blue `LOOPS_BG` ground are **DELETED**. Now a **white "projected-film" ground** holds **TWO horizontal FILM-STRIP reels**: "Completed animated works" (Reel 01) + "Selected loops" (Reel 02). **The strip is a tiled SVG** `public/filmstrip.svg` (a CorelDRAW film cell: rounded interior window + sprocket-hole rows, all TRANSPARENT cut-outs; edited to **`preserveAspectRatio="none"`** so it STRETCHES to fill the tile). Each `FilmFrame` = the SVG tile (a `pointer-events-none` overlay) with the **clip rendered ABOVE it** in the interior window (`overflow-hidden rounded-2xl md:rounded-3xl`); sprocket holes show the white wall through. **Tile aspect widened to `FILM_ASPECT='1.313/1'`** so the interior window is **16:9** → a 16:9 clip fills it with NO side-crop and NO top/bottom bands; **`WIN`** = the clip inset (nudged a hair past the interior to kill the sub-pixel gap); tiles overlap 1px (`marginRight:-1`) to close seams. **Ornamental blank tiles** (`OrnamentalFrame`, NOT in data) bleed off BOTH page edges via negative margins (frames row `overflow-hidden` clips the overhang; leading tile aligns the first real clip to the heading pad). **`FillerFrame` blank tiles** (also not in data) pad the RIGHT of each reel so the strip always overflows the viewport: `FilmReel` measures `window.innerWidth` (resize-gated) and renders `ceil(innerWidth/tileW)+2-tiles.length` fillers, else on wide screens / when zoomed out (which enlarges the CSS-px viewport) the reel ended mid-screen and you could see the cut end of the film (Luke caught this 2026-07-05). Left edge stays capped by the `-488px`-bled left `OrnamentalFrame`. Reels reuse the shared **`HScroll`** (drag + ←/→ arrows + shift-wheel; `snap={false}`, `bleed`, `step={filmStep}` so one arrow press = exactly one tile) and **slide in left→right on first view** (`motion.div`, once). **Sprocket strip = ONE `repeating-linear-gradient`** (`PerfStrip`), NOT measured flex divs - that earlier combo (w-full strip inside a w-max column feeding the measurement) **looped + inflated the strip forever = a real runaway-lag bug; do NOT reintroduce measured bars.** **Featured completed work = a REAL YouTube video** (Reddemoninc, id `nsZn9AeVBTo`, credit chip "by Reddemoninc") shown as a **THUMBNAIL FACADE** (`ytThumb`, no YouTube iframe/JS loads until clicked - this was the section's biggest load + jank cost); clicking sets `started` → mounts the player **WITH SOUND** (`autoplay=1&mute=0&controls=1`). **VINTAGE projector effect** (`const VINTAGE=true` in `AnimationSection.tsx`): a **blurred, `mix-blend:multiply` background projection** of the featured clip (2nd YT iframe `yt-bg`, rendered at 50% res + `scale(2.24)` so the blur runs on ~1/4 the pixels) **synced** to the foreground `yt-fg` via **`lib/useYouTubeProjection.ts`** (YT IFrame API; play/pause/seek mirror), sitting BEHIND **`components/animation/FilmOverlay.tsx`** (animated dust/speckle layers + `multiply` grain `.noir-grain` + a heavy radial-gradient gate vignette). **The whole vintage stack is PERF-GATED:** only exists once `started`, the overlay is mount-gated to in-view + tab-visible (`vintageOn`), and the projection is `display:none` when off-screen. **Selection = `sel-anim`** = noir grey `#9aa0a6`. Cursor over this section = a **clapperboard** (CustomCursor `'02'`); over the clip's iframe the NATIVE cursor shows (cross-origin iframe can't keep our cursor without blocking clicks - Luke chose interactivity). Tuning knobs: `FILM_PX`/`FILM_W` (tile size), `WIN` (clip inset), `FILM_ASPECT` (interior aspect; lower toward 1.107 to un-stretch sprockets but the clip re-crops). Placeholders left: Reel 01's other 3 tiles + all of Reel 02 are gradient tiles awaiting real clips. |
| 03 | Graphics & Design | `design` | **Named "Graphics & Design"** (was "Graphic Design (2D)" → "Design"). DONE (shell): a **horizontal-scrolling DICTIONARY of graphic-design styles** — a condensed reference wall, ~30 style cards, each its OWN unrelated palette/font/motif. **Deliberately INCOHERENT** (Luke: "do not make this section cohesive at all") — opts OUT of the shared tailwind token swatch; colors are raw per-card hex. Doubles as Luke's own style reference. Compact (one viewport, scroll sideways not down). Travel = drag + ←/→ arrows + shift-wheel, **no wheel-hijack**. Files: `data/design.ts` (`STYLE_DICTIONARY`), `components/design/StyleCard.tsx` (parametric + `Motif`), `StyleGallery.tsx`. Add a style = 1 entry + an existing motif. Each card's composition (block order, alignment, specimen size/tilt) is **intentionally randomized** — seeded off the card id (FNV-1a + mulberry32), deterministic, "for-you-feed" scatter; the inconsistency is BY DESIGN, not a bug. Specimen auto-fits to one line; specimen color runs a WCAG-contrast check vs the card bg (falls back off the accent when it'd blend). Distinct `mondrian` (black grid lines + corner cells) vs `bauhaus` (primary circle/square/triangle) motifs. Both galleries share `HScroll` (drag + ←/→ arrows + shift-wheel, no wheel-hijack; `py-6` track padding so hover-lift doesn't clip). **2nd gallery: UI & Graphics work** (`DESIGN_WORK` in `data/design.ts`, `WorkCard`/`WorkGallery`) — currently ~7 INVENTED placeholders (Finseer/Aperture/JAZZ.FM-rebrand/etc.), swap for Luke's real pieces + image thumbs. NOTE: superseded the earlier short-lived "lookbook/SpreadShell" approach (deleted). |
| 04 | Frame & Form | `architecture` (data tag) / HUD lights **design + eng** | **FULLY REBUILT 2026-06-28 (late session): light "blueprint" world → DARK MATTE, Apple-quiet, Swiss-International gallery.** Header still "Frame & Form" in **Syncopate caps** (`font-arch`). **The building-plan / architecture-school content was CUT** (Luke: "never going to draw building plans anymore") - so is the old photo-wall + renders grid + the SWON experience colophon (the **SWON role in `experience.ts` is now ORPHANED** - tagged `discipline:'architecture'` but renders nowhere). Section now showcases **RENDERS + MODELS + PHOTOGRAPHY** (forward-looking). **Architecture (`ArchitectureSection.tsx`):** deep matte bg `#0A0B0D`, off-white type, 8%-white hairlines, a faint **Swiss 12-col column field** (repeating-linear-gradient), `selection:bg-white/20`. Content = **themed editorial blocks** (`ThemeBlock`): each theme = an index + title + a **description AND an analysis line** (Luke missed the editorial/analysis format) on the 12-col grid, then a **scrapbook `Gallery`**. **`Gallery` = the key fix:** justified row of **fixed-height figures** (`h-48 md:h-64`) whose WIDTH follows each image's natural aspect (real imgs `h-full w-auto`; placeholders use `aspect-ratio` off a per-shot `ar` = w/h). **DO NOT go back to the `aspect-ratio`-drives-height-in-flexbox approach** - with the img `absolute inset-0` the figures collapsed to ~0px tall = photos invisible + the 0-height box never tripped the scroll-reveal (this was the "I don't see any photos" bug). Fixed height keeps the box definite + the section SHORT (the earlier full-viewport vertical spreads "took forever to scroll" - rejected). Each figure has a **staggered motion entrance** (fade+rise+scale, `whileInView once`, `delay (i%4)*0.08`). Three themes in `THEMES`: **Renders** (Classhroom timber-pavilion + Portfolio Room iso), **Models & Craft** (SWON furniture models on black + white top-floor section), **Photography** (placeholders, "coming soon"). Add a shot = `{ id, src, caption, tag, ar }`; no `src` = a "coming soon" tile. **Real assets** in `public/renders/*.webp` + `public/photos/*.webp` (WebP q90, RGBA flattened onto the matte bg, long edge capped 2400px; source PNG/JPGs deleted). **REJECTED dead-end:** I ripped Luke's old arch portfolio PDF (216 Robert St / Studio Cardinal / Ingersoll Museum / Carmel Valley / Entwined Eye / Covid Cave / Flytta) into tiles - low-res CMYK rips, Luke killed them all ("look like fucking shit"); the PDF-extraction images are gone. |
| 05 | Music | `music` | DONE (overhauled 2026-06-27): **manuscript-paper aesthetic — pure B&W, no magenta** (`bg-bone`/`text-ink`). Background = **`StaffFlow.tsx`**, an animated canvas of *flowing, non-uniform* 5-line staves that wave + drift (dpr-1, in-view-gated RAF, freezes on reduced-motion) — replaced the earlier rigid CSS `STAFF_PAPER`. Identity broadened "jazz trombonist" → **multi-instrumentalist** (all brass / bass / piano, loose roster — no guessed instrument names). **Coltrane circle = FOREGROUND centerpiece** (`ColtraneCircle.tsx`, Canvas-2D): centered in a two-column hero grid (intro left, circle right), sized `aspect-square max-w-[560px]`, with a center "now playing" chord readout. (Luke had me try an asymmetric off-axis background treatment with a `from-bone` legibility gradient, then **reverted it** back to this centered layout — don't re-introduce the background/gradient version.) Two live behaviours: **(a) cursor physics** — the 12 pitch nodes are spring-mounted to the ring, pushed away from the cursor and spring back (Obsidian graph-view feel, Luke's ask); chord lines flex because they're drawn between the live node positions. Mouse tracked on `window`. **(b) audio-reactive spectrum** — the bar ring reads a shared Web Audio `AnalyserNode`; **flat/absent when idle** (synth fallback removed), reactive when a track plays. Bars use noise-floor + gamma + a tightened analyser dB window (−85/−25) for real loud-vs-soft range, push out toward the canvas edge, and the spectrum is folded into a **random number of peaks (1–12), re-rolled on every chord change** (phase-based fold → any count tiles the ring seamlessly). The **loudest pitch-class also pushes its node outward** (gamma-scaled so distances vary). A faint **base lattice** (full circle-of-fifths diagonals + perimeter dodecagon, drawn between live node positions so it flexes with the cursor) gives the ring weight even with no music; the **12 nodes have NO guide circle**. Audio plumbing = **`src/lib/useMusicAudio.tsx`** (`MusicAudioProvider` + `useMusicAudio`): **module-level singleton `AudioContext` + per-element `WeakMap` cache** so `createMediaElementSource` is never called twice — StrictMode double-mount / Vite HMR safe (the old lazy wiring silently left the element playing to the speakers with a dead analyser); `fftSize` 2048; exposes `analyserRef`, `audioRef`, and **`chordActiveRef`** (the circle publishes whether a real chord is showing, for other section visuals). **Giant Steps is Track 01** in **`MusicRecordings.tsx`**, wired to `/audio/giant-steps.mp3` (**MP3 uploaded, ~4.4MB**; rows 02/03 still placeholders). The **scrubber is always interactive** — dragging before play starts the track and seeks (fraction-based 0–1000; `pendingSeekRef` applies the position once duration loads). Playing Giant Steps makes the circle pulse to the real audio. Performing history = **`MusicTimeline.tsx`** (vertical journey, earliest→Now, note-head markers, NO descriptions — replaced the Dev-style `ExperienceRow` accordion; Music no longer imports `ExperienceRow`). Data: JAZZ.FM91 + **KW Big Band Theory** + **KW Kool Swing Band** (both 2021–2026, Waterloo — minimal honest entries, no verified URL). **Chords are data-driven & tempo-anchored (2026-06-27 session 2):** `src/data/giantSteps.json` is the editable song map — `sections[]`, each with `repeat` + an optional `at[]` of **time anchors** (seconds; one per repetition, **plus an optional extra entry = the section's end time**). `ColtraneCircle` expands sections→a flat timeline, maps `audio.currentTime`→beat by **piecewise-linear interpolation through the anchors** (this is what follows the recording's live tempo drift — a fixed `bpm` can't; `bpm` is just a fallback and is unused once ≥2 anchors exist), then beat→chord (incl. the 4-beat holds via per-chord `beats`). `loop:false` → after the last change the readout shows **`-`** (also when nothing's playing / before the first downbeat); chord-symbol parser turns `Bb7`/`Ebmaj7`/`C#m7` into root+quality. **`NoteFall.tsx`** = audio-reactive music-note "snowfall" drifting **right→left while a chord is sounding** (beat-onset bursts off the low-end, drift speed scales with energy; spawns gated on `chordActiveRef`, off-frame notes spliced). **Perf:** `ColtraneCircle`'s RAF is now **in-view gated** (IntersectionObserver, like StaffFlow/NoteFall) — it no longer animates or reads the analyser while the section is scrolled off-screen. |
| 06 | The Room (finale) | — | DONE (pending visual check): rebuilt 3D room from 2.0 → contact/connect. |

NOTE: EXO Insights (02), SWON (04), and JAZZ.FM91 (05) roles now render in their built sections
(routed by `discipline` tag: `'3d'` → Animation, `'architecture'` → Photo/Arch, `'music'` → Music).

## Identity the site presents (source: ../Resume/luke-zhang-resume LaTeX)
- Mechatronics Eng @ University of Waterloo, GPA 3.98/4.00, grad **Apr 2027**, Dean's list x4.
- **BitGo** SWE intern (current, digital-asset security — ties to his cryptography interest);
  prior **Rakuten Kobo**, **Azoma** (led 6 eng, 1200% MRR), **Viva Wellness**.
- Projects: IceMeister (autonomous LiDAR Zamboni, embedded C++), Alpha Connect 4 (RL+MCTS, ONNX
  in-browser), Spotify Indie, Finanseer (MERN).
- Jazz trombonist + producer. Likes cryptography.
- Contact: lukezhang0826@gmail.com · github.com/LukeZhang0826 · linkedin.com/in/luke-shiyi-zhang · +1 (416) 560-0826.

## Design taste / references
Minh Pham (minhpham.design), universesofjapan.framer.website, Spline, Framer + Framer Motion.
Favorite motifs: tessellations & computational geometry, solid Mondrian-esque color blocks.

## What was wrong with 2.0 (don't repeat)
Scroll-jacking (`wheel` preventDefault), headings as SVG image files (a11y/SEO dead),
`"build": "next build || true"` swallowing errors, default `Create Next App` metadata, no mobile
story, heavy first paint. 3.0 must be fast + responsive + crawlable (Awwwards judges test mobile).

## Music viz reference (confirmed)
John Coltrane "Untitled Original 11383" official visualizer: the **Coltrane circle** — outer ring of
pitch labels in circle-of-fifths order, inner ring of chromatic note bubbles, straight lines drawn
between currently-sounding notes building a dense star-polygon web; grayscale/mono, audio-reactive.
That's Section 04's centerpiece.

## Build status — where to pick up (as of 2026-06-28)
**Code lives in `lukeypookster3.0/`.** `npm run dev` (port 3000), `npm run build` (= `tsc && vite build`).
three.js is code-split into a lazy `react-three-fiber` chunk; it now loads for BOTH the hero
(VaporwaveCanvas) and the room. Verify with a build before claiming done.

**Built & working:** ALL SEVEN now scaffolded - 00 Hero (vaporwave WebGL), 01 Development, **02 Animation
(film-strip reel + 1 real YouTube clip + vintage projector; rest of the tiles are gradient placeholders)**,
03 Design, **04 Frame & Form (dark-matte renders/models/photography gallery; 4 real assets in, rest "coming soon")**,
05 Music, 06 Room. App order =
Hero → Dev → Animation → Design → Photo/Arch → Music → Room. 04 has Luke's first real renders + SWON models; 02 needs more
real clips dropped into the strip (see Open items). Below-fold sections are lazy (`LazySection`).
**Refresh starts at the TOP:** `useLenis` sets `history.scrollRestoration = 'manual'` + scrolls to 0 on mount,
because restoring a scroll Y while the lazy sections are still short placeholders dumped you into the wrong
section (e.g. "Frame & Form") and then jerked the page around as sections mounted + grew.

**Session 2026-06-28 (late: Section 04 rebuild + touch/mobile fixes) — see table row 04 for the full Frame & Form story. Other changes:**
- **Hero name bigger on mobile:** `NAME_SIZE` in `VaporwaveHero.tsx` is now `text-[32vw] md:text-[18vw]` (was `20vw` base) - Luke wanted "Luke Zhang" a lot bigger on small screens.
- **Touch cursor freeze fixed** (see Custom cursor bullet below): gate is now `(hover: hover) and (pointer: fine)` + first-`touchstart` teardown.
- **Music intro copy:** "A multi-instrumentalist who is obsessed with **theory**." (was "reads music as geometry"; Luke's call - keep the underline-emphasis span on the keyword).
- **"Coming soon" on every placeholder** (Luke's ask): Animation empty reel tiles render a gradient cell + "Coming soon" (`!t.gif && !t.yt && !t.clip` in `FilmFrame`); Design `WorkCard` badge `Placeholder` → `Coming soon`; loops intro reworded.
- **WIP flag on the hero:** SUPERSEDED 2026-07-05 - the hero WIP line was removed with the rest of the hero copy and now lives in the LoadingScreen (masked "● WORK IN PROGRESS" text under the Start pill, inside the lift group so it shares the gradient + rise). Original hero placement kept here for history: a small mono line after the intro, `custom={5}` fade. A top-center shell badge was tried first and Luke couldn't see it.
- **Design card-flip mirroring fixed (Safari/iOS):** `StyleCard.tsx` `FACE` + the flip wrapper now carry **`[-webkit-backface-visibility:hidden]`** and **`[-webkit-transform-style:preserve-3d]`** alongside the unprefixed props. **DO NOT drop the `-webkit-` ones** - autoprefixer's default browserslist skips them, so without them Safari/iOS < 15.4 ignore `backface-visibility` and the flipped front face bleeds through the back MIRRORED (this was Luke's "reverse side reflected on the description side" bug).
- **DEPLOY — GitHub Pages user site:** the repo root `C:\Developer\Portfolio` is now a git repo pushed to **`github.com/LukeZhang0826/LukeZhang0826.github.io`** (`origin/main`) holding all three versions (`lukeypookster3.0` v3, `lukeypookster2.0` v2 - its own nested `.git` preserved, `Archive` v1). **v3 builds to repo-root `/docs`** (`vite.config.ts`: `base: './'` relative assets + `build.outDir: '../docs'` + `emptyOutDir`; `docs/.nojekyll` present) and **Pages serves from main `/docs`**. `.gitignore` excludes node_modules, build caches, `failed version/`, and `Archive/Portfolio Unused Assets/` + the zip (100-300MB raw files that exceed GitHub's limit). **Redeploy = `cd lukeypookster3.0 && npm run build` (writes ../docs) then commit + push.** The old hand-uploaded site (incl. its `CNAME` custom domain) was force-overwritten on Luke's say-so; live 2.0 stays on Vercel.
- **DNS — lukeypookster.com is on Route 53 (fixed 2026-07-28):** Luke moved the registrar GoDaddy → AWS Route 53. A registrar transfer does NOT move DNS: the delegation stayed pointed at `ns65/ns66.domaincontrol.com` while GoDaddy tore down the zone, so every resolver got **SERVFAIL** (a lame delegation, which reads as "not found" in a browser) and the site was dark. Route 53 only auto-creates a hosted zone for domains it registers fresh, so a transferred-in domain arrives with **no zone at all**. Fix was: create the hosted zone, add the GitHub Pages records, then repoint the registrar's nameservers at it. **Current records** (hosted zone `Z09596153Q7JXGKCA6RKV`, TTL 300): apex `A` → `185.199.108-111.153`, apex `AAAA` → `2606:50c0:800{0,1,2,3}::153`, `www` `CNAME` → `lukezhang0826.github.io`. **Do not delete `public/CNAME`** - GitHub Pages needs the `cname` set (`lukeypookster.com`) for its cert, which covers apex + www and is separate from DNS. If the site 404s again, check delegation FIRST (`nslookup -type=NS lukeypookster.com a.gtld-servers.net`) before touching the build: SERVFAIL means DNS, a GitHub 404 page means Pages.

**Session 2026-06-28 (long Hero + polish pass) — key changes beyond the Hero overhaul (table row 00):**
- **Custom cursor** (`components/cursor/CustomCursor.tsx`, mounted in `App.tsx`): replaces the native
  arrow on **real mouse devices only** - gate is **`(hover: hover) and (pointer: fine)`** (NOT bare
  `pointer: fine`, which let touch/hybrids through where no `pointermove` fires and the dot froze
  mid-screen) **and it tears itself down on the first `touchstart`** (`html.has-custom-cursor *{cursor:none}`
  in index.css; touch keeps native). Snappy dot + trailing mark whose **shape/color change per section** (00 cyan diamond, 01 acid
  square, 02 klein ring, 03 design red **cross** — Luke likes it THIN, don't thicken it, 04 grey ring,
  05 music ink ring, 06 room **white diamond + `mix-blend-difference`** so it inverts like the Play
  button). Blend MUST be on the OUTER fixed container (the inner marks have `will-change:transform` which
  isolates the blend). Grows over interactive els.
- **HUD** (`components/hud/HUD.tsx`): `grid-cols-3` with explicit `col-start` so a hidden middle column
  doesn't shove the right block to center on small screens; **"Luke Zhang" underlines on sections 00 & 06**;
  **ENG/DESIGN/MUSIC** highlights the active discipline (`SECTION_DISCIPLINE` maps each section to an array
  of disciplines so a section can light more than one). **Reflects the VISITOR's local info (2026-06-28 s3):**
  `useClock()` defaults to the browser's IANA timezone (live time + zone abbrev); `lib/useGeo.ts` derives the
  city from that timezone then geocodes it via **Open-Meteo's free geocoding API → coords → weather** (no key,
  **no permission, no IP lookup** - regional, not pinpoint; `useWeather.ts` was replaced by `useGeo`). HUD entrance
  = `hud-in` CSS keyframe (OPACITY ONLY) on the corners. **Infinite animations on HUD children isolate them from
  the header's `mix-blend-difference`** (an infinite animation permanently promotes the element to its own layer,
  dropping it out of the blend so it stops inverting; finite fades are fine - they release the layer when done).
  **The scroll-arrow `animate-blink` was RESTORED (2026-06-28, Luke's call):** the blink wins over the invert, so it
  carries an explicit `text-bone` color and is accepted to NOT invert (it's isolated by the blink anyway). This
  exception is deliberate - the rule still holds for every other HUD child.
- **01 Development:** subtle **Matrix rain** backdrop (`components/dev/MatrixRain.tsx`, rendered at
  0.7× internal res for perf, preserves its frame on resize so expanding an accordion row no longer
  flashes/restarts it). **Project cards are transparent** until hover (so the rain shows through).
- **03 Design:** style cards **FLIP on click** to a description back (`STYLE_NOTE` map in `data/design.ts`);
  many new distinctive motifs (`opart/columns/hairline/glitch/memphis/boxlogo/overprint/bloom/terminal/
  maximal/blocks`); **session 3 (2026-06-28)** added dedicated per-style motifs that replaced bland generic
  ones Luke flagged: `vaporwave` (outrun sun+grid), `y2k` (Frutiger Aero glossy bubbles), `acidhouse`
  (checkerboard + acid smiley), `webbrut` (raw-HTML dashed border + blue link underlines), `cyberpunk`
  (neon grid + HUD corners + glow scan), `popart` (Ben-Day dots + comic sunburst), `eightbit` (pixel grid
  + box-shadow space-invader sprite), `grunge` (ink splatters + scratches + torn strip), `xerox` (photocopy
  streaks + ransom blocks). Background logic now applies the gradient whenever a card has `bg2` (not only
  the `gradient` motif), so vaporwave/y2k keep their gradients under their new motifs. per-card font/tag-style/placement variation; Mondrian special-cased into a real De
  Stijl composition with a white text cell. **UI & Graphics split into two galleries** (`WorkGallery`
  takes a `kind` prop). `HScroll` no longer pointer-captures (so card-flip clicks work; post-drag clicks
  are swallowed) and has `scroll-pl` so snapped cards keep a left inset. Swiss `DesignBackdrop` busier.
- **05 Music:** staff lines slightly darker (0.1 alpha); intro tightened (`items-start`, `py-10`).
- **06 Room:** **fire ramps alive on first visit** (`uReveal` uniform in `lib/portalShader.ts`, ramped
  in `RoomCanvas` `Scene` when the section first scrolls in via `fireOn`); the **Play button only appears
  AFTER the fire is alive** (`onFireReady` → `fireAlive`), is **filled/inverted** (bone fill, dark ►) with
  a **one-shot** shine ring + glint on appear (`play-pulse`/`play-shine`, `forwards`/`both` fill so they
  don't snap back); **clicking the monitor = Leave**; orbit clamped to ~an octant + `maxDistance 4` + slow
  pull-back + hold-after-load; **Connect / The Room** are tuckable `SlideCard`s. Restored v2's
  `StructureAndDeco.jpg` texture. **Session 3 (2026-06-28):** the fire now **grows UP from the bottom**
  of the monitor instead of fading the whole screen (mask in `PORTAL_FRAG`: a soft flickering front
  rises as `uReveal` 0→1); the screen's **unlit state = the bg color** (`uBackground` `#061519` = canvas
  + section bg) so the monitor no longer **flashes black** before the fire (no color flip on load); the
  baked textures (`BAKES` map in `RoomCanvas.tsx`) **preload when the lazy chunk loads** (room ~2200px away)
  AND are now **WebP q90** (`~23MB → ~2.3MB`), which together largely fix the first-Play hitch. The room bg,
  canvas clear, and monitor unlit base are all **pure black**: the portal `ShaderMaterial` doesn't sRGB-encode
  its output, so any non-black bg renders darker than the CSS bg (caused a load color-flip); black is the only
  pipeline-invariant match. Canvas uses `NoToneMapping` (baked/unlit room). A loading-screen GPU warm-up is
  still the belt-and-suspenders fix (see Open items).

**Typography — per-section display fonts (deliberate clash, Luke's request):** each section owns
its own heading face via tailwind `fontFamily` tokens. 00 Hero name = `graffiti` (**Fusterd** brush,
**self-hosted** `public/fonts/Fusterd-Brush.woff2`; token is `['Fusterd','cursive']` - the Sacramento
webfont was dropped as an unused fallback) + `grotesk` (Space Grotesk) for hero body copy · 01 Dev =
`dev` (**Anton**) · 03 Design = multi-font per card · 05 Music = `music` (**Playfair Display**, italic
intro) · 06 Room = `mono` (Space Mono) · 02 Animation = `anim` (**Shippori Mincho**, elegant Japanese-editorial
mincho + kanji accents) · 04 Frame & Form = `arch` (**Syncopate**). Shippori Mincho + Syncopate
are loaded in `index.html`; `cyber` (**Orbitron**) stays registered but unused. Apply a
section font to that section's OWN display headings only — NOT shared components (e.g. `ExperienceRow`
is used by both Dev and Music, so it stays `grotesk`).

**Shared infra (the "order in code"):**
- `src/lib/section.tsx` — IntersectionObserver scroll-spy → HUD index. Each section calls `useSectionSpy(idx,label)`.
- `src/lib/useLenis.ts` — Lenis engine + `lockScroll/unlockScroll/scrollToTop/scrollToBottom/scrollToEl`.
- `src/lib/useScrollProgress.ts`, `useClock.ts`. HUD = live clock + position-aware scroll arrow (↓/↕/↑).
- Data: `src/data/experience.ts` (roles tagged `discipline`; non-dev roles EXO/SWON/JAZZ live here, routed
  to their sections), `src/data/projects.ts` (4 projects w/ case-study fields). Tofu-style cards →
  click opens `ProjectCaseStudy` drawer. Experience rows are click-to-expand accordions.

**Performance & motion (shared - "fast site" is a launch goal; 2026-06-28 session 3):**
- **Lazy sections:** `App.tsx` lazy-imports Dev/Design/Music, each wrapped in `components/util/LazySection.tsx`
  (mounts on approach via IntersectionObserver rootMargin 1200px + a min-h placeholder, so height settles
  off-screen, no jump). Hero + Room stay eager (Room already lazy-loads its own canvas with preload timing).
  Cut the main initial chunk from ~122KB → ~12KB gzip.
- **Vendor chunks:** `vite.config.ts` `manualChunks` splits `react` / `motion` (framer) / `three` (three+r3f+drei)
  into stable chunks for repeat-visit caching; three only loads with the lazy WebGL sections.
- **Render-loop gating:** every canvas (hero `VaporwaveCanvas`, `RoomCanvas`, music ×3, dev `MatrixRain`) is
  IntersectionObserver in-view gated; the two R3F canvases ALSO pause on tab-blur via `lib/usePageVisible.ts`
  (frameloop→never). rAF loops (repel, cursor, NeonDraw) sleep when idle. DPR capped at 1.5; sky/floor `fbm` = 3 octaves.
- **Entrance animations:** `components/util/Reveal.tsx` = framer `whileInView` fade+rise (`once`), on every
  section's headings/labels/intros + a Dev project-card stagger. Hero name "powers on" (blur+opacity, NO layout
  shift so the cursor-repel home stays accurate); hero status/role/intro/CTA use the `fade` variants. HUD corners
  fade in via the `hud-in` CSS keyframe - **OPACITY ONLY** (a transform would isolate its `mix-blend-difference`,
  same gotcha as the custom cursor).
- **Assets:** room baked textures are WebP q90 (`~23MB → ~2.3MB`); display fonts woff2; audio `preload="metadata"`.

**Section 06 room — NEEDS A VISUAL CHECK NEXT SESSION.** Luke repeatedly couldn't see the portal-fire
monitor. Fixes applied: portal material `side: DoubleSide`; render monitor-only in idle, load textured
props on Play; camera coords reset to on-axis (`TARGET/MONITOR/OVERVIEW` in `RoomCanvas.tsx`). Flow:
idle = fire monitor + Play button → Play snaps section in, locks scroll, streams room, zooms out →
bottom-centre Leave zooms back & unlocks. **If still not visible, the monitor mesh may be occluded or the
`MonitorScreen` node name/coords still off — get Luke to describe what he sees on Play.**

## Open items / debts
- **Sections still needing Luke's real assets (placeholders render now; swap the data):** 02 Animation - the
  film strip has ONE real clip (Reddemoninc YouTube); add Luke's own clips to `WORKS`/`LOOPS` in
  `AnimationSection.tsx` (a tile takes `yt` (YouTube id, gets the thumbnail facade), `gif`, or a `clip` mp4;
  no media = a gradient placeholder tile). 04 Frame & Form (more renders + real photography; drop WebPs in
  `public/renders` or `public/photos` and add a `{ id, src, caption, tag, ar }` shot to a `THEME`),
  03 Design (real UI/graphics + Figma exports for `DESIGN_WORK`).
- **Animation perf is well-gated but two YT iframes load on Play** (foreground + the blurred projection). If it
  ever needs more: pause the foreground too when the section scrolls off mid-playback (interrupts watching, so
  left undone), or KTX2 the room textures. The site is otherwise already perf-clean (every canvas/rAF loop is
  IO/visibility-gated; cursor scroll hit-test is rAF-throttled).
- **HERO 01 REBUILT AS A VAPORWAVE POSTER + LOADER DISABLED (2026-07-05, ~8 screenshot-review rounds
  with Luke):** hero copy stripped to name + Enter + marquee (status/role/intro/WIP DELETED + `TEXT_HALO`;
  `HERO_STATUS`/`HERO_ROLE` stay exported in `heroStyles.ts`); WIP flag moved into the LoadingScreen mask
  (under the Start pill). Loader **DISABLED for now**: `SHOW_LOADER=false` in `App.tsx` (revealed/gone init
  true + module-level `enterHero()` so the hero canvas never parks) - flip the flag to restore.
  **FINAL POSTER (`VaporwaveHero.tsx`), layers bottom->top:** WebGL world (**retro Sun + SunReflection
  DELETED** from `VaporwaveCanvas.tsx`; `SUN_VERT` kept - the sky clips with it) → `SHEET_WASH` gradient →
  hairline frame + ✦ corners + print crop marks → furniture (2 `Mesh` grid + 2 `Dots` halftone patches
  hugging the bust; **screen-CENTERED viewfinder corner brackets** - Luke wants them true-centered, NOT
  bust-anchored; micro labels `SEC.00 ✦ V3.0` + Toronto coords; barcode chip `LZ·0826` bottom-left) →
  **6 flat-LINEAR-gradient `Orb` discs** (`ORB_GRADS` array: every disc its OWN angle/stop mix, big one
  wears a Saturn ring) packed TIGHT around the bust → bust at TRUE screen center (a 53% offset experiment
  made Enter/brackets read off-center - reverted): `vaporwave-statue.webp` 562x854 real-alpha (Luke's first
  png had a BAKED-IN checkerboard; his re-drop renamed `SwonWoodModels.webp` over it - both fixed),
  gradient-MAPPED body (multiply `TINT_WASH` masked to its alpha via `mask-image` - ghost fringe alone left
  it "boring grey"), pink/cyan ghosts, brightness 1.08, `8bit-glasses.png` spring-drop on the eye line
  (`GLASSES` knobs), 2 thin glitch scan slices kept TIGHT to the bust, and a triangle constellation: 3
  outline triangles in an SVG (repel as ONE unit) + **5 translucent gradient `Shard`s (Luke's favorite
  element) as clip-path DIVS, each with its own repel** - shards were MOVED OUT of the SVG because the
  repel loop writes `style.transform`, which overrides an SVG polygon's `rotate` attribute; every shape
  keeps its own rotation (uniform upright triangles read machine-made) → type: **name runs DOWN the
  left edge** (`[writing-mode:vertical-rl]`, letters stay UPRIGHT stacked - a `text-orientation:sideways`
  pass was tried and REVERTED, Luke: "I don't want to tilt my head"; grotesk caps, `CHROMA` chromatic
  split shadow, letters repel; **Fusterd BENCHED at
  Luke's ask** - font + `graffiti` token kept for a future style), **ONE tategaki Japanese block on the
  RIGHT BORDER** mirroring the name (columns right→left: 蒸気波 6xl → ポートフォリオ ✦ 2026 upright digits;
  sits at right-[2.5%] top-[10%], ABOVE the StyleControl pill - watch that collision if resizing it;
  ヴェイパーウェイヴ CUT as redundant; scattered/horizontal JP "felt random" - keep consolidated), filled
  OPAQUE **#01** numeral bottom-right (was a hollow outline, then /35 faded - Luke wants it solid; the #
  ties it to the hero style index) → Enter CTA. **REPEL IS EVERYWHERE (Luke's ask):** name, kanji +
  katakana columns, #01 (RepelText); orbs, glasses, glitch slices, shards, outline-SVG, micro labels,
  barcode (RepelNode). GOTCHA: RepelNode's transformed span is a stacking context, so any `mix-blend`
  must sit on the OUTER positioned span (the glitch slices do this) or it stops compositing against the
  statue - same class of bug as the cursor/HUD blend notes.
  bottom-CENTER (flex centering, NOT translate, so fade's y can't clobber it). Tuning knobs = consts at the
  top of `VaporwaveHero.tsx`. **REMOVED after Luke's review (do NOT re-add):** top-center horizontal
  katakana line, dashed circles, `Waves` sine hairlines, `Ticks` hatch stacks, `SCATTER` glyph confetti,
  `Reticle`, radial/glossy orb gradients (flat linear only), MADE-IN-WATERLOO label.
  **PERF:** all idle floats (6 orbs + bust) run on the CSS **`poster-float`** keyframe (index.css;
  compositor-driven, reduced-motion aware). They were 7 infinite framer loops of per-frame JS and visibly
  janked window resizes - **keep infinite floats OUT of framer.** Remaining resize cost = WebGL framebuffer
  realloc + vw/svh type re-raster; next lever if needed = canvas DPR cap 1.5 → 1.25.
  **WORKFLOW UNLOCK - Claude can SEE the hero:** with Luke's dev server on :3000, screenshot via headless
  Chrome: `& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --screenshot=<png>
  --window-size=1920,1080 --hide-scrollbars --virtual-time-budget=10000 http://localhost:3000` then Read
  the PNG. Iterate visually this way instead of designing blind (use Start-Process; bare `&` invocation
  wrote no file).
  **Mobile note:** all the tight clustering is `md:`; base classes keep the older looser mobile positions
  (Luke says mobile "looks fine" - everything clusters naturally there). Not yet re-reviewed on a phone
  since the tategaki/name changes.
- **DONE (2026-07-04) — Loading screen** (`components/loading/LoadingScreen.tsx`, mounted in `App.tsx`):
  minhpham.design-style pre-reveal curtain on a dark `bg-ink`. **ARCHITECTURE = "the WHOLE SCREEN is ONE
  repeating gradient; every component is a MASK into it"** (Luke's plan, sets up the future ascii-cursor
  effect). A **full-viewport SVG** (drawn in screen pixels off a `size` state + resize listener; `cx=w/2`,
  `cyB=h/2+BELOW`) holds a single **repeating purple->blue->teal `<linearGradient id=lp-bg>`** (`#A855F7 ->
  #4C9AFF -> #2DE8D5 -> #A855F7`, `gradientUnits=userSpaceOnUse`, `spreadMethod=repeat`, `TILE=460`px
  diagonal period - big enough not to look repetitive yet still sweeps purple->teal across each mark; too
  small = repetitive, too big = mono) filling
  a `<rect width=w height=h>` that is revealed ONLY through a luminance `<mask id=lp-mask>`. The ring track,
  progress arc, `NN%` `<text>`, the dino logo AND the Start pill (border `<rect>` + `<text>`) are all WHITE
  fills in that one mask - so the dino and the button are the SAME gradient because they're the same rect
  (this fixed Luke's "button doesn't match / looks like shit"). **The planned ascii cursor effect is just
  another white shape added to THIS mask - keep the architecture.** Dino = **v2 logo** (path VERBATIM from
  `lukeypookster2.0/public/img/logo.svg`; do not redraw. In the mask BOTH paths incl. the eye are `#fff` =
  light dots; the eye is a light dot in the dark head cutout - white in the mask, NOT black) sitting STILL
  (bob rejected). Ring is a **thin hairline** (`r=150` px, `strokeWidth 1.25`) - keep it fine. **`phase`
  machine loading->erasing->ready:** loading draws the arc clockwise from 12 o'clock; erasing (at 100)
  UN-DRAWS along its own path (`startFrac=erase 0->1`, `endFrac=1`, `dashoffset=-startFrac*CIRC`, 600ms
  easeOutCubic) while the track fades so the WHOLE ring vanishes; arc NOT rendered at `ready` (a
  zero-length round cap leaves a dot). **`NN%` counter sits HIGH in the ring** near the top edge
  (`y=cyB-110`, above the dino - minhpham layout), fades at ready. Eye blinks (`animate-dino-blink`).
  **FONT = geometric grotesk matching minhpham's ITC Avant Garde Gothic** (his `app.css` @font-face is
  "Avant Garde" - a LICENSED font we don't lift; `FONT` = `'Century Gothic','Questrial','Futura',system-ui`
  = the system equivalents + Questrial the free Google backstop, added to index.html). **CHOREOGRAPHY (Luke:
  icon+button must move the SAME amount at the SAME speed):** the dino and the Start pill live in ONE `<g
  transform=translate(0 -LIFT*lift)>` driven by ONE `lift` 0->1 timeline (650ms), so they RISE together and
  cannot desync (the earlier split transforms looked clunky); the button subgroup also fades via `opacity=lift`.
  Whole centerpiece starts a touch below centre (`BELOW=12`). Proportions tuned to conventions (Luke flagged
  them as weird): `DINO_W=66`, pill `BTN_W=208 x BTN_H=46` (wide:short), `BTN_GAP=112` (clear breathing room),
  `LIFT=68`. Start pill = the masked border+label (shares the gradient+font automatically), label **bold**
  (`fontWeight 700`).
  **Hover FILLS the pill:** a white fill `<rect opacity={hoverT}>` (reveals the gradient) plus a black
  duplicate label `<text opacity={hoverT}>` that punches the letters into holes, so on hover the text reads
  INK on the bright gradient fill; `hoverT` is an eased 0..1 driven by a small rAF (NOT a CSS transition -
  some browsers won't recomposite an animated `<mask>` child), toggled by the hit-area button's
  mouseenter/leave. A **transparent HTML `<button>`** is overlaid at the pill's screen coords as the click
  hit-area (the visible pill is the SVG mask). Click-to-enter gate (Luke's pick); click lifts the curtain
  (pure CSS translateY on the loader container, `will-change:transform`, 900ms - framer deliberately NOT
  imported) AND bumps `introNonce` (prop on `HeroSection`, folded into the style key) so **the hero intro
  replays for the visitor instead of burning behind the loader**. Counter tied to REAL signals
  (document.fonts.ready + window load + the VaporwaveCanvas chunk via the same import() specifier so Vite
  dedupes), slow crawl, 1.4s minimum, signals own 90-100. Eye blink cadence `animate-dino-blink 2.6s`.
  **Cursor:** `App` mounts `CustomCursor` on `revealed` (the moment Start is pressed) - NOT `gone` - so the
  hero cursor takes over IMMEDIATELY and rides along as the curtain lifts; before that the loader shows the
  native OS cursor. Scroll frozen while the curtain is down: `lockScroll()` + html overflow hidden; `useLenis`
  has a module-level `wantLocked` flag honored at Lenis creation (child effects run before App's, so the lock
  lands before the instance exists). The curtain is also the GPU warm-up window: the hero canvas mounts +
  renders behind it - BUT only briefly: `VaporwaveCanvas` now reads `lib/heroGate.ts` (`useHeroEntered`) and
  runs its frameloop for a ~700ms warm-up, then PARKS (`frameloop='never'`) until `entered` flips true (App
  calls `enterHero()` on Start), so the shaders compile behind the curtain without burning GPU the whole idle
  time; on Start it resumes just as the curtain lifts (any resume jump is masked by the still-down curtain).
  Room textures still warm up on their own preload path (loader does NOT warm the room - 2200px away, stays
  lazy). z-order: loader z-[100], above HUD z-50 + grain z-60.
  **DONE - ascii fire/ooze field** (`AsciiPulse` in the same file, behind the centerpiece): went cursor-pulse
  -> diagonal wave -> **fbm value-noise "fire/ooze" field** (Luke's pick; the noise family the room monitor's
  portal shader uses). A seeded value-noise + **2-octave** `fbm`, domain-warped (1-octave `vnoise` warp) so it
  licks like flames rather than round blobs, slowly RISING (`+rise`). The noise value drives BOTH the glyph
  (denser char = higher intensity) AND alpha (`0.05 + b*0.34`), giving real intensity variation; threshold
  `v<0.4` skips cells to leave organic gaps; each lit glyph painted with the SAME repeating purple->teal
  gradient (so it "masks" the gradient too).
  **Perf-tuned (multiple passes):** (1) per-cell gradient colour + sample coords are STATIC (position-only),
  precomputed ONCE into typed arrays (`cellX/cellY/sx/sy/cellColor`) so the hot loop does ZERO
  string-building/gradient math per frame; (2) the canvas is `AsciiPulse` wrapped in `memo` so the loader's
  counter re-renders don't re-run it; (3) its `<canvas>` DPR is forced to **1** (soft bg texture; clear+
  glyph raster scales dpr^2); (4) fbm dropped 3->2 octaves + canvas throttled to **~20fps** (the field drifts
  slowly, still reads smooth) - Luke's chosen "buy headroom" combo. One canvas; unmounts with the loader => zero cost after reveal;
  reduced-motion => blank. **The masked `<rect>` is BOUNDED to a ~360x360 box around the centerpiece** (was
  full-viewport `w x h`): every counter tick re-rasterizes the SVG mask, and doing that full-screen was the
  real loader cost - the gradient is `userSpaceOnUse` (screen-anchored) so colours are identical, only the
  raster area shrank (~10x). The **load counter is throttled to ~30fps** too (each setPct re-renders the
  SVG+mask). Known-minor, left as-is: the hero's marquee CSS anim + repel/CTA pointermove loops still tick
  behind the curtain (marquee = one composited layer; repel/CTA only on mouse-move) - gate on `entered` if
  it ever matters.
  **Tab identity:** `index.html` `<title>` = **"LukeyPookster"**; favicon = `public/favicon.svg` = the **v2
  dino logo as ONE solid adaptive mark** (GitHub-style: transparent bg, `<style>` with
  `@media (prefers-color-scheme: dark)` flips the fill `#0A0A0A` <-> `#ECEAE3` so it's dark on light tabs,
  light on dark tabs; head = negative-space silhouette, eye = solid dot). NOT the old black square (Luke
  hated it).
- **DONE (2026-06-28 s3) — room textures converted to WebP:** the baked maps are now WebP q90 (same
  resolution), `~23MB → ~2.3MB` (`BAKES` map in `RoomCanvas.tsx`, `.webp`; JPGs deleted). Big load +
  GPU-upload win; greatly reduces the Play hitch. Converted with Pillow (`python ... Image.save(...,'WEBP',quality=90)`).
  If the first Play still hitches at all, the only step beyond this is KTX2/Basis (GPU-compressed upload)
  or the loading-screen warm-up.
- **Hero — open polish:** the vaporwave name has **no load-in animation** yet (the spray-paint pass was
  removed for breaking); revisit once happy with the look. ~4 more genre `HERO_STYLES` to design (incl.
  the **heavy-typography style that inherits the saved scramble/`.hero-name` glitch**).
- **Unverified data:** company URLs for Clairify / EXO Insights / SWON left unlinked (don't guess);
  Clairify described as "education-technology venture" (inferred — confirm).
- **Model routing:** hero/feel locked on Opus; mass-producing remaining sections can drop to Sonnet.
