import { Lang } from '../../types'
import { getDevLabels } from './wip-utils'

const isDevelopment = !!(process.env.NODE_ENV === 'development')
export const isProduction = !!(process.env.NODE_ENV === 'production')

export const SHOW_DEV_LABELS = isDevelopment || getDevLabels()
export const USE_MOCK_SPID_USER = isDevelopment
export const DISPLAY_LOGS = false // isDevelopment

export const NARROW_MAX_WIDTH = 480
export const MEDIUM_MAX_WIDTH = 700

export const STORAGE_KEY_TOKEN = 'token'
export const STORAGE_PARTY_OBJECT = 'currentParty'

export const FE_SUBPATH = process.env.PUBLIC_URL

export const BASE_URL_FE_PROD = window.location.origin.replace(FE_SUBPATH, '')

export const BASE_URL_FE = isProduction ? BASE_URL_FE_PROD : process.env.REACT_APP_API_HOST
export const URL_FE_LOGIN = `${BASE_URL_FE}${process.env.REACT_APP_URL_FE_LOGIN}`
export const URL_FE_ONBOARDING = `${BASE_URL_FE}${process.env.REACT_APP_URL_FE_ONBOARDING}`
export const URL_INTEROP_M2M_INTERFACE = `${BASE_URL_FE}${process.env.REACT_APP_URL_INTEROP_M2M_INTERFACE}`

export const URL_GATEWAY = process.env.REACT_APP_URL_GATEWAY

export const MOCK_TOKEN = process.env.REACT_APP_MOCK_TOKEN

export const URL_FRAGMENTS: Record<string, Record<Lang, string>> = {
  FIRST_DRAFT: { it: 'prima-bozza', en: 'first-draft' },
  EDIT: { it: 'modifica', en: 'edit' },
}

export const DEFAULT_LANG = 'it'
export const LANGUAGES = [DEFAULT_LANG, 'en']
