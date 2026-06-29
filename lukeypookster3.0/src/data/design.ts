export type StyleMotif =
  | 'solid'
  | 'grid'
  | 'blocks'
  | 'mondrian'
  | 'bauhaus'
  | 'stripes'
  | 'sun'
  | 'ornate'
  | 'dots'
  | 'gradient'
  | 'scan'
  | 'noise'
  | 'pixel'
  | 'psychedelic'
  | 'atomic'
  | 'opart'
  | 'columns'
  | 'hairline'
  | 'glitch'
  | 'memphis'
  | 'boxlogo'
  | 'overprint'
  | 'bloom'
  | 'terminal'
  | 'maximal'
  | 'vaporwave'
  | 'y2k'
  | 'acidhouse'
  | 'webbrut'
  | 'cyberpunk'
  | 'popart'
  | 'eightbit'
  | 'grunge'
  | 'xerox';

export type StyleFont =
  | 'grotesk'
  | 'mono'
  | 'serif'
  | 'slab'
  | 'system'
  | 'condensed'
  | 'fantasy'
  | 'cursive';

export type StyleCard = {
  id: string;
  /** the style's name - this is the dictionary headword */
  name: string;
  /** rough era / origin, shown as a reference label */
  era: string;
  /** one-line description for reflection/reference */
  blurb: string;
  /** 2–3 defining traits */
  traits: string[];
  bg: string;
  /** gradient end color when motif === 'gradient' */
  bg2?: string;
  fg: string;
  accent: string;
  accent2?: string;
  font: StyleFont;
  motif: StyleMotif;
  /** the specimen word, set in the style's spirit */
  sample: string;
};

/**
 * THE DESIGN DICTIONARY - Section 03.
 *
 * Deliberately INCOHERENT: a horizontal-scrolling reference wall of graphic-design
 * styles, every card with its own unrelated palette / font / motif. This section opts
 * OUT of the shared tailwind master swatch on purpose (Luke: "do not make this section
 * cohesive at all") - colors here are raw hex per card, not tokens. Add styles freely;
 * each is just one entry + an existing motif. Doubles as Luke's own style reference.
 */
