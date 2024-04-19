import { MIXPANEL_PROJECT_ID, NODE_ENV } from '@/config/env'
// import type { ExtendedWindow } from '@/types/common.types'
import { mixpanelInit } from '@/utils/mixPanel.utils'
import { useEffect } from 'react'

// declare const OneTrust: any
// declare const OnetrustActiveGroups: string
// const global = window as unknown as ExtendedWindow
// target cookies (Mixpanel)
// const targCookiesGroup = 'C0002'

/**
 * React hook that sets up Mixpanel tracking based on OneTrust consent settings.
 * It listens for changes in OneTrust consent and checks for the presence of a
 * specific cookie value to determine whether to initialize Mixpanel tracking.
 * @param {string} mixpanelToken:string
 * @param {string} nodeEnv:string
 */
export function useTracking() {
  useEffect(() => {
    // OneTrust callback at first time
    // global.OptanonWrapper = function () {
    //   OneTrust.OnConsentChanged(function () {
    //     if (OnetrustActiveGroups.indexOf(targCookiesGroup) > -1) {
    //       mixpanelInit(mixpanelToken, nodeEnv)
    //     }
    //   })
    // }
    // // // check mixpanel cookie consent in cookie
    // const OTCookieValue: string =
    //   document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || ''
    // const checkValue = `${targCookiesGroup}%3A1`

    // if (OTCookieValue.indexOf(checkValue) > -1) {
    //   mixpanelInit(mixpanelToken, nodeEnv)
    // }

    mixpanelInit(MIXPANEL_PROJECT_ID, NODE_ENV)
  }, [])
}
