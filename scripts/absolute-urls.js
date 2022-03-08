const fs = require('fs')

const OUTPUT_URL = 'https://fe-test.gateway.test.pdnd-interop.pagopa.it/ui/'
const INDEX_LOCATION = './build/index.html'

try {
  console.log(`Replacing relative URLs with ${OUTPUT_URL}`)
  const input = fs.readFileSync(INDEX_LOCATION, 'utf8')
  const output = input.replace(/\.\//g, OUTPUT_URL)
  fs.writeFileSync(INDEX_LOCATION, output)
} catch (err) {
  console.error(err)
}
