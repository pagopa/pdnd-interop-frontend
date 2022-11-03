import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import { DEFAULT_LANG, LANGUAGES } from '@/config/constants'

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    debug: false,
    // Preload is needed to fetch translation in a different language from the current one
    // See https://github.com/i18next/i18next/issues/959#issuecomment-325196655
    // In code, see isProviderOrConsumer in lib/router-utils.ts
    preload: Object.keys(LANGUAGES),
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: [
      'pages',
      'common',
      'shared-components',
      'mutations-feedback',
      'pagopa',
      'eservice',
      'agreement',
      'purpose',
      'client',
      'party',
      'attribute',
      'error',
      'voucher',
    ],
    backend: {
      // DANGER DANGER DANGER. The path needs to be prepended with the PUBLIC_URL
      // See: https://stackoverflow.com/a/65396448
      loadPath: `/locales/{{lng}}/{{ns}}.json`,
    },
  })

export default i18n
