import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { RequestConfig } from '../../types'
import instance from './api-interceptors-utils'
import { buildDynamicPath } from './router-utils'
import { API } from '../config/api-endpoints'
import qs from 'qs'

export async function fetchAllWithLogs(
  reqsConfig: Array<RequestConfig>
): Promise<Array<AxiosResponse | AxiosError>> {
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
  const url = buildDynamicPath(API[endpoint].URL, endpointParams || {})

  // Serialize possible arrays
  const passedConfig: AxiosRequestConfig = {
    url,
    method,
    ...(config || {}),
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  }

  try {
    return (await instance.request(passedConfig)) as T
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError
  }
}
