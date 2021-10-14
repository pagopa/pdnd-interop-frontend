import { Location } from 'history'
import { isEmpty } from 'lodash'
import qs from 'query-string'
import { RouteConfig } from '../../types'

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
    return Object.keys(params).reduce((acc, key) => acc.replace(`{{${key}}}`, params[key]), path)
  }

  return path
}

export function buildDynamicRoute(route: RouteConfig, params: { [key: string]: string }) {
  return { ...route, PATH: buildDynamicPath(route.PATH, params) }
}
