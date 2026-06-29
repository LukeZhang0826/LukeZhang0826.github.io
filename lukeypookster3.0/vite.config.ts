import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // relative asset paths so the build works whether served from the domain root or a subfolder
  // (GitHub Pages serves the user site from /docs at the root URL).
  base: './',
  server: {
    port: 3000,
    host: true,
  },
  build: {
    // build straight into the repo-root /docs folder that GitHub Pages publishes
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // split rarely-changing vendor code into stable chunks for better repeat-visit
        // caching (three/r3f only load with the lazy WebGL sections that import them).
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
