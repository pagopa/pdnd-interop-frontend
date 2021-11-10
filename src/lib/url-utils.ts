import { Location } from 'history'
import identity from 'lodash/identity'
import isEmpty from 'lodash/isEmpty'
import qs from 'query-string'
import { RouteConfig } from '../../types'

export function getBits(location: Location<unknown>): string[] {
  return location.pathname.split('/').filter(identity)
}

export function getLastBit(location: Location<unknown>): string {
  const urlBits = getBits(location)
  return urlBits[urlBits.length - 1]
}

export function parseSearch(search: string) {
  return qs.parse(search)
}

export function buildDynamicPath(path: string, params: { [key: string]: string }) {
  if (!isEmpty(params)) {
    return Object.keys(params).reduce((acc, key) => acc.replace(`:${key}`, params[key]), path)
  }

  return path
}

export function buildDynamicRoute(route: RouteConfig, params: { [key: string]: string }) {
  return { ...route, PATH: buildDynamicPath(route.PATH, params) }
}

export function decorateRouteWithParents(
  routes: Record<string, RouteConfig>,
  parents?: Array<RouteConfig>
): Record<string, RouteConfig> {
  return Object.keys(routes).reduce((acc, next) => {
    const nextObj = {
      ...routes[next],
      SPLIT_PATH: routes[next].PATH.split('/').filter(identity),
    }

    // Add parents to this route
    if (parents && !isEmpty(parents)) {
      nextObj.PARENTS = parents
    }

    // Add parents to subroutes of this route
    if (nextObj.SUBROUTES) {
      const parents = [...(nextObj.PARENTS || []), { ...nextObj }]
      nextObj.SUBROUTES = decorateRouteWithParents(nextObj.SUBROUTES!, parents)
    }

    return { ...acc, [next]: nextObj }
  }, {})
}

export function flattenRoutes(routes: Record<string, RouteConfig>, arr: Array<RouteConfig> = []) {
  const routesArr = Object.values(routes)

  routesArr.forEach((r: any) => {
    arr.push(r)
    if (r.SUBROUTES) {
      flattenRoutes(r.SUBROUTES, arr)
    }
  })

  return arr
}
