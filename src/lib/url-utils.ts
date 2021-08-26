import { Location } from 'history'

export function getLastBit(location: Location<unknown>): string {
  const urlBits = location.pathname.split('/').filter((b: string) => b)
  return urlBits[urlBits.length - 1]
}
