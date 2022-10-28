import { routes } from '@/router/routes'
import type { LangCode, ProviderOrSubscriber } from '@/types/common.types'
import type { RouteConfig, RouteKey } from '@/router/types'
import { generatePath, matchPath } from 'react-router-dom'
import { getKeys } from '@/utils/array.utils'
import memoize from 'lodash/memoize'
import identity from 'lodash/identity'
import sortBy from 'lodash/sortBy'
import { PUBLIC_URL } from '@/config/env'
import { LANGUAGES } from '@/config/constants'
import { TFunction } from 'i18next'

/** Returns the localized path of the given routeKey and language  */
export function getLocalizedRoutePathname(routeKey: RouteKey, lang: LangCode) {
  return `${PUBLIC_URL}/${lang}/${routes[routeKey].PATH[lang]}`
}

/** Checks if the routeKey represent the given pathname */
function matchRouteKeyPath(pathname: string, lang: LangCode, routeKey: RouteKey) {
  return matchPath(getLocalizedRoutePathname(routeKey as RouteKey, lang), pathname)
}

/** Returns the routeKey of the given pathname */
export const getRouteKeyFromPathname = memoize(function _getRouteKeyFromPathname(
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
        getLocalizedRoutePathname(routeKey as RouteKey, toLang),
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

export function getSplittedPath(route: RouteConfig) {
  return route.PATH.it.split('/').filter(identity)
}

export const getRouteParents = memoize((routeKey: RouteKey): Array<RouteConfig> => {
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

    const lastBit = currentSubpaths[currentSubpaths.length - 1]
    const lastFragmentIsEditPath = Object.values(URL_FRAGMENTS.EDIT).some((f) =>
      lastBit.endsWith(f)
    )

    // URL_FRAGMENTS.EDIT is appended at the end of a read path of the same type.
    // E.g. /eservice/myid becomes /eservice/myid/edit. So it's always same length + 1
    const isFalseParent = currentSubpaths.length === possibleParentRouteSubpaths.length + 1

    if (allSameFragments && lastFragmentIsEditPath && isFalseParent) {
      return false
    }

    return allSameFragments
  }

  const route = routes[routeKey]
  const currentSubpaths = getSplittedPath(route)

  const parents = Object.values(routes).filter((possibleParentRoute) =>
    isParentRoute(getSplittedPath(possibleParentRoute), currentSubpaths)
  )

  const sortedParents = sortBy(parents, (parent) => getSplittedPath(parent).length)

  return sortedParents
})

export const isProviderOrSubscriberRoute = memoize(
  (routeKey: RouteKey): ProviderOrSubscriber | null => {
    const excludeList = ['ui', 'it']
    const subroutes = getSplittedPath(routes[routeKey]).filter((b) => !excludeList.includes(b))
    const [mode] = subroutes

    if (mode === 'erogazione') {
      return 'provider'
    }

    if (mode === 'fruizione') {
      return 'subscriber'
    }

    return null
  }
)
