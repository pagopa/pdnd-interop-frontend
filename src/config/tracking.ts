import { initTracking } from '@pagopa/interop-fe-commons'
import {
  INTEROP_RESOURCES_BASE_URL,
  MIXPANEL_PROJECT_ID,
  NODE_ENV,
  ONETRUST_DOMAIN_SCRIPT_ID,
  STAGE,
} from './env'
import type { ExtendedWindow } from '@/types/common.types'
import { STORAGE_KEY_SESSION_TOKEN } from './constants'
import { parseJwt } from '@/api/auth/auth.utils'

// This should be an union of all the possible mixpanel events
type MixPanelEvent =
  | {
      eventName: 'INTEROP_CATALOG_READ'
      properties: MixPanelCatalogReadAndDownloadEventProps
    }
  | {
      eventName: 'INTEROP_CATALOG_SEARCH_KEYWORD'
      properties: MixPanelSearchKeywordEventProps
    }
  | {
      eventName: 'INTEROP_EXT_LINK_DTD_ESERVICE_GUIDE'
      properties: MixPanelLinkEserviceGuideAndApiCheckerEventProps
    }
  | {
      eventName: 'INTEROP_EXT_LINK_DTD_API_CHECKER'
      properties: MixPanelLinkEserviceGuideAndApiCheckerEventProps
    }
  | {
      eventName: 'INTEROP_ESERVICE_DOWNLOAD_REQUEST'
      properties: MixPanelCatalogReadAndDownloadEventProps
    }
  | {
      eventName: 'INTEROP_ESERVICE_DOWNLOAD_RESPONSE_SUCCESS'
      properties: {}
    }
  | {
      eventName: 'INTEROP_ESERVICE_DOWNLOAD_RESPONSE_ERROR'
      properties: MixPanelResponseErrorEvent
    }
  | {
      eventName: 'INTEROP_ESERVICE_UPLOAD_REQUEST'
      properties: {}
    }
  | {
      eventName: 'INTEROP_ESERVICE_UPLOAD_RESPONSE_SUCCESS'
      properties: {}
    }
  | {
      eventName: 'INTEROP_ESERVICE_UPLOAD_RESPONSE_ERROR'
      properties: MixPanelResponseErrorEvent
    }

type MixPanelCatalogReadAndDownloadEventProps = {
  eserviceId: string
  descriptorId: string
}

type MixPanelSearchKeywordEventProps = {
  q?: string
  producersId?: string[]
}

type MixPanelLinkEserviceGuideAndApiCheckerEventProps = {
  src: 'CREATE_ESERVICE'
}

type MixPanelResponseErrorEvent = {
  errorCode: number
}

const isTrackingEnabled = NODE_ENV === 'production' && STAGE === 'PROD'

const getTrackingDefaultProps = () => {
  const sessionToken = window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)
  if (sessionToken) {
    const parsedToken = parseJwt(sessionToken)

    return {
      tenantId: parsedToken.jwt?.organizationId,
      roles: parsedToken.currentRoles,
    }
  }

  return {}
}

export const { trackEvent, useTrackPageViewEvent, setMixpanelIdentifier } =
  initTracking<MixPanelEvent>({
    enabled: isTrackingEnabled,
    oneTrustScriptUrl:
      INTEROP_RESOURCES_BASE_URL + `/onetrust/oneTrust_production/scripttemplates/otSDKStub.js`,
    domainScriptUrl: ONETRUST_DOMAIN_SCRIPT_ID,
    mixpanelToken: MIXPANEL_PROJECT_ID,
    getDefaultProps: getTrackingDefaultProps,
    nonce: (window as unknown as ExtendedWindow).nonce,
  })
