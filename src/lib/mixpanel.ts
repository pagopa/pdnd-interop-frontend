import { init, track, Mixpanel } from 'mixpanel-browser'
import { isDevelopment, MIXPANEL_PROJECT_ID } from './env'

export const mixpanelInit = function (): void {
  if (isDevelopment) {
    console.log('Mixpanel events mock on console log.')
  } else {
    init(MIXPANEL_PROJECT_ID, {
      api_host: 'https://api-eu.mixpanel.com',
      persistence: 'localStorage',
      ip: false,
      property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
      loaded(mixpanel: Mixpanel) {
        // This is useful to obtain a new distinct_id every session
        mixpanel.reset()
      },
      debug: true,
    })
  }
}

export const mixpanel = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  track(event_name: string, properties?: any): void {
    if (isDevelopment) {
      console.log(event_name, properties)
    } else {
      try {
        track(event_name, properties)
      } catch (_) {
        console.log(event_name, properties)
      }
    }
  },
}
