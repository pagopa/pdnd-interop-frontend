import axios from 'axios'
import { load } from 'cheerio'
import { writeFile, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * FORMAT FOR ELEMENTS:
 *
 * type error = {
 *    url: string,
 *    text: string,
 *    error: string
 * }
 *
 * type link = {
 *    url: string,
 *    text: string
 * }
 */

const chalk = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
}

const guideURL = 'https://docs.pagopa.it/interoperabilita-1/'

const domainURL = 'https://docs.pagopa.it'
const root = '/interoperabilita-1/'

const urlsToVisit = [{ url: guideURL, text: 'root' }]
const visitedURLs = []

const externalURLs = []
const internalURLs = []

const urlErrors = []

const cloudflareLinks = []
const anchorLinks = []

async function checkURL(url, text) {
  console.log('Checking URL:', chalk.blue(url))
  let pageHTML
  await axios
    .get(url)
    .then((res) => {
      pageHTML = res
    })
    .catch((err) => {
      const error = {
        url: url,
        text: text,
        errorCode: err.message,
      }
      urlErrors.push(error)
      return
    })

  return pageHTML
}

async function getAllURLs(link) {
  if (visitedURLs.includes(link.url)) {
    return
  }

  const pageHTML = await checkURL(link.url, link.text)

  visitedURLs.push(link.url)

  if (pageHTML) {
    const $ = load(pageHTML.data)

    $('a').each(async (index, element) => {
      const hrefURL = $(element).attr('href')
      const text = $(element).text()

      // These are links that will be ignored because are coming from Cloudflare which block the
      // bot for content like email addresses
      if (hrefURL.includes('/cdn-cgi/l/email-protection')) {
        cloudflareLinks.push({
          pageUrl: link.url,
          link: hrefURL,
        })
      } else if (hrefURL.startsWith('#', 0)) {
        // These are link that will be ignored because are only for moving inside the page
        anchorLinks.push({
          pageUrl: link.url,
          link: hrefURL,
        })
      } else {
        if (hrefURL && hrefURL.includes(root)) {
          if (!internalURLs.find((link) => link.url === hrefURL && link.text === text)) {
            internalURLs.push({
              url: hrefURL,
              text: text,
            })
            const fullUrl = hrefURL.includes(domainURL) ? hrefURL : domainURL + hrefURL
            urlsToVisit.push({
              url: fullUrl,
              text: text,
            })
          }
        }

        if (hrefURL && !hrefURL.includes(root)) {
          if (!externalURLs.find((link) => link.url === hrefURL && link.text === text)) {
            externalURLs.push({
              url: hrefURL,
              text: text,
            })
            await checkURL(hrefURL, text)
          }
        }
      }
    })
  }
}

function formatReport(startingTime, endingTime, duration) {
  const report = `Guide crawl report:
  Internal links tested: ${internalURLs.length}
  External links tested: ${externalURLs.length}
  Cloudflare links found: ${cloudflareLinks.length}
  Anchor links found: ${anchorLinks.length}
  
  Starting time: ${Date(startingTime)}
  Ending time: ${Date(endingTime)}
  Duration in seconds: ${duration / 1000}`

  return report
}

function formatErrors() {
  let report = `Guide crawl errors:\n`

  if (urlErrors.length === 0) {
    report = report.concat('There are no errors')
  }

  urlErrors.forEach((err) => {
    const row = `${err.errorCode}, ${url}, ${text}\n`
    report = report.concat(row)
  })

  return report
}

async function main() {
  console.log('Starting program...\n')

  const startingTime = Date.now()
  while (urlsToVisit.length !== 0) {
    const urlToVisit = urlsToVisit.pop()

    await getAllURLs(urlToVisit)
  }

  const endingTime = Date.now()

  const duration = endingTime - startingTime

  const reportData = formatReport(startingTime, endingTime, duration)
  const reportError = formatErrors()

  mkdirSync(resolve(__dirname, 'output'), { recursive: true }, (err) => {
    if (err !== null) console.log('Error:', err)
  })

  writeFile(resolve(__dirname, 'output/report.txt'), reportData, (err) => {
    if (err !== null) console.log('Error:', err)
  })
  writeFile(resolve(__dirname, 'output/errors.txt'), reportError, (err) => {
    if (err !== null) console.log('Error:', err)
  })

  console.log(chalk.green('\nDone!'))
}

main()
