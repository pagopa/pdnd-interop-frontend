import type { ExtendedWindow } from '@/types/common.types'
import { z } from 'zod'

const viteConfigMode = z.enum(['development', 'production', 'test'])
type ViteConfigMode = z.infer<typeof viteConfigMode>

const GeneralConfigs = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  STAGE: z.enum(['DEV', 'PROD', 'UAT', 'ATT', 'QA', 'VAPT']),
  MIXPANEL_PROJECT_ID: z.string(),
  ONETRUST_DOMAIN_SCRIPT_ID: z.string(),
  CLIENT_ASSERTION_JWT_AUDIENCE: z.string(),
  WELL_KNOWN_URLS: z.string(),
  PRODUCER_ALLOWED_ORIGINS: z.string(),
  M2M_JWT_AUDIENCE: z.string().optional(),
  SELFCARE_LOGIN_URL: z.url(),
  API_SIGNAL_HUB_PUSH_INTERFACE_URL: z.url(),
  API_SIGNAL_HUB_PULL_INTERFACE_URL: z.url(),
  SIGNALHUB_PERSONAL_DATA_PROCESS_URL: z.url(),
  API_GATEWAY_V1_INTERFACE_URL: z.url(),
  API_GATEWAY_V2_INTERFACE_URL: z.url(),
  ERROR_DATA_DURATION_TIME: z.string().default('60000'),
})

const FeatureFlagConfigs = z.object({
  FEATURE_FLAG_ADMIN_CLIENT: z.enum(['true', 'false']),
  FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_UPDATE: z.enum(['true', 'false']),
  FEATURE_FLAG_ESERVICE_PERSONAL_DATA: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),

  FEATURE_FLAG_USE_SIGNED_DOCUMENT: z
    .enum(['true', 'false'])
    .default('false')
    .default('false')
    .transform((value) => value === 'true'),
})

const EndpointConfigs = z.object({
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL: z.url(),
  BACKEND_FOR_FRONTEND_URL: z.url(),
  INTEROP_RESOURCES_BASE_URL: z.url(),
  SELFCARE_BASE_URL: z.url(),
})

const FEConfigs = z.object({
  ...FeatureFlagConfigs.shape,
  ...EndpointConfigs.shape,
  ...GeneralConfigs.shape,
})
export type FEConfigs = z.infer<typeof FEConfigs>

const transformedFEConfigs = FEConfigs.transform((c) => ({
  ...c,
  PRODUCER_ALLOWED_ORIGINS: c.PRODUCER_ALLOWED_ORIGINS
    ? parseCommaSeparatedToArray(c.PRODUCER_ALLOWED_ORIGINS)
    : ['IPA'],
  WELL_KNOWN_URLS: parseCommaSeparatedToArray(c.WELL_KNOWN_URLS),
  TEMP_USER_BLACKLIST_URL: c.INTEROP_RESOURCES_BASE_URL + '/blacklist.json',
  ERROR_DATA_DURATION_TIME: z.coerce.number().parse(c.ERROR_DATA_DURATION_TIME),
}))

export type InteropFEConfigs = z.infer<typeof transformedFEConfigs>

const parseCommaSeparatedToArray = (input: string): string[] => {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}
const parseAppMode = (): ViteConfigMode => {
  return viteConfigMode.parse(import.meta.env.MODE)
}

const parseConfigs = (): InteropFEConfigs => {
  // Take the configs from the window object
  const configs = transformedFEConfigs.safeParse((window as unknown as ExtendedWindow).pagopa_env)
  if (!configs.success) {
    mapAndThrowZodConfigsError(configs.error)
  }

  return configs.data!
}

const mapAndThrowZodConfigsError = (errors: z.ZodError<InteropFEConfigs>) => {
  const invalidEnvVars = errors.issues.flatMap((issue) => issue.path + ':' + issue.message)
  throw new Error(`Invalid or missing env vars within FE-interop app: ${invalidEnvVars}`)
}

export const {
  BACKEND_FOR_FRONTEND_URL,
  SELFCARE_LOGIN_URL: FE_LOGIN_URL,
  SELFCARE_BASE_URL,
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
  CLIENT_ASSERTION_JWT_AUDIENCE,
  API_SIGNAL_HUB_PULL_INTERFACE_URL,
  API_SIGNAL_HUB_PUSH_INTERFACE_URL,
  INTEROP_RESOURCES_BASE_URL,
  MIXPANEL_PROJECT_ID,
  ONETRUST_DOMAIN_SCRIPT_ID,
  WELL_KNOWN_URLS,
  STAGE,
  PRODUCER_ALLOWED_ORIGINS,
  TEMP_USER_BLACKLIST_URL,
  M2M_JWT_AUDIENCE,
  NODE_ENV,
  FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_UPDATE,
  FEATURE_FLAG_ADMIN_CLIENT,
  SIGNALHUB_PERSONAL_DATA_PROCESS_URL,
  API_GATEWAY_V1_INTERFACE_URL,
  API_GATEWAY_V2_INTERFACE_URL,
  ERROR_DATA_DURATION_TIME,
  FEATURE_FLAG_ESERVICE_PERSONAL_DATA,
  FEATURE_FLAG_USE_SIGNED_DOCUMENT,
} = parseConfigs()

export const APP_MODE = parseAppMode()
export const PUBLIC_URL = '/ui'
export const FE_URL = `${window.location.origin}${PUBLIC_URL}`
