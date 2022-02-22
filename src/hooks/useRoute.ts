import { useContext } from 'react'
import { Location } from 'history'
import { MappedRouteConfig } from '../../types'
import { RoutesContext } from '../lib/context'
import { isSamePath } from '../lib/router-utils'

export const useRoute = () => {
  const { routes } = useContext(RoutesContext)

  const isRouteInTree = belongsToTree(routes)
  const isRouteProtected = isProtectedRoute(routes)
  const doesRouteAllowTwoColumnsLayout = showTwoColumnsLayout(routes)

  return { isRouteInTree, isRouteProtected, doesRouteAllowTwoColumnsLayout }
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

// Here consider the CHOOSE_PARTY route kind of like a public route, layout-wise.
// Until a Party is chosen, the user will not see the left side menu
// and will be in a transition state between out of the platform and into it
function showTwoColumnsLayout(routes: Record<string, MappedRouteConfig>) {
  return (location: Location<unknown>) => {
    return isProtectedRoute(routes)(location) && location.pathname !== routes.CHOOSE_PARTY.PATH
  }
}
