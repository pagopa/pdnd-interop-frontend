import { Location } from 'history'
import qs from 'query-string'

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
