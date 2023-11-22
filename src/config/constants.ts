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
export const assistanceLink = 'mailto:interop@assistenza.pagopa.it'
export const attributesHelpLink = `${documentationLink}/manuale-operativo/attributi`
export const verifyVoucherGuideLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher`
export const manageEServiceGuideLink = `${documentationLink}/manuale-operativo/e-service`
export const implementAndManageEServiceGuideLink = `${documentationLink}/come-integrare-i-propri-servizi-su-pdnd-interoperabilita`
export const voucherVerificationGuideLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher#verifica-di-un-voucher-da-parte-di-un-erogatore-di-e-service`
export const purposeUpgradeGuideLink = `${documentationLink}/manuale-operativo/finalita`
export const agreementUpgradeGuideLink = `${documentationLink}/manuale-operativo/richieste-di-fruizione#fruitore-aggiornare-una-richiesta-di-fruizione`
export const clientKeyGuideLink = `${documentationLink}/manuale-operativo/client-e-materiale-crittografico`
export const generateKeyGuideLink = `${documentationLink}/manuale-operativo/generare-e-caricare-chiavi-di-sicurezza`
export const payloadVerificationGuideLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher#verifiche-sul-payload`
export const apiGuideLink = `${documentationLink}/manuale-operativo/api-esposte-da-pdnd-interoperabilita`
