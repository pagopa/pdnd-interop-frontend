import { AgreementState, EServiceState, LangCode, MUIColor, UserState } from '../../types'

export const DISPLAY_LOGS = false // isDevelopment

export const STORAGE_KEY_SESSION_TOKEN = 'token'
export const MOCK_TOKEN = process.env.REACT_APP_MOCK_TOKEN

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

export const attributesHelpLink =
  'https://docs.pagopa.it/interoperabilita-1/manuale-operativo/attributi'

export const verifyVoucherHelpLink =
  'https://docs.pagopa.it/interoperabilita-1/manuale-operativo/utilizzare-i-voucher'

export const eServiceHelpLink =
  'https://docs.pagopa.it/interoperabilita-1/manuale-operativo/e-service'

export const CHIP_COLORS_AGREEMENT: Record<AgreementState, MUIColor> = {
  ACTIVE: 'primary',
  SUSPENDED: 'error',
  PENDING: 'warning',
  ARCHIVED: 'info',
  DRAFT: 'info',
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
