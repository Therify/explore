/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

function _getAPIEndpoint(): string {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'http://localhost:3000';
    default:
      if (!process.env.NX_API_ENDPOINT)
        throw new Error('Required env var "NX_API_ENDPOINT" not defined');
      return process.env.NX_API_ENDPOINT;
  }
}

export default defineConfig({
  cacheDir: '../../node_modules/.vite/app',
  build: {
    sourcemap: true,
  },
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': {
        target: _getAPIEndpoint(),
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    sentryVitePlugin({
      org: process.env.NX_SENTRY_ORG,
      project: process.env.NX_SENTRY_PROJECT,
      authToken: process.env.NX_SENTRY_AUTH_TOKEN,
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
