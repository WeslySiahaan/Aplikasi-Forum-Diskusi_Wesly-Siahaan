// vite.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const isVitest = !!process.env.VITEST;

export default defineConfig({
  plugins: [
    react({
      // Fast Refresh requires a preamble only available in dev server HTML.
      // Disable it under Vitest to avoid the preamble error.
      fastRefresh: !isVitest,
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setupTests.js'],
    globals: true,
    css: false,
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    transformMode: { web: [/\.[jt]sx$/] },
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
  },
});