export const STYLE_DICTIONARY: StyleCard[] = [
  {
    id: 'swiss',
    name: 'Swiss / Int’l Typographic',
    era: '1950s',
    blurb: 'Mathematical grid, Helvetica, ruthless hierarchy, empty space as a tool.',
    traits: ['Grid', 'Sans', 'Hierarchy'],
    bg: '#ECEAE3',
    fg: '#111111',
    accent: '#E5121F',
    font: 'grotesk',
    motif: 'grid',
    sample: 'Helvetica',
  },
  {
    id: 'bauhaus',
    name: 'Bauhaus',
    era: '1920s',
    blurb: 'Form follows function - primary colors and pure geometry.',
    traits: ['Geometric', 'Primary', 'Modernist'],
    bg: '#F4E9D8',
    fg: '#1A1A1A',
    accent: '#E53935',
    accent2: '#1E88E5',
    font: 'grotesk',
    motif: 'bauhaus',
    sample: 'FORM',
  },
  {
    id: 'destijl',
    name: 'De Stijl / Mondrian',
    era: '1917',
    blurb: 'Neo-plasticism: black grids, white fields, red-yellow-blue blocks.',
    traits: ['Grid', 'Primary', 'Lines'],
    bg: '#FFFFFF',
    fg: '#000000',
    accent: '#D60000',
    accent2: '#0029FF',
    font: 'grotesk',
    motif: 'mondrian',
    sample: 'Composition',
  },
  {
    id: 'constructivism',
    name: 'Russian Constructivism',
    era: '1920s',
    blurb: 'Diagonal energy, red and black, photomontage propaganda.',
    traits: ['Diagonal', 'Agitprop', 'Bold'],
    bg: '#C0341D',
    fg: '#F2E8D5',
    accent: '#111111',
    font: 'condensed',
    motif: 'stripes',
    sample: 'АГИТ',
  },
  {
    id: 'artdeco',
    name: 'Art Deco',
    era: '1920–30s',
    blurb: 'Gilded symmetry, sunbursts, machine-age luxury.',
    traits: ['Gilded', 'Symmetry', 'Luxe'],
    bg: '#0B1F3A',
    fg: '#E7C873',
    accent: '#C9A227',
    font: 'serif',
    motif: 'sun',
    sample: 'GATSBY',
  },
  {
    id: 'artnouveau',
    name: 'Art Nouveau',
    era: '1890s',
    blurb: 'Organic whiplash curves, florals, ornamental framing.',
    traits: ['Organic', 'Floral', 'Curves'],
    bg: '#2E4434',
    fg: '#E8D9A0',
    accent: '#B08D57',
    font: 'serif',
    motif: 'ornate',
    sample: 'Mucha',
  },
  {
    id: 'psychedelic',
    name: 'Psychedelic',
    era: '1960s',
    blurb: 'Warped liquid type, vibrating complementary colors, Fillmore posters.',
    traits: ['Warped', 'Vibrant', 'Liquid'],
    bg: '#2A0A4A',
    fg: '#FFE600',
    accent: '#FF2D95',
    accent2: '#00E5FF',
    font: 'fantasy',
    motif: 'psychedelic',
    sample: 'GROOVY',
  },
  {
    id: 'memphis',
    name: 'Memphis',
    era: '1980s',
    blurb: 'Squiggles, confetti, pastels - gleeful postmodern chaos.',
    traits: ['Playful', 'Pastel', 'Squiggle'],
    bg: '#FDF0E3',
    fg: '#1A1A1A',
    accent: '#00C2D1',
    accent2: '#FF4FA3',
    font: 'grotesk',
    motif: 'memphis',
    sample: 'Squiggle',
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    era: '2010s',
    blurb: 'Roman busts, pink-teal gradients, Japanese type, mall nostalgia.',
    traits: ['Nostalgia', 'Glitch', 'マーブル'],
    bg: '#FF6AD5',
    bg2: '#26C5E0',
    fg: '#FFFFFF',
    accent: '#C774E8',
    font: 'serif',
    motif: 'vaporwave',
    sample: 'A E S T H',
  },
  {
    id: 'frutigeraero',
    name: 'Y2K / Frutiger Aero',
    era: '2000s',
    blurb: 'Glossy bubbles, aqua, skies and water - optimistic gloss.',
    traits: ['Glossy', 'Bubbly', 'Chrome'],
    bg: '#BDE0FE',
    bg2: '#8ED1FC',
    fg: '#00204A',
    accent: '#7CFC00',
    font: 'system',
    motif: 'y2k',
    sample: 'Aqua',
  },
  {
    id: 'acid',
    name: 'Acid / Rave',
    era: '1990s',
    blurb: 'Smiley faces, neon on black, melted distortion, flyer culture.',
    traits: ['Neon', 'Smiley', 'Distort'],
    bg: '#050505',
    fg: '#C6FF1A',
    accent: '#FF1FA0',
    font: 'grotesk',
    motif: 'acidhouse',
    sample: 'RAVE',
  },
  {
    id: 'brutalism',
    name: 'Web Brutalism',
    era: '2010s',
    blurb: 'Raw HTML, default blue links, system fonts, anti-polish.',
    traits: ['Unstyled', 'Default', 'Raw'],
    bg: '#FFFFFF',
    fg: '#0000EE',
    accent: '#FF0000',
    font: 'mono',
    motif: 'webbrut',
    sample: 'raw.html',
  },
  {
    id: 'neubrutalism',
    name: 'Neubrutalism',
    era: '2020s',
    blurb: 'Hard drop shadows, thick borders, clashing flats, loud confidence.',
    traits: ['Hard shadow', 'Borders', 'Loud'],
    bg: '#FFDE59',
    fg: '#000000',
    accent: '#FF5C5C',
    accent2: '#2D2DFF',
    font: 'grotesk',
    motif: 'blocks',
    sample: 'BOLD',
  },
  {
    id: 'grunge',
    name: 'Grunge / Carson',
    era: '1990s',
    blurb: 'Distressed textures, broken grids, expressive illegibility (Ray Gun).',
    traits: ['Distress', 'Collage', 'Chaos'],
    bg: '#1C1B19',
    fg: '#D8D2C4',
    accent: '#8A2B0F',
    font: 'serif',
    motif: 'grunge',
    sample: 'Ray Gun',
  },
  {
    id: 'punk',
    name: 'Punk / Xerox',
    era: '1970s',
    blurb: 'Ransom-note cut-paste, photocopied grit, DIY aggression.',
    traits: ['Cut-paste', 'Photocopy', 'DIY'],
    bg: '#EDEDED',
    fg: '#111111',
    accent: '#FF004D',
    font: 'condensed',
    motif: 'xerox',
    sample: 'ANARCHY',
  },
  {
    id: 'popart',
    name: 'Pop Art',
    era: '1960s',
    blurb: 'Ben-Day halftone dots, comic panels, mass-culture punch.',
    traits: ['Halftone', 'Comic', 'Bold'],
    bg: '#FFE800',
    fg: '#111111',
    accent: '#E5004C',
    accent2: '#0066FF',
    font: 'grotesk',
    motif: 'popart',
    sample: 'POW!',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    era: '1980s →',
    blurb: 'Neon-on-noir, kanji glow, rain-slick dystopia.',
    traits: ['Neon', '漢字', 'Dystopia'],
    bg: '#07010E',
    fg: '#00FFD1',
    accent: '#FF003C',
    font: 'mono',
    motif: 'cyberpunk',
    sample: 'NIGHT CITY',
  },
  {
    id: 'atomic',
    name: 'Retro-Futurism / Atomic',
    era: '1950s',
    blurb: 'Boomerangs, starbursts, space-age optimism, teal and mustard.',
    traits: ['Starburst', 'Space-age', 'Boomerang'],
    bg: '#16404D',
    fg: '#F4D35E',
    accent: '#EE6C4D',
    accent2: '#F4D35E',
    font: 'slab',
    motif: 'atomic',
    sample: 'ATOMIC',
  },
  {
    id: 'pixel',
    name: 'Pixel / 8-bit',
    era: '1980s',
    blurb: 'Dithered sprites, low-res grids, Game Boy greens.',
    traits: ['8-bit', 'Dither', 'Console'],
    bg: '#0F380F',
    fg: '#9BBC0F',
    accent: '#8BAC0F',
    font: 'mono',
    motif: 'eightbit',
    sample: 'GAME OVER',
  },
  {
    id: 'glitch',
    name: 'Glitch',
    era: '2010s',
    blurb: 'RGB channel shift, datamosh, corrupted signal as aesthetic.',
    traits: ['RGB shift', 'Datamosh', 'Error'],
    bg: '#0A0A0A',
    fg: '#FFFFFF',
    accent: '#FF00C1',
    accent2: '#00FFF7',
    font: 'mono',
    motif: 'glitch',
    sample: 'ERR0R',
  },
  {
    id: 'risograph',
    name: 'Risograph',
    era: 'now',
    blurb: 'Spot-ink overprint, grainy registration, fluoro flats.',
    traits: ['Spot ink', 'Overprint', 'Grain'],
    bg: '#F3EEE3',
    fg: '#2B2B2B',
    accent: '#FF6B57',
    accent2: '#2541B2',
    font: 'grotesk',
    motif: 'overprint',
    sample: 'RISO',
  },
  {
    id: 'editorial',
    name: 'Editorial / Magazine',
    era: 'now',
    blurb: 'Column grids, serif body, generous whitespace, the feature spread.',
    traits: ['Columns', 'Serif', 'Whitespace'],
    bg: '#FAFAF7',
    fg: '#111111',
    accent: '#C0392B',
    font: 'serif',
    motif: 'columns',
    sample: 'Feature',
  },
  {
    id: 'archmag',
    name: 'Architecture Monograph',
    era: 'now',
    blurb: 'Hairlines, oversized plates, thin justified captions - the cool.',
    traits: ['Hairline', 'Plates', 'Cool'],
    bg: '#F3F1EA',
    fg: '#1A1A1A',
    accent: '#7A7A72',
    font: 'serif',
    motif: 'hairline',
    sample: 'Structure',
  },
  {
    id: 'maximalism',
    name: 'Maximalism',
    era: 'now',
    blurb: 'More is more - layered clash, saturated everything, no rest.',
    traits: ['Layered', 'Clash', 'Loud'],
    bg: '#6A00F4',
    fg: '#FFE600',
    accent: '#00F5D4',
    accent2: '#FF006E',
    font: 'grotesk',
    motif: 'maximal',
    sample: 'MORE',
  },
  {
    id: 'minimalism',
    name: 'Minimalism',
    era: 'now',
    blurb: 'Restraint, negative space, one idea, said quietly.',
    traits: ['Space', 'Restraint', 'Quiet'],
    bg: '#FFFFFF',
    fg: '#111111',
    accent: '#111111',
    font: 'grotesk',
    motif: 'solid',
    sample: 'less.',
  },
  {
    id: 'citypop',
    name: 'Japanese City Pop',
    era: '1980s',
    blurb: 'Sunset gradients, chrome script, neon Tokyo nostalgia.',
    traits: ['Sunset', 'Chrome', 'シティ'],
    bg: '#1B2A4A',
    bg2: '#F25C78',
    fg: '#FFFFFF',
    accent: '#FFC857',
    font: 'cursive',
    motif: 'gradient',
    sample: 'シティ',
  },
  {
    id: 'streetwear',
    name: 'Streetwear / Hypebeast',
    era: '2010s',
    blurb: 'Box logo, bold condensed, drop culture, red-on-white.',
    traits: ['Box logo', 'Drop', 'Hype'],
    bg: '#E01E26',
    fg: '#FFFFFF',
    accent: '#000000',
    font: 'condensed',
    motif: 'boxlogo',
    sample: 'BOX LOGO',
  },
  {
    id: 'solarpunk',
    name: 'Solarpunk / Naturalist',
    era: 'now',
    blurb: 'Organic optimism, plant greens, warm sun, hopeful futures.',
    traits: ['Organic', 'Green', 'Hopeful'],
    bg: '#DCEFC9',
    fg: '#1F3D23',
    accent: '#E08D3C',
    font: 'serif',
    motif: 'bloom',
    sample: 'BLOOM',
  },
  {
    id: 'opart',
    name: 'Op Art',
    era: '1960s',
    blurb: 'Black-and-white illusion, moiré vibration, Bridget Riley.',
    traits: ['Illusion', 'B&W', 'Vibrate'],
    bg: '#FFFFFF',
    fg: '#000000',
    accent: '#000000',
    font: 'grotesk',
    motif: 'opart',
    sample: 'MOIRÉ',
  },
  {
    id: 'terminal',
    name: 'ASCII / Terminal',
    era: '1980s',
    blurb: 'Monospace green-on-black, CRT glow, text as interface.',
    traits: ['Monospace', 'CRT', 'Text'],
    bg: '#000000',
    fg: '#33FF66',
    accent: '#33FF66',
    font: 'mono',
    motif: 'terminal',
    sample: '>_run',
  },
];

