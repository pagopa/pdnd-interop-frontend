import axios from 'axios'
import { load } from 'cheerio'

const guideURL = 'https://docs.pagopa.it/interoperabilita-1/'

const domainURL = 'https://docs.pagopa.it'
const root = '/interoperabilita-1/'

const urlsToVisit = [guideURL]
const visitedURLs = []

const externalURLs = []
const internalURLs = []

const urlErrors = []

const cloudflareLinks = []
const scrollLinks = []

async function checkURL(url) {
  let pageHTML
  await axios
    .get(url)
    .then((res) => {
      pageHTML = res
    })
    .catch((err) => {
      const error = {
        url: url,
        errorCode: err.message,
      }
      urlErrors.push(error)
      return
    })

  return pageHTML
}

async function getAllURLs(url) {
  if (visitedURLs.includes(url)) {
    return
  }

  const pageHTML = await checkURL(url)

  visitedURLs.push(url)

  if (pageHTML) {
    const $ = load(pageHTML.data)

    $('a').each(async (index, element) => {
      const hrefURL = $(element).attr('href')

      // These are links that will be ignored because are coming from Cloudflare which block the
      // bot for content like email addresses
      if (hrefURL.includes('/cdn-cgi/l/email-protection')) {
        cloudflareLinks.push({
          pageUrl: url,
          link: hrefURL,
        })
      } else if (hrefURL.startsWith('#', 0)) {
        // These are link that will be ignored because are only for moving inside the page
        scrollLinks.push({
          pageUrl: url,
          link: hrefURL,
        })
      } else {
        if (hrefURL && hrefURL.includes(root)) {
          if (!internalURLs.includes(hrefURL)) {
            internalURLs.push(hrefURL)
            const fullUrl = hrefURL.includes(domainURL) ? hrefURL : domainURL + hrefURL
            urlsToVisit.push(fullUrl)
          }
        }

        if (hrefURL && !hrefURL.includes(root)) {
          if (!externalURLs.includes(hrefURL)) {
            externalURLs.push(hrefURL)
            await checkURL(hrefURL)
          }
        }
      }
    })
  }
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
  console.log('ERRORS', urlErrors)
  console.log('Cloudflare LINKS', cloudflareLinks.length)
  console.log('SCROLL LINKS', scrollLinks.length)

  const endingTime = Date.now()
  console.log('Ending TIME', Date(endingTime))

  const duration = endingTime - startingTime
  console.log('DURATION', duration / 1000, 'SECONDS')
}

main()
