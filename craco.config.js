const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

class NoncePlaceholder {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('NoncePlaceholder', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'NoncePlaceholder',
        (data, cb) => {
          data.bodyTags = data.bodyTags.map((d) => ({
            ...d,
            attributes: { ...d.attributes, nonce: '**CSP_NONCE**' },
          }))

          cb(null, data)
        }
      )
    })
  }
}

class ReplacePublicUrl {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('ReplacePublicUrl', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'ReplacePublicUrl',
        (data, cb) => {
          data.html = data.html.replace(/%PUBLIC_URL%/g, '/ui')
          cb(null, data)
        }
      )
    })
  }
}

const html = new HtmlWebpackPlugin({
  template: path.resolve('public', 'index.html'),
  filename: 'index.html',
  inject: true,
})

module.exports = {
  reactScriptsVersion: 'react-scripts',
  webpack: {
    plugins: {
      add: [html, [new NoncePlaceholder(), 'append'], [new ReplacePublicUrl(), 'append']],
      remove: ['HtmlWebpackPlugin'],
    },
  },
}
