import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { parse } from 'node-html-parser'
import { configDefaults } from 'vitest/config'
import { resolveBackendProxy } from './scripts/local-development/vite-config.mjs'
import { localDashboardPlugin } from './scripts/local-development/vite-dashboard-plugin.mjs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLocalDevelopment = process.env.INTEROP_LOCAL_DEVELOPMENT === 'true'
  const localDevelopmentPlugins = isLocalDevelopment
    ? [
        localDashboardPlugin({
          frontendRoot: __dirname,
          backendRoot: path.resolve(__dirname, '../interop-be-monorepo'),
          selfcareLoginUrl: process.env.SELFCARE_LOGIN_URL,
        }),
      ]
    : []
  const prodPlugins = [react(), setNonceAttToScripts()]
  const devPlugins = [react(), visualizer(), configurePreviewServer(), ...localDevelopmentPlugins]
  const testPlugins = [react()]

  const plugins =
    mode === 'development'
      ? devPlugins
      : mode === 'production'
        ? prodPlugins
        : mode === 'test'
          ? testPlugins
          : undefined

  return {
    base: '/ui',
    plugins,
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    build: {
      target: 'es2017',
      minify: mode !== 'development',
      sourcemap: mode === 'development',
      commonjsOptions: {
        /** 'auto' does not work very well for mui's icons-material package */
        defaultIsModuleExports(id) {
          if (/@mui\/icons-material/.test(id)) return false
          return 'auto'
        },
      },
      chunkSizeWarningLimit: 1800,
    },
    envPrefix: 'REACT_APP_',
    server: {
      port: Number(process.env.INTEROP_FRONTEND_PORT ?? 3000),
      allowedHosts:
        process.env.INTEROP_FRONTEND_PORT === '5173' ? ['host.docker.internal'] : undefined,
      hmr: process.env.INTEROP_FRONTEND_PORT === '5173' ? { clientPort: 3000 } : undefined,
      watch:
        process.env.INTEROP_FRONTEND_POLLING === 'true'
          ? { usePolling: true, interval: 500 }
          : undefined,
      proxy: {
        '/0.0/backend-for-frontend': {
          ...resolveBackendProxy(process.env.INTEROP_BACKEND_TARGET),
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './setupTests.ts',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      server: {
        deps: {
          inline: ['@pagopa/mui-italia'],
        },
      },
      coverage: {
        reporter: ['text', 'lcov'],
        exclude: [
          '**/node_modules/**',
          '**/__tests__/**',
          '**/__test__/**',
          '**/__mocks__/**',
          '**/api/attribute/**',
          '**/api/auth/**',
          '**/api/client/**',
          '**/api/eservice/**',
          '**/api/party/**',
          '**/api/purpose/**',
          '**/api/voucher/**',
          '**/api/one-trust-notices/**',
          '**/api/maintenance/**',
        ],
      },
    },
  }
})

/**
 * Adds nonce attribute with placeholder to all script tags in index.html
 */
function setNonceAttToScripts(): PluginOption {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        const dom = parse(html)
        dom.querySelectorAll('script').forEach((script) => {
          script.setAttribute('nonce', '**CSP_NONCE**')
        })
        return dom.toString()
      },
    },
  }
}

function configurePreviewServer(): PluginOption {
  const testNonce = 'OXtve5rl0YunhKAkT+Qlww=='
  const env = Object.assign(process.env, loadEnv('development', process.cwd(), ''))

  return {
    name: 'configure-preview-server',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader(
          'Content-Security-Policy',
          `default-src 'self'; object-src 'none'; connect-src 'self' ${env.REACT_APP_API_HOST}; script-src 'nonce-${testNonce}'; style-src 'self' 'unsafe-inline'; worker-src 'none'; font-src 'self'; img-src 'self' data:; base-uri 'self'`
        )
        next()
      })
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        const dom = parse(html)
        dom.querySelectorAll('script').forEach((script) => {
          script.setAttribute('nonce', testNonce)
        })
        return dom.toString().replace('**CSP_NONCE**', testNonce)
      },
    },
  }
}
