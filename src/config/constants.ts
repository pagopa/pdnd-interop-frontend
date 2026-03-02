import { getCurrentSelfCareProductId } from '@/utils/common.utils'
import type { InteropFEConfigs } from './env'
import { DOCUMENTATION_URL } from '@/config/env'

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
export const assistanceLink = `https://selfcare.pagopa.it/assistenza?productId=${getCurrentSelfCareProductId()}`
export const attributesHelpLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/attributi`
export const verifyVoucherGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/utilizzare-i-voucher`
export const manageEServiceGuideLink = `${DOCUMENTATION_URL}/tutorial/tutorial-per-lerogatore/come-integrare-unapi`
export const importExportEServiceGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/e-service/e-service`
export const implementAndManageEServiceGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/e-service/operazioni-e-ciclo-di-vita`
export const voucherVerificationGuideLink = `${DOCUMENTATION_URL}/tutorial/tutorial-per-lerogatore/come-verificare-la-validita-di-un-voucher-bearer`
export const interfaceVerificationGuideLink = `${DOCUMENTATION_URL}/tutorial/tutorial-generali/come-verificare-lintegrita-di-un-documento`
export const purposeUpgradeGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/e-service/soglie-e-approvazioni`
export const agreementUpgradeGuideLink = `${DOCUMENTATION_URL}/tutorial/tutorial-per-il-fruitore/come-aggiornare-una-richiesta-di-fruizione`
export const clientKeyGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/client-e-materiale-crittografico/operazioni`
export const generateKeyGuideLink = `${DOCUMENTATION_URL}/tutorial/tutorial-per-il-fruitore/come-generare-il-corredo-crittografico-e-caricare-una-chiave-pubblica`
export const payloadVerificationGuideLink = `${DOCUMENTATION_URL}/tutorial/tutorial-per-lerogatore/come-verificare-la-validita-di-un-voucher-bearer`
export const apiGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/api-esposte-da-pdnd`
export const delegationGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/deleghe`
export const delegationEServiceGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/deleghe/delega-per-la-fruizione`
export const openApiCheckerLink = 'https://italia.github.io/api-oas-checker/'
export const eserviceNamingBestPracticeLink =
  'https://italia.github.io/pdnd-guida-nomenclatura-eservice/'
export const keychainGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/utilizzare-i-voucher/garanzia-dellintegrita-della-risposta`
export const keychainSetupGuideLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/e-service/portachiavi`
export const implementAndManageEServiceTemplateLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/template-e-service/operazioni-e-ciclo-di-vita`
export const updateEserviceInstanceLink = `${DOCUMENTATION_URL}/riferimenti-tecnici/template-e-service/relazione-tra-template-e-istanza`

export const SH_ESERVICES_TO_HIDE_TEMP: Partial<Record<InteropFEConfigs['STAGE'], Array<string>>> =
  {
    ATT: ['9b6993ee-60e3-4901-9a32-e6987d690ec4'],
    UAT: [
      '7ab0a0fc-7d22-4007-b2f3-fddd68fe2f17',
      'e8c087eb-627b-4488-a9b7-65b70fd1301b',
      '407edf51-23b5-462b-af6e-128bbaa4d9ff',
      '3b0fbe47-2e2c-4d8b-9cff-b2381c92d003',
      '260e45e1-9a61-49d6-8b6d-da0643da68ac',
      'a2b84a6e-34cf-44ca-85a4-de21fd232668',
      '6b14c622-dad2-44ea-82bc-2dd4010364d5',
      '03c34a8a-a79a-4928-9afc-8647eefabdb1',
    ],
  }

export const apiV2GuideLink =
  'https://developer.pagopa.it/pdnd-interoperabilita/guides/pdnd-manuale-operativo/manuale-operativo/api-esposte-da-pdnd-interoperabilita'

export const SIGNALHUB_GUIDE_URL =
  'https://developer.pagopa.it/pdnd-interoperabilita/guides/manuale-operativo-signal-hub'

export const apiV1DocLink =
  'https://developer.pagopa.it/pdnd-interoperabilita/guides/manuale-operativo-pdnd-interoperabilita/v1.0/riferimenti-tecnici/utilizzare-i-voucher'

export const apiV2DocLink = 'https://developer.pagopa.it/pdnd-interoperabilita/api/pdnd-core-v2/'

export const apiSignalhubPushLink =
  'https://developer.pagopa.it/pdnd-interoperabilita/api/signal-hub-push-v1/'
export const apiSignalhubPullLink =
  'https://developer.pagopa.it/pdnd-interoperabilita/api/signal-hub-pull-v1/'
