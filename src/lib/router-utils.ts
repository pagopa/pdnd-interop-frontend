import { ProviderOrSubscriber } from '../../types'
import { ROUTES } from './constants'
import { includesAny } from './string-utils'

export function isParentRoute(location: any, path: string) {
  return location.pathname.indexOf(path) > -1
}

export function isRoute(location: any, path: string) {
  return location.pathname === path
}

export function isActiveTree(location: any, path: string) {
  return isRoute(location, path) || isParentRoute(location, path)
}

export function isProviderOrSubscriber(location: any): ProviderOrSubscriber | null {
  if (isParentRoute(location, ROUTES.PROVIDE.PATH) || isRoute(location, ROUTES.PROVIDE.PATH)) {
    return 'provider'
  }

  if (isParentRoute(location, ROUTES.SUBSCRIBE.PATH) || isRoute(location, ROUTES.SUBSCRIBE.PATH)) {
    return 'subscriber'
  }

  return null
}

export function isInPlatform(location: any) {
  return includesAny(location.pathname, [
    ROUTES.PROVIDE.PATH,
    ROUTES.SUBSCRIBE.PATH,
    ROUTES.PROFILE.PATH,
    ROUTES.NOTIFICATION.PATH,
    ROUTES.HELP.PATH,
  ])
}
