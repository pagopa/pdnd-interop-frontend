import axios, { AxiosRequestConfig } from 'axios'
import { ApiEndpointKey } from '../../types'
import { API, USE_LOCAL_DATA } from './constants'

export async function fetchWithLogs(
  endpoint: ApiEndpointKey,
  { method, params }: AxiosRequestConfig
) {
  let url = API[endpoint].URL
  let baseURL = API.BASE.URL

  console.log('Fetching data for', { isUsingLocalData: USE_LOCAL_DATA, endpoint, method, params })

  if (USE_LOCAL_DATA) {
    url = API[endpoint].LOCAL
    baseURL = API.BASE.LOCAL
    params = {}

    // Mock taking time for req/res round trip
    await sleep(1500)

    // Don't let POST and PATCH requests go through, they are useless
    if (!method || method !== 'GET') {
      return null
    }
  }

  try {
    return await axios.request({
      url,
      method,
      params,
      baseURL,
    })
  } catch (err) {
    console.error(err)
  }
}

export const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms))
