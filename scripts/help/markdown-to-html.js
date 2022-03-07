const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

const OUTPUT_URL = 'https://uat.gateway.test.pdnd-interop.pagopa.it/ui/it/aiuto'

const MARKDOWN_LOCATION = 'data/help.md'
const DEST_LOCATION = '../../public/data/help.json'

try {
  const markdownPath = path.join(__dirname, MARKDOWN_LOCATION)
  const markdownData = fs.readFileSync(markdownPath, 'utf8')
  const html = marked.parse(markdownData)
  const tempReplaced = html.replace(/href=\"\#/g, `href="${OUTPUT_URL}#`)
  fs.writeFileSync(path.join(__dirname, DEST_LOCATION), JSON.stringify({ html: tempReplaced }), {
    flag: 'w',
  })
} catch (err) {
  console.error(err)
}
