import { initTracking } from '@pagopa/interop-fe-commons'
import {
  INTEROP_RESOURCES_BASE_URL,
  MIXPANEL_PROJECT_ID,
  NODE_ENV,
  ONETRUST_DOMAIN_SCRIPT_ID,
} from './env'
import type { ExtendedWindow } from '@/types/common.types'

// This should be an union of all the possible mixpanel events
type MixPanelEvent = {
  eventName: 'INTEROP_CATALOG_READ'
  properties: MixPanelCatalogReadEventProps
}

type MixPanelCatalogReadEventProps = {
  tenantId: string // This is the id that identifies who is invoking the event
  eserviceId: string
  descriptorId: string
}

const isTrackingEnabled = NODE_ENV === 'production' /* && STAGE !== 'PROD' */

export const { trackEvent, useTrackPageViewEvent } = initTracking<MixPanelEvent>({
  enabled: isTrackingEnabled,
  oneTrustScriptUrl:
    INTEROP_RESOURCES_BASE_URL + `/onetrust/oneTrust_production/scripttemplates/otSDKStub.js`,
  domainScriptUrl: ONETRUST_DOMAIN_SCRIPT_ID,
  mixpanelToken: MIXPANEL_PROJECT_ID,
  nonce: (window as unknown as ExtendedWindow).nonce,
})
