import { Location } from 'history'
import identity from 'lodash/identity'
import isEmpty from 'lodash/isEmpty'
import sortBy from 'lodash/sortBy'
import qs from 'qs'
import {
  RouteConfig,
  Lang,
  ProviderOrSubscriber,
  MappedRouteConfig,
  LangKeyedValue,
} from '../../types'

export function belongsToTree(
  routes: Record<string, MappedRouteConfig>,
  location: Location<unknown>,
  route: MappedRouteConfig
) {
  // Find the actual route in the router
  const currentRoute = Object.values(routes).find((r) => isSamePath(location.pathname, r.PATH))
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

export function isParentRoute(
  possibleParentRoute: MappedRouteConfig,
  currentRoute: MappedRouteConfig
) {
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

export function isProtectedRoute(
  routes: Record<string, MappedRouteConfig>,
  location: Location<unknown>
) {
  const whitelist = Object.values(routes).filter((r) => r.PUBLIC)
  const isWhitelistedPage = whitelist.map((r) => r.PATH).includes(location.pathname)
  return !isWhitelistedPage
}

// Here consider the CHOOSE_PARTY route kind of like a public route, layout-wise.
// Until a Party is chosen, the user will not see the left side menu
// and will be in a transition state between out of the platform and into it
export function showPlatformTwoColumnsLayout(
  routes: Record<string, MappedRouteConfig>,
  location: Location<unknown>
) {
  return isProtectedRoute(routes, location) && location.pathname !== routes.CHOOSE_PARTY.PATH
}

export function getBits(location: Location<unknown>): Array<string> {
  return location.pathname.split('/').filter(identity)
}

export function getLastBit(location: Location<unknown>): string {
  const urlBits = getBits(location)
  return urlBits[urlBits.length - 1]
}

export function parseSearch(search: string) {
  return qs.parse(search, { ignoreQueryPrefix: true })
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

export function buildDynamicRoute(route: MappedRouteConfig, params: Record<string, string>) {
  return { ...route, PATH: buildDynamicPath(route.PATH, params) }
}

export function decorateRouteWithParents(
  routes: Record<string, MappedRouteConfig>
): Record<string, MappedRouteConfig> {
  const withSplitPath: Record<string, MappedRouteConfig & { SPLIT_PATH: string[] }> = Object.keys(
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

export function mapRoutesToLang(routes: Record<string, RouteConfig>, lang: Lang) {
  const reduced = Object.keys(routes).reduce((acc, nextKey) => {
    const PATH = routes[nextKey].PATH[lang]
    const LABEL = routes[nextKey].LABEL[lang]
    const REDIRECT = routes[nextKey].REDIRECT
      ? (routes[nextKey].REDIRECT as LangKeyedValue)[lang]
      : undefined

    const route = { [nextKey]: { ...routes[nextKey], PATH, LABEL, REDIRECT } }

    return { ...acc, ...route }
  }, {})

  return reduced
}
