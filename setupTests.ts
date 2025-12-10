import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
// extends Vitest's expect method with methods from react-testing-library
import '@testing-library/jest-dom/vitest'

const localhost = 'http://localhost:3000/0.0'
export const testConfigs = {
  NODE_ENV: 'test',
  STAGE: 'DEV',
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL: 'https://auth.dev.interop.pagopa.it/token.oauth2',
  SELFCARE_LOGIN_URL: 'https://uat.selfcare.pagopa.it/',
  SELFCARE_BASE_URL: 'https://uat.selfcare.pagopa.it',
  INTEROP_RESOURCES_BASE_URL: 'https://interop-dev-public.s3.eu-central-1.amazonaws.com',
  BACKEND_FOR_FRONTEND_URL: `${localhost}/backend-for-frontend`,
  MIXPANEL_PROJECT_ID: 'b6c8c3c3ed0b32d66c61593bcb84e705',
  ONETRUST_DOMAIN_SCRIPT_ID: '018ef6c1-31f6-70a6-bf72-ds7d45c0ade7e',
  CLIENT_ASSERTION_JWT_AUDIENCE: '',
  M2M_JWT_AUDIENCE: 'dev.interop.pagopa.it/m2m',
  WELL_KNOWN_URLS: 'https://dev.interop.pagopa.it/.well-known/jwks.json',
  PRODUCER_ALLOWED_ORIGINS: 'IPA',
  API_SIGNAL_HUB_PUSH_INTERFACE_URL:
    'https://raw.githubusercontent.com/pagopa/interop-signalhub-core/refs/heads/develop/docs/openAPI/push-signals.yaml',
  API_SIGNAL_HUB_PULL_INTERFACE_URL:
    'https://raw.githubusercontent.com/pagopa/interop-signalhub-core/refs/heads/develop/docs/openAPI/pull-signals.yaml',
  PUBLIC_URL: '/ui',
  FEATURE_FLAG_ADMIN_CLIENT: 'true',
  FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_UPDATE: 'true',
  API_GATEWAY_V1_INTERFACE_URL:
    'https://selfcare.dev.interop.pagopa.it/m2m/v1-interface-specification.yaml',
  API_GATEWAY_V2_INTERFACE_URL:
    'https://selfcare.dev.interop.pagopa.it/m2m/v2-interface-specification.yaml',
  SIGNALHUB_PERSONAL_DATA_PROCESS_URL: 'http://localhost',
  FEATURE_FLAG_NOTIFICATION_CONFIG: 'true',
  FEATURE_FLAG_ESERVICE_PERSONAL_DATA: 'true',
  FEATURE_FLAG_USE_SIGNED_DOCUMENT: 'true',
}

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// vi.spyOn(global.console, 'log').mockImplementation(() => vi.fn())
vi.spyOn(global.console, 'error').mockImplementation(() => vi.fn())
vi.spyOn(global.console, 'warn').mockImplementation(() => vi.fn())

global.crypto.randomUUID = () =>
  Math.random().toString() as `${string}-${string}-${string}-${string}-${string}`

vi.stubGlobal('scroll', vi.fn())
vi.stubGlobal('pagopa_env', testConfigs)

vi.mock('zustand')
vi.mock('react-i18next')

process.env = {
  ...process.env,
  // This is needed in order to make the tests work.
  // The chosen REACT_APP_API_HOST value is random and could be any string.
  REACT_APP_API_HOST: 'http://localhost:8080',
}