/**
 * Longer description shown on the BACK of each style card (click to flip). Keyed by id;
 * falls back to the card's `blurb` if missing. Reference-grade, a sentence or two each.
 */
export const STYLE_NOTE: Record<string, string> = {
  swiss:
    'Born at Basel and Zürich in the 1950s. Objective, grid-driven order: flush-left Helvetica, mathematical columns, and white space treated as an active material. The house style of corporate modernism.',
  bauhaus:
    'The 1919-33 German school that fused art, craft and industry. Primary colours, circle-square-triangle geometry, and the belief that form follows function - design for the machine age.',
  destijl:
    'Van Doesburg and Mondrian’s neo-plasticism (1917). Reality reduced to absolutes: black orthogonal lines, white fields, the three primaries. No diagonals, no curves, no compromise.',
  constructivism:
    'Post-revolution Russian design as a tool for the people. Diagonal dynamism, red and black, sans-serif shouting and photomontage - Rodchenko turning art into agitprop.',
  artdeco:
    'The machine-age glamour of the 1920s-30s. Symmetry, gilded geometry, sunbursts and stepped forms - speed and luxury rendered in chrome and gold.',
  artnouveau:
    '1890s ornament drawn from nature. Whiplash curves, florals and the figure wrapped in decorative frames - Mucha, Beardsley and the total designed environment.',
  psychedelic:
    '1960s San Francisco rock posters - Wes Wilson, Victor Moscoso. Liquid lettering packed edge to edge in vibrating complementary colour you almost have to squint to read.',
  memphis:
    'Ettore Sottsass’s Milan collective, 1981. Squiggles, confetti, terrazzo and clashing pastels - a gleeful, deliberately tasteless rejection of good-taste modernism.',
  vaporwave:
    'An internet aesthetic mourning the 80s-90s future that never arrived. Roman busts, pink-teal gradients, Japanese type and mall nostalgia, slightly corrupted.',
  frutigeraero:
    'Mid-2000s corporate optimism - Windows Vista, Frutiger type, glossy aqua bubbles, skies and water. Clean, hopeful, and very of its moment.',
  acid:
    'Late-80s/90s rave and acid-house flyers. Smiley faces, melted neon-on-black and cheap photocopied distortion - the look of the second summer of love.',
  brutalism:
    'Web brutalism strips the page back to raw HTML: Times New Roman, default-blue links, system defaults and zero polish. Honest, fast, anti-design as a statement.',
  neubrutalism:
    'The 2020s UI flavour - hard offset drop-shadows, thick black borders, flat clashing fills and oversized type. Brutalist attitude, but designed on purpose.',
  grunge:
    'David Carson and Ray Gun magazine, early 90s. Distressed textures, shattered grids and expressive illegibility - emotion privileged over readability.',
  punk:
    '1970s DIY: ransom-note lettering cut from newsprint, photocopied to grit, stapled together overnight. Jamie Reid’s Sex Pistols sleeves as the template.',
  popart:
    '1960s Lichtenstein and Warhol - Ben-Day halftone dots, comic-panel framing and mass-culture imagery elevated to fine art, loud and flat and ironic.',
  cyberpunk:
    'High tech, low life. Neon signage and glowing kanji over rain-slick noir - Blade Runner rendered as a graphic language of dystopian glamour.',
  atomic:
    '1950s atomic / space-age optimism - boomerangs, starbursts, orbiting electrons, teal and mustard. The Jetsons future of kidney tables and ray-gun gothic.',
  pixel:
    'The constraint aesthetic of early consoles. Dithered low-res sprites, chunky bitmap type and limited palettes like the Game Boy’s four greens.',
  glitch:
    'The error as ornament. RGB channel-shift, datamoshing and corrupted-signal artefacts deliberately induced - beauty found in the broken machine.',
  risograph:
    'Risograph printing: soy-ink spot colours layered with imperfect registration and a characteristic grain. Cheap, tactile, fluoro - beloved of zines.',
  editorial:
    'The magazine tradition - column grids, a serif text face, considered hierarchy and generous whitespace built around the feature spread and the pull quote.',
  archmag:
    'The architecture monograph look. Hairline rules, oversized plates, thin justified captions and a lot of restraint - cool, precise, expensive-feeling.',
  maximalism:
    'More is more. Layered pattern, saturated everything and competing focal points - density as the point, the antidote to minimalism’s silence.',
  minimalism:
    'Restraint as the message. One idea, vast negative space, a single quiet gesture - everything unnecessary removed until only the essential remains.',
  citypop:
    '1980s Japanese city pop sleeves - sunset gradients, chrome script and palm-and-neon Tokyo nostalgia for a glossy bubble-era night drive.',
  streetwear:
    'Hypebeast graphic language - the box logo, bold condensed type, red-on-white and the scarcity theatre of the drop.',
  solarpunk:
    'An optimistic eco-futurism. Plant greens, warm sun and organic curves imagining a hopeful, low-carbon world - Art Nouveau rewired for sustainability.',
  opart:
    '1960s optical art - Bridget Riley, Victor Vasarely. Pure black-and-white geometry tuned to vibrate, shimmer and trick the eye into seeing motion.',
  terminal:
    'The command line as aesthetic. Monospace green phosphor on black, CRT scanlines and a blinking cursor - text as the entire interface.',
};

