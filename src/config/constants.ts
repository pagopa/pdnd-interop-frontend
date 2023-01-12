export const DEFAULT_LANG = 'it'
export const STORAGE_KEY_SESSION_TOKEN = 'token'
export const SIDENAV_WIDTH = 340

export const MOCK_TOKEN = import.meta.env.REACT_APP_MOCK_TOKEN

export const LANGUAGES = {
  it: { it: 'Italiano', en: 'Inglese' },
  en: { it: 'Italian', en: 'English' },
} as const

export const pagoPaLink = {
  label: 'PagoPA S.p.A.',
  href: 'https://www.pagopa.it',
  ariaLabel: 'Vai al sito di PagoPA S.p.A.',
  title: 'Vai al sito di PagoPA S.p.A.',
}

export const documentationLink = 'https://docs.pagopa.it/interoperabilita-1'

export const attributesHelpLink = `${documentationLink}/manuale-operativo/attributi`
export const verifyVoucherHelpLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher`
export const eserviceHelpLink = `${documentationLink}/manuale-operativo/e-service`
export const purposeUpgradeGuideLink = `${documentationLink}/manuale-operativo/finalita`
export const agreementUpgradeGuideLink = `${documentationLink}/manuale-operativo/richieste-di-fruizione#fruitore-aggiornare-una-richiesta-di-fruizione`
