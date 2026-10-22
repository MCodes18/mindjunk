import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { securityPlugin } from './scripts/security.mjs';

export default defineConfig(({mode}) => ({
  base: './',
  plugins: [react(), securityPlugin(loadEnv(mode, '.', 'VITE_'))],
  build: { sourcemap: false, assetsInlineLimit: 0 },
  server: { host: '127.0.0.1' },
  preview: {
    host: '127.0.0.1',
    headers: { 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer' }
  }
}));
