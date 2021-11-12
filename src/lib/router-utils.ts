import { Location } from 'history'
import { ProviderOrSubscriber, RouteConfig } from '../../types'
import { ROUTES } from '../config/routes'
import { includesAny } from './string-utils'
import { getBits } from './url-utils'

export function isSameRoute(location: Location<unknown>, targetRoute: RouteConfig) {
  const locationBits = getBits(location)

  const sameLength = locationBits.length === targetRoute.SPLIT_PATH.length
  if (!sameLength) {
    return false
  }

  const isSamePath = targetRoute.SPLIT_PATH.every((pathFragment, i) => {
    const isDynamicFragment = pathFragment.charAt(0) === ':'
    // If this fragment of the URL is dynamic,
    // pass the check automatically, since the two will never match
    if (isDynamicFragment) {
      return true
    }

    // Otherwise, check for equality
    return pathFragment === locationBits[i]
  })

  return isSamePath
}

export function isActiveTree(location: Location<unknown>, targetRoute: RouteConfig): boolean {
  if (targetRoute.SUBROUTES) {
    const subroutes = Object.values(targetRoute.SUBROUTES)
    return Boolean(subroutes.find((r) => isActiveTree(location, r)))
  }

  return isSameRoute(location, targetRoute)
}

export function isProviderOrSubscriber(location: Location<unknown>): ProviderOrSubscriber | null {
  const locationBits = getBits(location).filter((b) => b !== 'ui')
  const mode = locationBits[0]

  if (mode === 'erogazione') {
    return 'provider'
  }

  if (mode === 'fruizione') {
    return 'subscriber'
  }

  return null
}

export function isInPlatform(location: Location<unknown>) {
  return includesAny(location.pathname, [
    ROUTES.PROVIDE.PATH,
    ROUTES.SUBSCRIBE.PATH,
    ROUTES.PROFILE.PATH,
    ROUTES.NOTIFICATION.PATH,
    ROUTES.HELP.PATH,
  ])
}
