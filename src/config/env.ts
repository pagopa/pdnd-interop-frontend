import type { ExtendedWindow } from '@/types/common.types'
import { z } from 'zod'

const injectedInWindowConfigs = (window as unknown as ExtendedWindow).pagopa_env

const localhost = 'http://localhost:3000/0.0'

const defaultConfigs: FEConfigs = {
  STAGE: 'DEV',
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL: 'https://auth.dev.interop.pagopa.it/token.oauth2',
  SELFCARE_LOGIN_URL: 'https://uat.selfcare.pagopa.it/',
  SELFCARE_BASE_URL: 'https://uat.selfcare.pagopa.it',
  INTEROP_RESOURCES_BASE_URL: 'https://interop-dev-public.s3.eu-central-1.amazonaws.com',
  BACKEND_FOR_FRONTEND_URL: `${localhost}/backend-for-frontend`,
  API_GATEWAY_INTERFACE_URL: `${localhost}/swagger/docs/interface-specification.yaml`,
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
  FEATURE_FLAG_SIGNALHUB_WHITELIST: 'true',
  SIGNALHUB_WHITELIST_CONSUMER:
    '69e2865e-65ab-4e48-a638-2037a9ee2ee7,e79a24cd-8edc-441e-ae8d-e87c3aea0059',
  SIGNALHUB_WHITELIST_PRODUCER: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
  NODE_ENV: 'development',
  PUBLIC_URL: '/ui',
}

const envConfig = z.enum(['development', 'production', 'test'])
type EnvMode = z.infer<typeof envConfig>

const GeneralConfigs = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  STAGE: z.enum(['DEV', 'PROD', 'UAT', 'ATT', 'QA', 'VAPT']),
  MIXPANEL_PROJECT_ID: z.string(),
  ONETRUST_DOMAIN_SCRIPT_ID: z.string(),
  CLIENT_ASSERTION_JWT_AUDIENCE: z.string(),
  WELL_KNOWN_URLS: z.string(),
  PRODUCER_ALLOWED_ORIGINS: z.string(),
  PUBLIC_URL: z.string().default('/ui'),
  M2M_JWT_AUDIENCE: z.string().optional(),
})

const FeatureFlagConfigs = z.object({
  FEATURE_FLAG_SIGNALHUB_WHITELIST: z.enum(['true', 'false']),
  SIGNALHUB_WHITELIST_PRODUCER: z.string(),
  SIGNALHUB_WHITELIST_CONSUMER: z.string(),
})

const EndpointConfigs = z.object({
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL: z.string().url(),
  BACKEND_FOR_FRONTEND_URL: z.string().url(),
  SELFCARE_LOGIN_URL: z.string().url(),
  INTEROP_RESOURCES_BASE_URL: z.string().url(),
  API_GATEWAY_INTERFACE_URL: z.string().url(),
  SELFCARE_BASE_URL: z.string().url(),
  API_SIGNAL_HUB_PUSH_INTERFACE_URL: z.string().url(),
  API_SIGNAL_HUB_PULL_INTERFACE_URL: z.string().url(),
})

const FEConfigs = FeatureFlagConfigs.merge(EndpointConfigs).merge(GeneralConfigs)
export type FEConfigs = z.infer<typeof FEConfigs>

const transformedFEConfigs = FeatureFlagConfigs.merge(EndpointConfigs)
  .merge(GeneralConfigs)
  .transform((c) => ({
    ...c,
    PRODUCER_ALLOWED_ORIGINS: c.PRODUCER_ALLOWED_ORIGINS.split(',')
      .map((o) => o.trim())
      .filter(Boolean) ?? ['IPA'],
    WELL_KNOWN_URLS: c.WELL_KNOWN_URLS.split(',')
      .filter((url) => !!url)
      .map((url) => url.trim()),
    SIGNALHUB_WHITELIST_CONSUMER: c.SIGNALHUB_WHITELIST_CONSUMER.split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    SIGNALHUB_WHITELIST_PRODUCER: c.SIGNALHUB_WHITELIST_PRODUCER.split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    TEMP_USER_BLACKLIST_URL: c.INTEROP_RESOURCES_BASE_URL + '/blacklist.json',
  }))

export type InteropFEConfigs = z.infer<typeof transformedFEConfigs>

const parseAppMode = (): EnvMode => {
  return envConfig.parse(import.meta.env.MODE)
}

const parseConfigs = (): InteropFEConfigs => {
  const appMode = envConfig.parse(import.meta.env.MODE)

  //Meaning that we're running application locally or in test (es. vitest run)
  if (appMode === 'development' || appMode === 'test') {
    const configs = transformedFEConfigs.safeParse(defaultConfigs)
    if (!configs.success) {
      mapAndThrowZodConfigsError(configs.error, defaultConfigs.STAGE)
    } else return configs.data
  }

  const configs = transformedFEConfigs.safeParse(injectedInWindowConfigs)
  if (!configs.success) {
    mapAndThrowZodConfigsError(configs.error, defaultConfigs.STAGE)
  }

  return configs.data!
}

const mapAndThrowZodConfigsError = (
  errors: z.ZodError<InteropFEConfigs>,
  stage: InteropFEConfigs['STAGE']
) => {
  const invalidEnvVars = errors.issues.flatMap((issue) => issue.path + ':' + issue.message)
  throw new Error(
    `Invalid or missing env vars within FE-interop app [stage=${stage}]: ${invalidEnvVars}`
  )
}

export const {
  BACKEND_FOR_FRONTEND_URL,
  SELFCARE_LOGIN_URL: FE_LOGIN_URL,
  SELFCARE_BASE_URL,
  API_GATEWAY_INTERFACE_URL,
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
  CLIENT_ASSERTION_JWT_AUDIENCE,
  API_SIGNAL_HUB_PULL_INTERFACE_URL,
  API_SIGNAL_HUB_PUSH_INTERFACE_URL,
  INTEROP_RESOURCES_BASE_URL,
  MIXPANEL_PROJECT_ID,
  ONETRUST_DOMAIN_SCRIPT_ID,
  WELL_KNOWN_URLS,
  PUBLIC_URL,
  STAGE,
  PRODUCER_ALLOWED_ORIGINS,
  TEMP_USER_BLACKLIST_URL,
  FEATURE_FLAG_SIGNALHUB_WHITELIST,
  M2M_JWT_AUDIENCE,
  SIGNALHUB_WHITELIST_CONSUMER,
  SIGNALHUB_WHITELIST_PRODUCER,
  NODE_ENV,
} = parseConfigs()

export const APP_MODE = parseAppMode()
export const FE_URL = `${window.location.origin}${PUBLIC_URL}`
