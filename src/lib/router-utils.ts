import { Location } from 'history'
import identity from 'lodash/identity'
import isEmpty from 'lodash/isEmpty'
import sortBy from 'lodash/sortBy'
import QueryString from 'qs'
import qs from 'qs'
import { RouteConfig, LangCode, ProviderOrSubscriber, MappedRouteConfig } from '../../types'
import { BASIC_ROUTES } from '../config/routes'
import { DEFAULT_LANG, LANGUAGES, PUBLIC_URL, URL_FRAGMENTS } from './constants'

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

  const allSameFragments = possibleParentRoute.SPLIT_PATH.every(
    (pathFragment, i) => pathFragment === currentRoute.SPLIT_PATH[i]
  )

  const lastBit = currentRoute.SPLIT_PATH[currentRoute.SPLIT_PATH.length - 1]
  const lastFragmentIsEditPath = Object.values(URL_FRAGMENTS.EDIT).some((f) => lastBit.endsWith(f))

  // URL_FRAGMENTS.EDIT is appended at the end of a read path of the same type.
  // E.g. /eservice/myid becomes /eservice/myid/edit. So it's always same length + 1
  const isFalseParent = currentRoute.SPLIT_PATH.length === possibleParentRoute.SPLIT_PATH.length + 1

  if (allSameFragments && lastFragmentIsEditPath && isFalseParent) {
    return false
  }

  return allSameFragments
}

export function isProviderOrSubscriber(location: Location<unknown>): ProviderOrSubscriber | null {
  const excludeList = ['ui', ...Object.keys(LANGUAGES)]
  const locationBits = getBits(location).filter((b) => !excludeList.includes(b))
  const mode = locationBits[0]

  if (mode === 'erogazione') {
    return 'provider'
  }

  if (mode === 'fruizione') {
    return 'subscriber'
  }

  return null
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

export function stringifySearch(searchObj: Record<string, string> | QueryString.ParsedQs) {
  return qs.stringify(searchObj)
}

export function extractDynamicParams(
  staticPath: string,
  dynamicPath: string
): Record<string, string | number> {
  const staticSplit = staticPath.split('/')
  const dynamicSplit = dynamicPath.split('/')

  if (dynamicSplit.length !== staticSplit.length) {
    throw new Error('Not the same route')
  }

  const params = staticSplit.reduce((acc, staticParam, i) => {
    const dynamicParam = dynamicSplit[i]
    const isDynamic = staticParam !== dynamicParam
    if (isDynamic) {
      const cleanStaticParam = staticParam.replace(':', '')
      return { ...acc, [cleanStaticParam]: dynamicParam }
    }

    return acc
  }, {})

  return params
}

export function buildDynamicPath(
  staticPath: string,
  dynamicParams: Record<string, string | number | null | undefined>,
  queryParams?: Record<string, string>
) {
  let outputPath = staticPath
  if (!isEmpty(dynamicParams)) {
    outputPath = Object.keys(dynamicParams).reduce(
      (acc, key) => acc.replace(`:${key}`, String(dynamicParams[key])),
      staticPath
    )
  }

  let search = ''
  if (!isEmpty(queryParams)) {
    search = `?${stringifySearch(queryParams as Record<string, string>)}`
  }

  return `${outputPath}${search}`
}

export function buildDynamicRoute(
  route: MappedRouteConfig,
  dynamicParams: Record<string, string>,
  queryParams?: Record<string, string>
) {
  return { ...route, PATH: buildDynamicPath(route.PATH, dynamicParams, queryParams) }
}

function decorateRouteWithParents(
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

function mapRoutesToLang(routes: Record<string, RouteConfig>, langCode: LangCode) {
  const reduced = Object.keys(routes).reduce((acc, nextKey) => {
    const PATH = routes[nextKey].PATH[langCode]
    const LABEL = routes[nextKey].LABEL[langCode]
    const REDIRECT = routes[nextKey].REDIRECT
      ? (routes[nextKey].REDIRECT as Record<LangCode, string>)[langCode]
      : undefined

    const route = { [nextKey]: { ...routes[nextKey], PATH, LABEL, REDIRECT } }

    return { ...acc, ...route }
  }, {})

  return reduced
}

export function getDecoratedRoutes(): Record<LangCode, Record<string, MappedRouteConfig>> {
  return Object.keys(LANGUAGES).reduce((acc, l) => {
    const mapped = mapRoutesToLang(BASIC_ROUTES, l as LangCode)
    const decorated = decorateRouteWithParents(mapped)
    return { ...acc, [l]: decorated }
  }, {}) as Record<LangCode, Record<string, MappedRouteConfig>>
}

export function getInitialLang(): LangCode {
  const currentLocationBits = window.location.pathname.split('/')
  const cleanPublicUrl = PUBLIC_URL.split('/')
  const bitsClean = currentLocationBits.filter((b) => b && !cleanPublicUrl.includes(b))
  return (bitsClean.length > 0 ? bitsClean[0] : DEFAULT_LANG) as LangCode
}
