import { AxiosError, AxiosResponse } from 'axios'

export function isFetchError(resp: AxiosResponse | AxiosError) {
  // This typing sucks, improve it
  return (resp as AxiosError).isAxiosError
}

export function getFetchOutcome(resp: AxiosResponse | AxiosError) {
  return isFetchError(resp) ? 'error' : 'success'
}
