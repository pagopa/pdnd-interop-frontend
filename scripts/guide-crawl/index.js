import axios from 'axios'
import { load } from 'cheerio'
import { writeFile } from 'fs'

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
  const startingTime = Date.now()
  console.log('Starting TIME', Date(startingTime))
  while (urlsToVisit.length !== 0) {
    const urlToVisit = urlsToVisit.pop()

    await getAllURLs(urlToVisit)
  }

  console.log('INTERNAL LINKS', internalURLs.length)
  console.log('EXTERNAL LINKS', externalURLs.length)
  console.log('VISITED LINKS', visitedURLs.length)
  console.log('ERRORS', urlErrors.length)
  console.log('Cloudflare LINKS', cloudflareLinks.length)
  console.log('ANCHOR LINKS', anchorLinks.length)

  const endingTime = Date.now()
  console.log('Ending TIME', Date(endingTime))

  const duration = endingTime - startingTime
  console.log('DURATION', duration / 1000, 'SECONDS')

  const reportData = formatReport(startingTime, endingTime, duration)
  const reportError = formatErrors()

  writeFile('./scripts/guide-crawl/output/report.txt', reportData, (err) => {
    if (err !== null) console.log('Error:', err)
  })
  writeFile('./scripts/guide-crawl/output/errors.txt', reportError, (err) => {
    if (err !== null) console.log('Error:', err)
  })
}

main()
