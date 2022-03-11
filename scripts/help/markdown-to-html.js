const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

const FOLDERS = [{ markdownLocation: './data/it/', destLocation: '../../public/data/it/' }]

FOLDERS.forEach(({ markdownLocation, destLocation }) => {
  const markdownFolderPath = path.join(__dirname, markdownLocation)
  const files = fs.readdirSync(markdownFolderPath)

  files.forEach((inputFilename) => {
    try {
      const markdownPath = path.join(markdownFolderPath, inputFilename)
      const markdownData = fs.readFileSync(markdownPath, 'utf8')
      const html = marked.parse(markdownData)
      const outputFilename = inputFilename.replace('.md', '.json')
      const outputPath = path.join(__dirname, destLocation, outputFilename)
      fs.writeFileSync(outputPath, JSON.stringify({ html }), { flag: 'w' })
    } catch (err) {
      console.error(err)
    }
  })
})
