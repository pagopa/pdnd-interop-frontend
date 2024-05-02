import mixpanel from 'mixpanel-browser'
import { MIXPANEL_PROJECT_ID, NODE_ENV } from '@/config/env'
import type { ExtendedWindow } from '@/types/common.types'
import { useTrackingStore } from '@/stores/tracking.store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const OneTrust: any
declare const OnetrustActiveGroups: string
const global = window as unknown as ExtendedWindow
// target cookies (Mixpanel)
const targCookiesGroup = 'C0002'

/**
 * React hook that sets up Mixpanel tracking based on OneTrust consent settings.
 * It listens for changes in OneTrust consent and checks for the presence of a
 * specific cookie value to determine whether to initialize Mixpanel tracking.
 */
export function setupTracking() {
  // OneTrust callback at first time
  global.OptanonWrapper = function () {
    OneTrust.OnConsentChanged(function () {
      if (OnetrustActiveGroups.indexOf(targCookiesGroup) > -1) {
        // TODO vedere che forse questo cambiamento viene fatto troppo presto e mixpanel non è ancora inizializzato
        mixpanelInit(MIXPANEL_PROJECT_ID, NODE_ENV)
        useTrackingStore.setState({ areCookiesAccepted: true }, true)
      }
    })
  }
  // check mixpanel cookie consent in cookie
  const OTCookieValue: string =
    document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || ''
  const checkValue = `${targCookiesGroup}%3A1`

  if (OTCookieValue.indexOf(checkValue) > -1) {
    // TODO vedere che forse questo cambiamento viene fatto troppo presto e mixpanel non è ancora inizializzato
    mixpanelInit(MIXPANEL_PROJECT_ID, NODE_ENV)
    useTrackingStore.setState({ areCookiesAccepted: true }, true)
  }
}

/**
 * Function that initialize Mixpanel (must be called once)
 */
export function mixpanelInit(mixpanelToken: string, nodeEnv: string): void {
  if (!nodeEnv || nodeEnv === 'development') {
    // eslint-disable-next-line no-console
    console.log('Mixpanel events mock on console log.')
  } else if (nodeEnv === 'test') {
    return
  } else {
    console.log('MixPanel events initialized.')
    mixpanel.init(mixpanelToken, {
      api_host: 'https://api-eu.mixpanel.com',
      persistence: 'localStorage',
      // if this is true, Mixpanel will automatically determine
      // City, Region and Country data using the IP address of
      // the client
      ip: false,
      // names of properties/superproperties which should never
      // be sent with track() calls
      property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
      debug: true,
      // function called after mixpanel has finished loading

      // prop to track every page view
      // track_pageview: 'full-url',
    })
    mixpanel.identify(mixpanel.get_distinct_id())
  }
}
