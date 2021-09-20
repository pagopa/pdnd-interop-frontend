import { Location } from 'history'
import qs from 'query-string'

export function getLastBit(location: Location<unknown>): string {
  const urlBits = location.pathname.split('/').filter((b: string) => b)
  return urlBits[urlBits.length - 1]
}

export function parseSearch(search: string) {
  return qs.parse(search)
}
