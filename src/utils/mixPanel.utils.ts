import mixpanel from 'mixpanel-browser'
import type { MixPanelEventName, MixPanelEvent } from '@/types/mixPanelEvents.types'

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

/**
 * Function that tracks event
 * @param eventName event name to track
 * @param nodeEnv current environment
 * @param properties event data
 */
export function trackEvent<
  TMixPanelEventName extends MixPanelEventName,
  TMixPanelProperties extends Extract<
    MixPanelEvent,
    { eventName: TMixPanelEventName }
  >['properties'],
>(
  eventName: TMixPanelEventName,
  nodeEnv: string,
  ...properties: TMixPanelProperties extends undefined ? [] : [properties: TMixPanelProperties]
): void {
  if (nodeEnv === 'test') {
    return
  } else if (!nodeEnv || nodeEnv === 'development') {
    // eslint-disable-next-line no-console
    console.log(eventName, properties)
  } else {
    // TODO possibly put in an if-condition to avoid the try/catch
    try {
      mixpanel.track(eventName, properties)
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.log('CATCH', eventName, properties, err)
    }
  }
}
