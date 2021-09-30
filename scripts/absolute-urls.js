const fs = require('fs')

const OUTPUT_URL = 'https://gateway.interop.pdnd.dev/ui/'
const INDEX_LOCATION = './build/index.html'

try {
  console.log(`Replacing relative URLs with ${OUTPUT_URL}`)
  const input = fs.readFileSync(INDEX_LOCATION, 'utf8')
  const output = input.replace(/\.\//g, OUTPUT_URL)
  fs.writeFileSync(INDEX_LOCATION, output)
} catch (err) {
  console.error(err)
}
