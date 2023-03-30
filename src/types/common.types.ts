import type { LANGUAGES } from '@/config/constants'

export type PagoPAEnvVars = {
  STAGE: 'DEV' | 'PROD' | 'TEST'
  AUTHORIZATION_PROCESS_URL: string
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL: string
  BACKEND_FOR_FRONTEND_URL: string
  SELFCARE_LOGIN_URL: string
  INTEROP_RESOURCES_BASE_URL: string
  MIXPANEL_PROJECT_ID: string
  API_GATEWAY_INTEFACE_URL: string
  ONETRUST_DOMAIN_SCRIPT_ID: string
  CLIENT_ASSERTION_JWT_AUDIENCE: string
  WELL_KNOWN_URLS: string
  SELFCARE_BASE_URL: string
}

export type ExtendedWindow = Window & {
  pagopa_env?: PagoPAEnvVars
  OptanonWrapper: unknown
  nonce: string
}

export type LangCode = keyof typeof LANGUAGES

export type MUIColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | undefined

export type ExtendedMUIColor = MUIColor | 'disabled' | 'inherit' | 'action'

export type Provider = 'provider'
export type Consumer = 'consumer'
export type ProviderOrConsumer = Provider | Consumer

export type ActionItem = { action: VoidFunction; label: string }

export type StepperStepComponentProps = {
  forward: (e?: React.SyntheticEvent, data?: Record<string, unknown>) => void
  back: () => void
}

export type StepperStep = {
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ElementType<StepperStepComponentProps & any>
}

export type InputOption = { label: string; value: string | number }
