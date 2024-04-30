import { useTrackingConsent } from '@/stores/tracking.store'
import type { MixPanelEvent, MixPanelEventName } from '@/types/mixPanelEvents.types'

export function useMixPanel() {
  const areCookieAccepted = useTrackingConsent()

  /**
   * Function that tracks event
   * @param isPageFirstRender Ref to check if it's the first render
   * @param eventName event name to track
   * @param properties event data
   */
  function trackPageView<
    TMixPanelEventName extends MixPanelEventName,
    TMixPanelProperties extends Extract<
      MixPanelEvent,
      { eventName: TMixPanelEventName }
    >['properties'],
  >(
    isPageFirstRender: React.MutableRefObject<boolean>,
    eventName: TMixPanelEventName,
    ...properties: TMixPanelProperties extends undefined ? [] : [properties: TMixPanelProperties]
  ): void {
    if (!isPageFirstRender) return

    if (areCookieAccepted) {
      try {
        // mixpanel.track_pageview(properties, { event_name: eventName })
        console.log('Ho accettato i cookie, tracko il pageView:', eventName, properties)
        isPageFirstRender.current = false
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.log('CATCH', eventName, properties, err)
      }
    }
  }

  /**
   * Function that tracks event
   * @param eventName event name to track
   * @param nodeEnv current environment
   * @param properties event data
   */
  function trackEvent<
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
    }

    if (!nodeEnv || nodeEnv === 'development') {
      // eslint-disable-next-line no-console
      console.log(eventName, properties)
    }

    if (areCookieAccepted) {
      try {
        // mixpanel.track(eventName, properties)
        console.log("Ho accettato i cookie, tracko l'evento:", eventName, properties)
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.log('CATCH', eventName, properties, err)
      }
    }
  }

  return {
    areCookieAccepted,
    trackPageView,
    trackEvent,
  }
}
