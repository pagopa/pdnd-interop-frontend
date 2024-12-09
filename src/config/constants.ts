import { getCurrentSelfCareProductId } from '@/utils/common.utils'

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
export const assistanceLink = `https://selfcare.pagopa.it/assistenza?productId=${getCurrentSelfCareProductId()}`
export const attributesHelpLink = `${documentationLink}/manuale-operativo/attributi`
export const verifyVoucherGuideLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher`
export const manageEServiceGuideLink = `${documentationLink}/manuale-operativo/e-service`
export const importExportEServiceGuideLink = `${documentationLink}/manuale-operativo/e-service#esportare-ed-importare-un-e-service`
export const implementAndManageEServiceGuideLink = `${documentationLink}/come-integrare-i-propri-servizi-su-pdnd-interoperabilita`
export const voucherVerificationGuideLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher#verifica-di-un-voucher-da-parte-di-un-erogatore-di-e-service`
export const purposeUpgradeGuideLink = `${documentationLink}/manuale-operativo/finalita`
export const agreementUpgradeGuideLink = `${documentationLink}/manuale-operativo/richieste-di-fruizione#fruitore-aggiornare-una-richiesta-di-fruizione`
export const clientKeyGuideLink = `${documentationLink}/manuale-operativo/client-e-materiale-crittografico`
export const generateKeyGuideLink = `${documentationLink}/manuale-operativo/generare-e-caricare-chiavi-di-sicurezza`
export const payloadVerificationGuideLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher#verifiche-sul-payload`
export const apiGuideLink = `${documentationLink}/manuale-operativo/api-esposte-da-pdnd-interoperabilita`
export const openApiCheckerLink = 'https://italia.github.io/api-oas-checker/'
export const eserviceNamingBestPracticeLink =
  'https://italia.github.io/pdnd-guida-nomenclatura-eservice/'
export const keychainGuideLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher#garanzia-dellintegrita-della-risposta`
export const keychainSetupGuideLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher#precondizioni`

export const SH_ESERVICES_ATT_TEMP = ['9b6993ee-60e3-4901-9a32-e6987d690ec4'] //signal hub eservices to hide
export const SH_ESERVICES_UAT_TEMP = [
  //signal hub eservices to hide
  '7ab0a0fc-7d22-4007-b2f3-fddd68fe2f17',
  'e8c087eb-627b-4488-a9b7-65b70fd1301b',
  '407edf51-23b5-462b-af6e-128bbaa4d9ff',
  '3b0fbe47-2e2c-4d8b-9cff-b2381c92d003',
  '260e45e1-9a61-49d6-8b6d-da0643da68ac',
  'a2b84a6e-34cf-44ca-85a4-de21fd232668',
  '6b14c622-dad2-44ea-82bc-2dd4010364d5',
  '03c34a8a-a79a-4928-9afc-8647eefabdb1',
]
