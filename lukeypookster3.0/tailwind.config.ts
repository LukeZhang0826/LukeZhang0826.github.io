import type { Config } from 'tailwindcss';

/**
 * Design tokens for Portfolio 3.0.
 * Philosophy: "chaos in the pixels, order in the code." Each section is free to
 * clash, but it pulls accents from this shared, deliberately loud master swatch so
 * the chaos still rhymes. Section 00 (hero) = cyber-brutalist.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // base
        bone: '#ECEAE3', // off-white paper
        ink: '#0A0A0A', // near-black
        // clash accents (acid / Mondrian / Klein)
        acid: '#C6FF1A',
        magenta: '#FF1FA0',
        klein: '#1A1AFF',
        mond: {
          red: '#E50914',
          yellow: '#FFD400',
          blue: '#0047FF',
        },
      },
      fontFamily: {
        // per-section display faces — "chaos in the pixels": each section its own voice
        grotesk: ['"Space Grotesk"', 'system-ui', 'sans-serif'], // 00 hero body copy
        graffiti: ['Fusterd', 'cursive'], // 00 hero - vaporwave name (self-hosted tag font)
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'], // HUD + 06 room
        dev: ['Anton', 'Impact', 'system-ui', 'sans-serif'], // 01 development
        music: ['"Playfair Display"', 'Georgia', 'serif'], // 05 music
        anim: ['"Shippori Mincho"', 'Georgia', 'serif'], // 02 animation (elegant Japanese-editorial mincho)
        arch: ['Syncopate', 'system-ui', 'sans-serif'], // 04 photography & architecture
        cyber: ['Orbitron', 'system-ui', 'sans-serif'], // registered (unused since 02 became Animation)
      },
      letterSpacing: {
        brutal: '-0.04em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        blink: 'blink 1.1s steps(1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
