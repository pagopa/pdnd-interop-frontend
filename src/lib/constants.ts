import { getDevLabels } from './wip-utils'

const isDevelopment = !!(process.env.NODE_ENV === 'development')

export const SHOW_DEV_LABELS = isDevelopment || getDevLabels()
export const USE_MOCK_SPID_USER = isDevelopment
export const DISPLAY_LOGS = false // isDevelopment

export const NARROW_MAX_WIDTH = 480
export const MEDIUM_MAX_WIDTH = 700

export const STORAGE_KEY_USER = 'user'
export const STORAGE_KEY_TOKEN = 'token'

export const URL_FE_LOGIN = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_URL_FE_LOGIN}`
export const URL_FE_ONBOARDING = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_URL_FE_ONBOARDING}`
