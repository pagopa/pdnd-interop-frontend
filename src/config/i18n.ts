import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import { PUBLIC_URL } from '../lib/constants'

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    debug: false,
    fallbackLng: 'it',
    backend: {
      // DANGER DANGER DANGER. The path needs to be prepended with the PUBLIC_URL
      // See: https://stackoverflow.com/a/65396448
      loadPath: `${PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
    },
  })

export default i18n
