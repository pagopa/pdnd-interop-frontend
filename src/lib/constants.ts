import { AgreementState, LangCode, MUIColor, UserState } from '../../types'

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
