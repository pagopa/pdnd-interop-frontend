import { Location } from 'history'
import identity from 'lodash/identity'
import isEmpty from 'lodash/isEmpty'
import sortBy from 'lodash/sortBy'
import qs from 'query-string'
import { ProviderOrSubscriber, RouteConfig } from '../../types'
import { ROUTES } from '../config/routes'
import { includesAny } from './string-utils'

export function belongsToTree(location: Location<unknown>, route: RouteConfig) {
  // Find the actual route in the router
  const currentRoute = Object.values(ROUTES).find((r) => isSamePath(location.pathname, r.PATH))
  // If no route, end it here
  if (!currentRoute) {
    return false
  }
  // Put together all routes that match the prerequisite,
  // aka, belonging to the tree of the current location.pathname
  const matches = [...(currentRoute.PARENTS || []), currentRoute]
  // If there is at least one match, this route is in the tree of the current location
  return matches.some((r) => isSamePath(route.PATH, r.PATH))
}

export function isSamePath(path: string, matchPath: string) {
  const pathBits = path.split('/')
  const matchPathBits = matchPath.split('/')

  const sameLength = pathBits.length === matchPathBits.length
  if (!sameLength) {
    return false
  }

  const isSamePath = matchPathBits.every((pathFragment, i) => {
    const isDynamicFragment = pathFragment.charAt(0) === ':'
    // If this fragment of the URL is dynamic,
    // pass the check automatically, since the two will never match
    if (isDynamicFragment) {
      return true
    }

    // Otherwise, check for equality
    return pathFragment === pathBits[i]
  })

  return isSamePath
}

export function isParentRoute(possibleParentRoute: RouteConfig, currentRoute: RouteConfig) {
  if (possibleParentRoute.SPLIT_PATH.length >= currentRoute.SPLIT_PATH.length) {
    return false
  }

  return possibleParentRoute.SPLIT_PATH.every(
    (pathFragment, i) => pathFragment === currentRoute.SPLIT_PATH[i]
  )
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

export function getBits(location: Location<unknown>): Array<string> {
  return location.pathname.split('/').filter(identity)
}

export function getLastBit(location: Location<unknown>): string {
  const urlBits = getBits(location)
  return urlBits[urlBits.length - 1]
}

export function parseSearch(search: string) {
  return qs.parse(search)
}

export function buildDynamicPath(
  path: string,
  params: Record<string, string | number | null | undefined>
) {
  if (!isEmpty(params)) {
    return Object.keys(params).reduce(
      (acc, key) => acc.replace(`:${key}`, String(params[key])),
      path
    )
  }

  return path
}

export function buildDynamicRoute(route: RouteConfig, params: Record<string, string>) {
  return { ...route, PATH: buildDynamicPath(route.PATH, params) }
}

export function decorateRouteWithParents(
  routes: Record<string, RouteConfig>
): Record<string, RouteConfig> {
  const withSplitPath: Record<string, RouteConfig & { SPLIT_PATH: string[] }> = Object.keys(
    routes
  ).reduce((acc, next) => {
    const currentRoute = routes[next]

    const splitPath = currentRoute.PATH.split('/').filter(identity)

    return { ...acc, [next]: { ...currentRoute, SPLIT_PATH: splitPath } }
  }, {})

  const withParents = Object.keys(withSplitPath).reduce((acc, next) => {
    const currentRoute = withSplitPath[next]

    const parents = Object.values(withSplitPath).filter((possibleParentRoute) =>
      isParentRoute(possibleParentRoute, currentRoute)
    )
    const sortedParents = sortBy(parents, (p) => p.SPLIT_PATH.length)

    return { ...acc, [next]: { ...currentRoute, PARENTS: sortedParents } }
  }, {})

  return withParents
}
