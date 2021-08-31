import { AxiosResponse } from 'axios'

export function isFetchError(resp: AxiosResponse) {
  return resp.status < 200 || resp.status >= 300
}
