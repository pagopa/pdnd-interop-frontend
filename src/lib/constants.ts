import {
  AgreementState,
  EServiceState,
  LangCode,
  MUIColor,
  ProviderOrSubscriber,
  UserState,
} from '../../types'
import { isDevelopment } from './env'

export const DISPLAY_LOGS = false // isDevelopment

export const STORAGE_KEY_SESSION_TOKEN = 'token'

const MODE: ProviderOrSubscriber = 'subscriber'
const MOCK_TOKEN_SIDE =
  MODE === ('provider' as ProviderOrSubscriber)
    ? process.env.REACT_APP_MOCK_TOKEN_PROVIDER
    : process.env.REACT_APP_MOCK_TOKEN_SUBSCRIBER
export const MOCK_TOKEN = isDevelopment && MOCK_TOKEN_SIDE

export const MAX_WIDTH = 1280

export const URL_FRAGMENTS: Record<string, Record<LangCode, string>> = {
  FIRST_DRAFT: { it: 'prima-bozza', en: 'first-draft' },
  EDIT: { it: 'modifica', en: 'edit' },
}

export const DEFAULT_LANG = 'it'
export const LANGUAGES = {
  it: { it: 'Italiano', en: 'Inglese' },
  en: { it: 'Italian', en: 'English' },
}

export const pagoPaLink = {
  label: 'PagoPA S.p.A.',
  href: 'https://www.pagopa.it',
  ariaLabel: 'Vai al sito di PagoPA S.p.A.',
  title: 'Vai al sito di PagoPA S.p.A.',
}

export const assistanceLink = 'mailto:interop@assistenza.pagopa.it'

export const documentationLink = 'https://docs.pagopa.it/interoperabilita-1'

export const attributesHelpLink = `${documentationLink}/manuale-operativo/attributi`

export const verifyVoucherHelpLink = `${documentationLink}/manuale-operativo/utilizzare-i-voucher`

export const eServiceHelpLink = `${documentationLink}/manuale-operativo/e-service`

export const CHIP_COLORS_AGREEMENT: Record<AgreementState, MUIColor> = {
  ACTIVE: 'primary',
  SUSPENDED: 'error',
  PENDING: 'warning',
  ARCHIVED: 'info',
  DRAFT: 'info',
  REJECTED: 'error',
  MISSING_CERTIFIED_ATTRIBUTES: 'error',
}

export const CHIP_COLORS_USER: Record<UserState, MUIColor> = {
  PENDING: 'warning',
  ACTIVE: 'primary',
  SUSPENDED: 'error',
}

export const CHIP_COLORS_E_SERVICE: Record<EServiceState, MUIColor> = {
  PUBLISHED: 'primary',
  DRAFT: 'info',
  SUSPENDED: 'error',
  ARCHIVED: 'info',
  DEPRECATED: 'warning',
}

export const LIGHT_GRAY = '#FAFAFA'
