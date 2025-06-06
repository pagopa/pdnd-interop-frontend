import { FEATURE_FLAG_SIGNALHUB_WHITELIST, SIGNALHUB_WHITELIST_PRODUCER } from '@/config/env'

export function isSignalHubFeatureFlagEnabled(producerId: string) {
  return FEATURE_FLAG_SIGNALHUB_WHITELIST ? SIGNALHUB_WHITELIST_PRODUCER.includes(producerId) : true
}
