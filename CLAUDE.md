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
| 00 | Index / Hero | — | **NOW A MULTI-STYLE RANDOMIZABLE HERO (2026-06-28 session 3).** The landing itself showcases the "maximum clash" thesis: it renders ONE of several clashing, art-directed "worlds" (one per design genre) and the user randomizes between them. **Architecture (the order in the chaos):** `components/sections/HeroSection.tsx` = thin shell — picks a **random style on each page load**, renders the active style component, remounts it on shuffle (nonce key) to replay its intro. `components/hero/heroStyles.ts` = the **registry** (`HERO_STYLES`) + **shared content** (`HERO_NAME`/`HERO_STATUS`/`HERO_ROLE`/`HERO_DISCIPLINES`) + per-style `control` theme; add a genre = one entry. `components/hero/StyleControl.tsx` = the bottom **`STYLE 01 ✦ VAPORWAVE ↻ Shuffle`** widget (just the pill; each style positions it; themed via data so it always matches the world). `components/hero/repel.tsx` = **shared cursor-repel system** (`RepelProvider`/`RepelText`/`RepelNode`): letters scatter away from the cursor (Obsidian graph / Coltrane feel) via **ONE pointermove listener + ONE rAF loop writing direct DOM transforms** (sleeps when idle; scales to all hero copy cheaply — do NOT go back to per-letter framer springs). **Only `vaporwave` exists so far** (plan ~5). The **scramble decode-in + `.hero-name` RGB-glitch are RESERVED for a future heavy-typography style** (`useScramble.ts` + `.hero-name` CSS kept on purpose, currently unused). **Style 01 = VaporwaveHero** (`components/hero/styles/VaporwaveHero.tsx` + the R3F `VaporwaveCanvas.tsx`): pink perspective **grid floor** + a **faded floor reflection** of the sky (nebula+stars, `starRoundFloor` uses `fwidth` so dots stay round at the grazing angle), **retro sun sunk behind the horizon** (center y≈15, clipped at worldY<0), **dark-purple sky** with starfield + drifting **nebula** + glowing horizon line, **halftone+grain** overlays. Name = **"Luke Zhang"** title-case in the **Fusterd brush graffiti font** (self-hosted `public/fonts/Fusterd-Brush.woff2`, `graffiti` tailwind token, Sacramento fallback) with **neon glow** (`.neon-pink` LUKE / `.neon-cyan` ZHANG). ALL copy repels the cursor (name, status incl. its glowing dot via `RepelNode`, role, intro). Layout = **canvas area (`flex-1`) + marquee strip STACKED to fill the viewport** (canvas ends above the marquee, no overlap); marquee pinned bottom. Text selection disabled on the hero. Palette: dark purple bg `#160A2B`, pink `#FF6AD5`/`#FF49C7`, cyan `#2DE2E6`, off-white `#FDEFF9`; selection `sel-vapor`. **Perf:** `VaporwaveCanvas` `frameloop` is IntersectionObserver-gated (pauses all shaders when scrolled off-screen); `fbm` is 3 octaves; font is woff2. **REMOVED / do not resurrect:** the icosphere blob, the spray-paint load animation (broke — name has no load-in yet, TODO), the block pointer-parallax (fought the repel + caused lag), the wireframe mountains, the name overlap experiment. Earlier dead-ends already deleted: `three/GeometryField.tsx`, `sections/AsciiField.tsx`, `sections/VaporwaveScene.tsx`, `sections/FloatingTags.tsx`. (bone/ink/**acid** hero was tried and rejected.) |
| 01 | Development | `dev` | BitGo ×2 / Kobo / Azoma / Viva / Clairify + projects (IceMeister, Alpha Connect 4, Spotify Indie, Finanseer). DONE: accordion experience + Tofu-style cards + case-study drawer. |
| 02 | Animation | `3d` (data tag) / HUD lights **music + design** | **REBUILT BELOW THE HERO into a FILM-STRIP REEL + VINTAGE PROJECTOR (2026-06-28 long session).** **Hero UNCHANGED:** full-bleed looping GIF `public/animation/us-mediadesign-emeszack-portfolio-01.gif` (by **EmesZack**, credit overlay present → instagram.com/emeszack2000) via `components/animation/AnimationHero.tsx` (`<img>` object-cover, cursor-parallax), `aspect-video`, label **"Poetry in motion"** in `font-anim` **Shippori Mincho** + vertical kanji **動**. (dedouze (David Mata) remains the *style* north-star for the GIF; the old Escher cube / `GreasePencilScene`/`CityScene`/Spline/`.glb` dead-ends stay DELETED - NPR/grease-pencil doesn't survive glTF export.) **Everything below the hero was replaced** - the old dedouze doodle GRIDS, `LoopTile`, `TiltCard`, `DoodleField.tsx`, blue `LOOPS_BG` ground are **DELETED**. Now a **white "projected-film" ground** holds **TWO horizontal FILM-STRIP reels**: "Completed animated works" (Reel 01) + "Selected loops" (Reel 02). **The strip is a tiled SVG** `public/filmstrip.svg` (a CorelDRAW film cell: rounded interior window + sprocket-hole rows, all TRANSPARENT cut-outs; edited to **`preserveAspectRatio="none"`** so it STRETCHES to fill the tile). Each `FilmFrame` = the SVG tile (a `pointer-events-none` overlay) with the **clip rendered ABOVE it** in the interior window (`overflow-hidden rounded-2xl md:rounded-3xl`); sprocket holes show the white wall through. **Tile aspect widened to `FILM_ASPECT='1.313/1'`** so the interior window is **16:9** → a 16:9 clip fills it with NO side-crop and NO top/bottom bands; **`WIN`** = the clip inset (nudged a hair past the interior to kill the sub-pixel gap); tiles overlap 1px (`marginRight:-1`) to close seams. **Ornamental blank tiles** (`OrnamentalFrame`, NOT in data) bleed off BOTH page edges via negative margins (frames row `overflow-hidden` clips the overhang; leading tile aligns the first real clip to the heading pad). Reels reuse the shared **`HScroll`** (drag + ←/→ arrows + shift-wheel; `snap={false}`, `bleed`, `step={filmStep}` so one arrow press = exactly one tile) and **slide in left→right on first view** (`motion.div`, once). **Sprocket strip = ONE `repeating-linear-gradient`** (`PerfStrip`), NOT measured flex divs - that earlier combo (w-full strip inside a w-max column feeding the measurement) **looped + inflated the strip forever = a real runaway-lag bug; do NOT reintroduce measured bars.** **Featured completed work = a REAL YouTube video** (Reddemoninc, id `nsZn9AeVBTo`, credit chip "by Reddemoninc") shown as a **THUMBNAIL FACADE** (`ytThumb`, no YouTube iframe/JS loads until clicked - this was the section's biggest load + jank cost); clicking sets `started` → mounts the player **WITH SOUND** (`autoplay=1&mute=0&controls=1`). **VINTAGE projector effect** (`const VINTAGE=true` in `AnimationSection.tsx`): a **blurred, `mix-blend:multiply` background projection** of the featured clip (2nd YT iframe `yt-bg`, rendered at 50% res + `scale(2.24)` so the blur runs on ~1/4 the pixels) **synced** to the foreground `yt-fg` via **`lib/useYouTubeProjection.ts`** (YT IFrame API; play/pause/seek mirror), sitting BEHIND **`components/animation/FilmOverlay.tsx`** (animated dust/speckle layers + `multiply` grain `.noir-grain` + a heavy radial-gradient gate vignette). **The whole vintage stack is PERF-GATED:** only exists once `started`, the overlay is mount-gated to in-view + tab-visible (`vintageOn`), and the projection is `display:none` when off-screen. **Selection = `sel-anim`** = noir grey `#9aa0a6`. Cursor over this section = a **clapperboard** (CustomCursor `'02'`); over the clip's iframe the NATIVE cursor shows (cross-origin iframe can't keep our cursor without blocking clicks - Luke chose interactivity). Tuning knobs: `FILM_PX`/`FILM_W` (tile size), `WIN` (clip inset), `FILM_ASPECT` (interior aspect; lower toward 1.107 to un-stretch sprockets but the clip re-crops). Placeholders left: Reel 01's other 3 tiles + all of Reel 02 are gradient tiles awaiting real clips. |
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
- **PLANNED — Loading screen (deferred, build during dev):** Luke wants a pre-reveal loading screen so
  the whole site shows fully-ready. It's not just cosmetic — it's the proper place to **load + GPU-warm**
  heavy assets behind the curtain (room textures, three.js chunks) and then reveal, which is what fully
  kills the Room Play hitch. Pair it with the texture downscale below. Not started.
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
