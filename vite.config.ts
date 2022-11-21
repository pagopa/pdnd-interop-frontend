import path from 'path'
import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { parse } from 'node-html-parser'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let plugins = [react(), setNonceAttToScripts()]
  const devPlugins = [visualizer()]

  if (mode === 'development') {
    plugins = plugins.concat(devPlugins)
  }

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
