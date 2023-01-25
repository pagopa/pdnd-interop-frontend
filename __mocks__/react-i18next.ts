import noop from 'lodash/noop'

export const useTranslation = () => {
  return {
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(noop),
      language: 'it',
    },
  }
}

export const Trans = ({ children }) => children
