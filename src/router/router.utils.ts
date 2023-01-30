import { routes } from '@/router/routes'
import type { LangCode, ProviderOrConsumer } from '@/types/common.types'
import type { LocalizedRoutes, RouteKey } from '@/router/router.types'
import { generatePath, matchPath } from 'react-router-dom'
import { getKeys } from '@/utils/array.utils'
import memoize from 'lodash/memoize'
import identity from 'lodash/identity'
import sortBy from 'lodash/sortBy'
import { PUBLIC_URL } from '@/config/env'
import isEqual from 'lodash/isEqual'

/** Returns the localized path of the given routeKey and language  */
export function getLocalizedPath(routeKey: RouteKey, lang: LangCode) {
  return `${PUBLIC_URL}/${lang}/${routes[routeKey].PATH[lang]}`
}

/** Checks if the routeKey represent the given pathname */
function matchRouteKeyPath(pathname: string, lang: LangCode, routeKey: RouteKey) {
  return matchPath(getLocalizedPath(routeKey as RouteKey, lang), pathname)
}

/** Returns the routeKey of the given pathname */
export const getRouteKeyFromPath = memoize(function _getRouteKeyFromPath(
  pathname: string,
  lang: LangCode
) {
  let pathnameWithBaseUrl = pathname
  if (!pathnameWithBaseUrl.startsWith(PUBLIC_URL)) {
    pathnameWithBaseUrl = PUBLIC_URL + pathnameWithBaseUrl
  }
  const isTheRouteKeyPath = matchRouteKeyPath.bind(null, pathnameWithBaseUrl, lang)
  const routeKey = getKeys(routes).find(isTheRouteKeyPath)

  if (!routeKey) {
    throw new Error(`Pathname ${pathnameWithBaseUrl} has no associated routeKey.`)
  }

  return routeKey
})

export function switchPathLang(fromLang: LangCode, toLang: LangCode) {
  for (const routeKey of Object.keys(routes)) {
    const match = matchRouteKeyPath(window.location.pathname, fromLang, routeKey as RouteKey)

    if (match) {
      let newPath = generatePath(
        getLocalizedPath(routeKey as RouteKey, toLang),
        match.params as Record<string, string>
      )

      if (window.location.search) {
        newPath += window.location.search
      }

      if (window.location.hash) {
        newPath += window.location.hash
      }

      window.location.replace(newPath)
      return
    }
  }
}

export const URL_FRAGMENTS: Record<string, Record<LangCode, string>> = {
  FIRST_DRAFT: { it: 'prima-bozza', en: 'first-draft' },
  EDIT: { it: 'modifica', en: 'bozza' },
}

export function getPathSegments(path: string) {
  return path.split('/').filter(identity)
}

export const getParentRoutes = memoize((routeKey: RouteKey): Array<RouteKey> => {
  function isParentRoute(
    possibleParentRouteSubpaths: Array<string>,
    currentSubpaths: Array<string>
  ) {
    if (possibleParentRouteSubpaths.length >= currentSubpaths.length) {
      return false
    }

    const allSameFragments = possibleParentRouteSubpaths.every(
      (pathFragment, i) => pathFragment === currentSubpaths[i]
    )

    // URL_FRAGMENTS.EDIT is appended at the end of a read path of the same type.
    // E.g. /eservice/myid becomes /eservice/myid/edit. So it's always same length + 1
    const isFalseParent = currentSubpaths.length === possibleParentRouteSubpaths.length + 1

    if (allSameFragments && isEditPath(routeKey) && isFalseParent) {
      return false
    }

    return allSameFragments
  }

  const route = routes[routeKey]
  const currentSubpaths = getPathSegments(route.PATH.it)

  const parents = Object.entries(routes).filter(([_, possibleParentRoute]) =>
    isParentRoute(getPathSegments(possibleParentRoute.PATH.it), currentSubpaths)
  )

  const sortedParents = sortBy(parents, ([_, parent]) => getPathSegments(parent.PATH.it).length)

  return sortedParents.map(([routeKey]) => routeKey) as Array<RouteKey>
})

export const isProviderOrConsumerRoute = memoize(
  (routeKey: RouteKey): ProviderOrConsumer | null => {
    const excludeList = ['ui', 'it']
    const subroutes = getPathSegments(routes[routeKey].PATH.it).filter(
      (b) => !excludeList.includes(b)
    )
    const [mode] = subroutes

    if (mode === 'erogazione') {
      return 'provider'
    }

    if (mode === 'fruizione') {
      return 'consumer'
    }

    return null
  }
)

export const isEditPath = memoize((routeKey: RouteKey): boolean => {
  const subroutes = getPathSegments(routes[routeKey].PATH.it)

  const lastBit = subroutes[subroutes.length - 1]
  return Object.values(URL_FRAGMENTS.EDIT).some((f) => lastBit.endsWith(f))
})

const _getDynamicSegmentsFromPath = memoize((path: string) => {
  return path
    .split('/')
    .filter(identity)
    .filter((subpath) => subpath.startsWith(':'))
    .map((param) => param.replace(':', ''))
})

/**
 * Returns an array with all the dynamic path names for a given RouteKey
 * @example
 * "/:foo/test/:bar" => ["foo", "bar"]
 */
export const getDynamicPathSegments = memoize((routeKey: RouteKey) => {
  return _getDynamicSegmentsFromPath(routes[routeKey].PATH.it)
})

/**
 * For each language path in a LocalizedRoute, the dynamic path segments must be equal.
 * This function does a runtime check and throws if this requirement is not met for any of the implemented LocalizedRoute.
 * Optionally accepts a LocalizedRoutes object as argument for testing purposes.
 *
 * @example Okkay!
 *
 * ```json
 * {
 *    "it": "/:foo/route-italiana/:bar",
 *    "en": "/:foo/english-route/:bar",
 * }
 * ```
 *
 * @example Not okkay!
 * ```json
 * {
 *    "it": "/:foo/route-italiana/:bar",
 *    "en": "/:baz/english-route/:foo",
 * }
 * ```
 *
 */
export const checkLocalizedPathsConsistency = (_routes: LocalizedRoutes = routes) => {
  getKeys(_routes).forEach((routeKey) => {
    const paths = Object.values(_routes[routeKey].PATH)
    const firstPathDynamicSegments = _getDynamicSegmentsFromPath(paths[0])
    const firstPathSegmentNumber = getPathSegments(paths[0])

    const areLocalizedPathsConsistent = paths.every(
      (path) =>
        isEqual(_getDynamicSegmentsFromPath(path), firstPathDynamicSegments) &&
        isEqual(getPathSegments(path).length, firstPathSegmentNumber.length)
    )

    if (!areLocalizedPathsConsistent)
      throw new Error(
        `All the dynamic path segments for all the localized path (in the PATH property) must be equal. Check the ${routeKey} paths.`
      )
  })
}
