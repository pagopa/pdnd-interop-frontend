import path from 'path'
import { defineConfig, loadEnv, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { parse } from 'node-html-parser'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const prodPlugins = [react(), setNonceAttToScripts()]
  const devPlugins = [react(), visualizer(), configurePreviewServer()]
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
    base: '/ui/',
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
      rollupOptions: {
        external,
      },
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
      port: 3000,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './setupTests.js',
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

/**
 * This helps to manually remove chunks of code of libraries that do not support treeshaking
 */
function external(source: string) {
  const chunksToRemove = []
  return chunksToRemove.some((chunk) => source.includes(chunk))
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
