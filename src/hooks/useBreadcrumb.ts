import { useLocation } from 'react-router'
import { RouteConfig } from '../../types'
import { ROUTES } from '../lib/constants'

export const useBreadcrumb = () => {
  const location = useLocation()

  const getRouteFrament = (routes: Array<RouteConfig>, bits: Array<string>): Array<RouteConfig> => {
    const pathFragment = bits.shift()
    const routeInTree = Object.values(routes).find((r) => r.path === pathFragment)

    if (bits.length > 0 && routeInTree && routeInTree!.children) {
      return [routeInTree, ...getRouteFrament(Object.values(routeInTree.children!), bits)]
    }

    return routeInTree ? [routeInTree!] : []
  }

  const bits = location.pathname
    .split('/')
    .filter((b) => b)
    .map((b) => `/${b}`)

  return getRouteFrament(Object.values(ROUTES), bits)
}
