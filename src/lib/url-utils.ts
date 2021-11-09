import { Location } from 'history'
import isEmpty from 'lodash/isEmpty'
import qs from 'query-string'
import { RouteConfig, RouteConfigWithParents } from '../../types'
import { FLATTENED_ROUTES, ROUTES } from './constants'

export function getBits(location: Location): string[] {
  return location.pathname.split('/').filter((b: string) => b)
}

export function getLastBit(location: Location): string {
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
  return { ...route, path: buildDynamicPath(route.path, params) }
}

function decorateRouteWithParents(
  routes: Record<string, RouteConfigWithParents>,
  parents?: Array<RouteConfig>
): any {
  return Object.keys(routes).reduce((acc, next) => {
    const nextObj: RouteConfigWithParents = { ...routes[next] }

    if (parents && !isEmpty(parents)) {
      nextObj.parents = Array.isArray(parents) ? parents : [parents]
    }

    if (routes[next].children) {
      const parents = [...(nextObj.parents || []), routes[next]]
      nextObj.children = decorateRouteWithParents(routes[next].children!, parents)
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
    if (r.children) {
      flattenRoutes(r.children, arr)
    }
  })

  return arr
}

export const getFlattenedRoutes = () => {
  const decorated = decorateRouteWithParents(ROUTES)
  return flattenRoutes(decorated)
}

export function buildNestedUrl(currentRoute: RouteConfig) {
  const decoratedRoute = FLATTENED_ROUTES.find((r) => r.name === currentRoute.name)

  if (!decoratedRoute || !decoratedRoute.parents) {
    return currentRoute.path
  }

  return [...decoratedRoute.parents.map((r: any) => r.path), currentRoute.path].join('')
}
