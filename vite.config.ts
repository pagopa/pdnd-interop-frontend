import path from 'path'
import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { parse } from 'node-html-parser'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer(), setNonceAttToScripts()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  envPrefix: 'REACT_APP_',
  server: {
    port: 3000,
  },
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
