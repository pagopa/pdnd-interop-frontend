import { AxiosError, AxiosResponse } from 'axios'
import { RequestConfig } from '../../types'
import instance from './api-interceptors-utils'
import { buildDynamicPath } from './router-utils'
import { logError } from './action-log'
import { API } from '../config/api-endpoints'

export async function fetchAllWithLogs(reqsConfig: RequestConfig[]) {
  return await Promise.all(reqsConfig.map(async (requestConfig) => await request(requestConfig)))
}

export async function fetchWithLogs(
  requestConfig: RequestConfig
): Promise<AxiosResponse | AxiosError> {
  return await request(requestConfig)
}

export async function request<T>(requestConfig: RequestConfig): Promise<T | AxiosError> {
  const {
    path: { endpoint, endpointParams },
    config,
  } = requestConfig

  const method = API[endpoint].METHOD

  // Replace dynamic parts of the URL by substitution
  const url = buildDynamicPath(API[endpoint].URL, endpointParams)

  try {
    return await instance.request({ url, method, ...(config || {}) })
  } catch (error) {
    logError(error)
    return error as AxiosError
  }
}
