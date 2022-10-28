import { ExtendedWindow, PagoPAEnvVars } from '@/types/common.types'

export const isDevelopment = !!(import.meta.env.MODE === 'development')
export const isProduction = !!(import.meta.env.MODE === 'production')

const PAGOPA_ENV = (window as unknown as ExtendedWindow).pagopa_env

const DEV_API_HOST_URL = import.meta.env.REACT_APP_API_HOST
const DEV_SELFCARE_LOGIN_URL = import.meta.env.REACT_APP_SELFCARE_LOGIN_URL
const DEV_INTEROP_RESOURCES_BASE_URL = import.meta.env.REACT_APP_INTEROP_RESOURCES_BASE_URL
const DEV_ONETRUST_DOMAIN_SCRIPT_ID = import.meta.env.REACT_APP_ONETRUST_DOMAIN_SCRIPT_ID

export const FE_LOGIN_URL = (
  isProduction ? PAGOPA_ENV.SELFCARE_LOGIN_URL : DEV_SELFCARE_LOGIN_URL
) as string
export const PUBLIC_URL = import.meta.env.PUBLIC_URL || '/ui'
export const FE_URL = `${window.location.origin}${PUBLIC_URL}`

export const INTEROP_RESOURCES_BASE_URL = isProduction
  ? PAGOPA_ENV.INTEROP_RESOURCES_BASE_URL
  : DEV_INTEROP_RESOURCES_BASE_URL
export const ONETRUST_DOMAIN_SCRIPT_ID = (
  isProduction ? PAGOPA_ENV.ONETRUST_DOMAIN_SCRIPT_ID : DEV_ONETRUST_DOMAIN_SCRIPT_ID
) as string
export const MIXPANEL_PROJECT_ID = isProduction ? PAGOPA_ENV.MIXPANEL_PROJECT_ID : ''

export const TEMP_USER_WHITELIST_URL = `${INTEROP_RESOURCES_BASE_URL}/temp-whitelist.json`

function getEnvVar(varName: keyof PagoPAEnvVars, devVarName: string): string {
  return isProduction ? PAGOPA_ENV[varName] : `${DEV_API_HOST_URL}/${devVarName}`
}

const SERVICE_VERSION = import.meta.env.REACT_APP_SERVICE_VERSION
export const API_GATEWAY_INTEFACE_URL = getEnvVar(
  'API_GATEWAY_INTEFACE_URL',
  'swagger/docs/interface-specification.yml'
)
export const BACKEND_FOR_FRONTEND_URL = getEnvVar(
  'BACKEND_FOR_FRONTEND_URL',
  `backend-for-frontend/${SERVICE_VERSION}`
)
export const AGREEMENT_PROCESS_URL = getEnvVar(
  'AGREEMENT_PROCESS_URL',
  `agreement-process/${SERVICE_VERSION}`
)
export const AUTHORIZATION_PROCESS_URL = getEnvVar(
  'AUTHORIZATION_PROCESS_URL',
  `authorization-process/${SERVICE_VERSION}`
)
export const CATALOG_PROCESS_URL = getEnvVar(
  'CATALOG_PROCESS_URL',
  `catalog-process/${SERVICE_VERSION}`
)
export const PURPOSE_PROCESS_URL = getEnvVar(
  'PURPOSE_PROCESS_URL',
  `purpose-process/${SERVICE_VERSION}`
)
export const AUTHORIZATION_SERVER_ACCESS_TOKEN_URL = getEnvVar(
  'AUTHORIZATION_SERVER_TOKEN_CREATION_URL',
  'authorization-server/token.oauth2'
)
export const CLIENT_ASSERTION_JWT_AUDIENCE = isProduction
  ? PAGOPA_ENV.CLIENT_ASSERTION_JWT_AUDIENCE
  : ''

function getWellKnownUrls(wellKnownUrls: string | undefined) {
  return wellKnownUrls?.split(',').filter((url) => !!url) || []
}

export const WELL_KNOWN_URLS = isProduction ? getWellKnownUrls(PAGOPA_ENV.WELL_KNOWN_URLS) : ['#']

// TEMP: Backend - This must come from the backend env
export const SELFCARE_BASE_URL = 'https://selfcare.pagopa.it'
