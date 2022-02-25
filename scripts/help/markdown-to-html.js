const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

const MARKDOWN_LOCATION = 'data/help.md'
const DEST_LOCATION = '../../public/data/help.txt'

try {
  const markdownPath = path.join(__dirname, MARKDOWN_LOCATION)
  const markdownData = fs.readFileSync(markdownPath, 'utf8')
  const html = marked.parse(markdownData)
  fs.writeFileSync(path.join(__dirname, DEST_LOCATION), html, { flag: 'w' })
} catch (err) {
  console.error(err)
}
