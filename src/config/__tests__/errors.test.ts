import i18n from 'i18next'
import errorEnNs from '@/static/locales/en/error.json'
import errorItNs from '@/static/locales/it/error.json'

let getMappedError: typeof import('../errors').getMappedError

beforeAll(async () => {
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { error: errorEnNs },
      it: { error: errorItNs },
    },
  })

  getMappedError = (await import('../errors')).getMappedError
})

describe('getMappedError', () => {
  it('maps a BFF error code to its specific localized message', () => {
    expect(getMappedError('008-0008')).toBe('eService not found')
  })

  it('maps a common passthrough error code to its specific localized message', () => {
    expect(getMappedError('000-10013')).toBe('The uploaded file format is not supported')
  })

  it('uses the current language at resolution time', async () => {
    await i18n.changeLanguage('it')

    expect(getMappedError('008-0051')).toBe('Client non trovato')

    await i18n.changeLanguage('en')
  })

  it('returns undefined when the error code is not mapped', () => {
    expect(getMappedError('008-9999')).toBeUndefined()
    expect(getMappedError()).toBeUndefined()
  })
})
