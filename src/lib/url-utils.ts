import { Location } from 'history'
import { isEmpty } from 'lodash'
import qs from 'query-string'
import { RouteConfig, RouteConfigWithParents } from '../../types'
import { ROUTES } from './constants'

export function getBits(location: Location<unknown>): string[] {
  return location.pathname.split('/').filter((b: string) => b)
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

function decorateRouteWithParents(
  routes: Record<string, RouteConfigWithParents>,
  parents?: Array<RouteConfig>
): any {
  return Object.keys(routes).reduce((acc, next) => {
    const nextObj: RouteConfigWithParents = { ...routes[next] }

    if (parents && !isEmpty(parents)) {
      nextObj.PARENTS = Array.isArray(parents) ? parents : [parents]
    }

    if (routes[next].SUBROUTES) {
      const parents = [...(nextObj.PARENTS || []), routes[next]]
      nextObj.SUBROUTES = decorateRouteWithParents(routes[next].SUBROUTES!, parents)
    }

    return { ...acc, [next]: nextObj }
  }, {})
}

function flattenRoutes(
  routes: Record<string, RouteConfigWithParents>,
  arr: Array<RouteConfigWithParents> = []
) {
  const routesArr = Object.values(routes)

  routesArr.forEach((r: any) => {
    arr.push(r)
    if (r.SUBROUTES) {
      flattenRoutes(r.SUBROUTES, arr)
    }
  })

  return arr
}

export const getFlattenedRoutes = () => {
  const decorated = decorateRouteWithParents(ROUTES)
  return flattenRoutes(decorated)
}
