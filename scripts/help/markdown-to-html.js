import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { marked } from 'marked'

const FOLDERS = [{ markdownLocation: './scripts/help/data/it/', destLocation: './public/data/it/' }]

FOLDERS.forEach(({ markdownLocation, destLocation }) => {
  const markdownFolderPath = join(resolve(), markdownLocation)
  const files = readdirSync(markdownFolderPath)

  files.forEach((inputFilename) => {
    try {
      const markdownPath = join(markdownFolderPath, inputFilename)
      const markdownData = readFileSync(markdownPath, 'utf8')
      const html = marked.parse(markdownData)
      const outputFilename = inputFilename.replace('.md', '.json')
      const outputPath = join(resolve(), destLocation, outputFilename)
      writeFileSync(outputPath, JSON.stringify({ html }), { flag: 'w' })
    } catch (err) {
      console.error(err)
    }
  })
})