/* ============================================================================
 * UI & GRAPHICS - selected work gallery (separate from the style dictionary).
 * ========================================================================== */

export type WorkKind = 'ui' | 'graphic';

export type WorkPiece = {
  id: string;
  title: string;
  kind: WorkKind;
  category: string;
  year: string;
  tags: string[];
  /** card preview colors (placeholder block until a real image/thumb lands) */
  bg: string;
  bg2: string;
  fg: string;
  /** PLACEHOLDER / invented work - replace with Luke's real pieces + a `thumb` field */
  placeholder?: boolean;
};

/**
 * PLACEHOLDER WORK - invented stand-ins so the UI/graphics gallery has something to
 * show. NONE of these are real yet; swap in Luke's actual pieces (and add image thumbs)
 * when he provides them. Previews are colored/gradient blocks for now.
 */
export const DESIGN_WORK: WorkPiece[] = [
  {
    id: 'finseer-ui',
    title: 'Finseer',
    kind: 'ui',
    category: 'Fintech Dashboard',
    year: '2025',
    tags: ['Figma', 'Product', 'Web'],
    bg: '#0E1726',
    bg2: '#1F6FEB',
    fg: '#EAF2FF',
    placeholder: true,
  },
  {
    id: 'aperture-ui',
    title: 'Aperture',
    kind: 'ui',
    category: 'Camera App',
    year: '2025',
    tags: ['iOS', 'Mobile', 'Motion'],
    bg: '#111111',
    bg2: '#F2C14E',
    fg: '#FFFFFF',
    placeholder: true,
  },
  {
    id: 'jazzfm-rebrand',
    title: 'JAZZ.FM Rebrand',
    kind: 'graphic',
    category: 'Identity',
    year: '2024',
    tags: ['Logo', 'Brand', 'Print'],
    bg: '#2B1055',
    bg2: '#E94F8A',
    fg: '#FFE9F4',
    placeholder: true,
  },
  {
    id: 'coltrane-posters',
    title: 'Coltrane Poster Series',
    kind: 'graphic',
    category: 'Poster',
    year: '2024',
    tags: ['Editorial', 'Type', 'Riso'],
    bg: '#0B3D2E',
    bg2: '#E6B325',
    fg: '#F4F1E1',
    placeholder: true,
  },
  {
    id: 'indie-atlas-ui',
    title: 'Indie Atlas',
    kind: 'ui',
    category: 'Music Discovery',
    year: '2025',
    tags: ['Figma', 'Web', 'Data-viz'],
    bg: '#101010',
    bg2: '#1DB954',
    fg: '#EFFFF2',
    placeholder: true,
  },
  {
    id: 'modular-ds',
    title: 'Modular',
    kind: 'ui',
    category: 'Design System',
    year: '2024',
    tags: ['Tokens', 'Components', 'Docs'],
    bg: '#1A1A1A',
    bg2: '#7C5CFF',
    fg: '#F3F0FF',
    placeholder: true,
  },
  {
    id: 'acid-bloom-poster',
    title: 'Acid Bloom',
    kind: 'graphic',
    category: 'Gig Poster',
    year: '2023',
    tags: ['Acid', 'Print', 'Y2K'],
    bg: '#05140A',
    bg2: '#C6FF1A',
    fg: '#E9FFD0',
    placeholder: true,
  },
];
