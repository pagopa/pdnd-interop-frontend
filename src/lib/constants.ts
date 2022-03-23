import { Lang } from '../../types'

const isDevelopment = !!(process.env.NODE_ENV === 'development')
const isProduction = !!(process.env.NODE_ENV === 'production')

export const USE_MOCK_SPID_USER = isDevelopment
export const DISPLAY_LOGS = false // isDevelopment

export const STORAGE_KEY_TOKEN = 'token'
export const STORAGE_PARTY_OBJECT = 'currentParty'

const ORIGIN = window.location.origin
export const API_HOST = isProduction ? ORIGIN : process.env.REACT_APP_API_HOST
export const URL_FE_LOGIN = `${API_HOST}/${process.env.REACT_APP_URL_FE_LOGIN}`
export const URL_INTEROP_M2M = process.env.REACT_APP_URL_INTEROP_M2M
export const URL_INTEROP_M2M_INTERFACE_DOCUMENT = `${API_HOST}/${URL_INTEROP_M2M}/${process.env.REACT_APP_URL_INTEROP_M2M_INTERFACE_DOCUMENT}`

export const PUBLIC_URL = process.env.PUBLIC_URL
export const URL_FE = isDevelopment ? `${ORIGIN}${PUBLIC_URL}` : `${API_HOST}${PUBLIC_URL}`

export const MOCK_TOKEN = process.env.REACT_APP_MOCK_TOKEN

export const URL_FRAGMENTS: Record<string, Record<Lang, string>> = {
  FIRST_DRAFT: { it: 'prima-bozza', en: 'first-draft' },
  EDIT: { it: 'modifica', en: 'edit' },
}

export const DEFAULT_LANG = 'it'
export const LANGUAGES = [DEFAULT_LANG, 'en'] as const
