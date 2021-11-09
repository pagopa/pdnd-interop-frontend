import { Location } from 'history'
import { ProviderOrSubscriber } from '../../types'
import { ROUTES } from './constants'
import { includesAny } from './string-utils'

export function isParentRoute(location: Location, path: string) {
  return location.pathname.indexOf(path) > -1
}

export function isRoute(location: Location, path: string) {
  return location.pathname === path
}

export function isActiveTree(location: any, path: string) {
  return isRoute(location, path) || isParentRoute(location, path)
}

export function isProviderOrSubscriber(location: any): ProviderOrSubscriber | null {
  if (isParentRoute(location, ROUTES.provide.path) || isRoute(location, ROUTES.provide.path)) {
    return 'provider'
  }

  if (isParentRoute(location, ROUTES.subscribe.path) || isRoute(location, ROUTES.subscribe.path)) {
    return 'subscriber'
  }

  return null
}

export function isInPlatform(location: any) {
  return includesAny(location.pathname, [
    ROUTES.provide.path,
    ROUTES.subscribe.path,
    ROUTES.profile.path,
    ROUTES.notification.path,
    ROUTES.help.path,
  ])
}
