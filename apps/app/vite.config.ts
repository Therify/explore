/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

interface ProxyConfig {
  target: string;
  changeOrigin: boolean;
  secure: boolean;
}

function _getProxyConfig(): ProxyConfig {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      };
    default: {
      if (!process.env.NX_API_ENDPOINT)
        throw new Error('Required env var "NX_API_ENDPOINT" not defined');
      const config = {
        target: process.env.NX_API_ENDPOINT,
        changeOrigin: true,
        secure: true,
      };
      console.info('Configuring proxy for production', { config });
      return config;
    }
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
        ..._getProxyConfig(),
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
