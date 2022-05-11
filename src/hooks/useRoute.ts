import { useContext, useMemo } from 'react'
import { Location } from 'history'
import { MappedRouteConfig } from '../../types'
import { LangContext, RoutesContext } from '../lib/context'
import { isSamePath } from '../lib/router-utils'

export const useRoute = () => {
  const { allRoutes } = useContext(RoutesContext)
  const { lang } = useContext(LangContext)

  const routes = useMemo(() => allRoutes[lang], [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const isRouteInTree = belongsToTree(routes)
  const isRouteProtected = isProtectedRoute(routes)
  const doesRouteAllowTwoColumnsLayout = showTwoColumnsLayout(routes)

  return { isRouteInTree, isRouteProtected, doesRouteAllowTwoColumnsLayout, routes }
}

function belongsToTree(routes: Record<string, MappedRouteConfig>) {
  return (location: Location<unknown>, route: MappedRouteConfig) => {
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
}

function isProtectedRoute(routes: Record<string, MappedRouteConfig>) {
  return (location: Location<unknown>) => {
    const whitelist = Object.values(routes).filter((r) => r.PUBLIC)
    const isWhitelistedPage = whitelist.map((r) => r.PATH).includes(location.pathname)
    return !isWhitelistedPage
  }
}

// Here consider the routes in the excludeList kind of like public routes, layout-wise.
// Until a Party is chosen, the user will not see the left side menu
// and will be in a transition state between out of the platform and into it
function showTwoColumnsLayout(routes: Record<string, MappedRouteConfig>) {
  return (location: Location<unknown>) => {
    const excludeList = [routes.CHOOSE_PARTY.PATH, routes.UNAUTHORIZED.PATH]

    return isProtectedRoute(routes)(location) && !excludeList.includes(location.pathname)
  }
}
