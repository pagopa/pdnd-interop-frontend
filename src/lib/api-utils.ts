import { AxiosError, AxiosResponse } from 'axios'
import { RequestConfig } from '../../types'
import { API } from './constants'
import isEmpty from 'lodash/isEmpty'
import instance from './api-interceptors-utils'

export async function fetchAllWithLogs(reqsConfig: RequestConfig[]) {
  return await Promise.all(reqsConfig.map(async (requestConfig) => await request(requestConfig)))
}

export async function fetchWithLogs(
  requestConfig: RequestConfig
): Promise<AxiosResponse<any> | AxiosError<any>> {
  return await request(requestConfig)
}

export async function request<T>(requestConfig: RequestConfig): Promise<T> {
  const {
    path: { endpoint, endpointParams },
    config,
  } = requestConfig

  const method = API[endpoint].METHOD

  let url = API[endpoint].URL
  // Replace dynamic parts of the URL by substitution
  if (!isEmpty(endpointParams)) {
    url = Object.keys(endpointParams).reduce(
      (acc, key) => acc.replace(`{{${key}}}`, endpointParams[key]),
      url
    )
  }
  return await instance.request({ url, method, ...(config || {}) })
}
