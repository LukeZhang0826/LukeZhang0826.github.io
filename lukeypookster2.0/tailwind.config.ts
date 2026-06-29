import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'dark-teal': '#001A1E',
        'medium-teal': '#00262C',
        'black': '#000000',
        'dark-grey': '#111111',
        "grey": "#444444",
        'white': '#BBBBBB',
        'purple': '#5200FF',
        'blue': '#0075FF',
        'green': '#24FF00',
        'yellow': '#DBFF00',
      },
    },
  },
  plugins: [],
}
export default config
