import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'node-html-parser'

const maintenancePagePath = join(process.cwd(), 'maintenance-page')
const maintenancePages = ['maintenance-standard.html', 'maintenance-token-down.html']

describe('maintenance page assets', () => {
  it.each(maintenancePages)('loads font styles from a local versioned stylesheet: %s', (page) => {
    const document = parse(readFileSync(join(maintenancePagePath, page), 'utf8'))
    const stylesheetLinks = document.querySelectorAll('link[rel="stylesheet"]')

    expect(stylesheetLinks.map((link) => link.getAttribute('href'))).toContain('./fonts.css')
    expect(
      stylesheetLinks.some((link) =>
        link.getAttribute('href')?.includes('selfcare.pagopa.it/assets/font')
      )
    ).toBe(false)
    expect(stylesheetLinks.every((link) => link.getAttribute('integrity') === undefined)).toBe(true)
  })

  it('keeps the local font stylesheet versioned with the maintenance pages', () => {
    const fontStylesheet = readFileSync(join(maintenancePagePath, 'fonts.css'), 'utf8')

    expect(fontStylesheet).toContain('@font-face')
    expect(fontStylesheet).toMatch(/font-family:\s*['"]Titillium Web['"]/)
  })
})
