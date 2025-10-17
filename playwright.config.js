// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  webServer: {
  command: 'npm run dev',
  port: 5173, // default Vite dev port unless you change it
  timeout: 120000,
  reuseExistingServer: !process.env.CI,
},
});