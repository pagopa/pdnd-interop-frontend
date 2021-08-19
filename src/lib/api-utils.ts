import axios, { AxiosRequestConfig } from 'axios'
import { ApiEndpointKey } from '../../types'
import { logAction } from './action-log'
import { API, USE_LOCAL_DATA } from './constants'

export async function fetchWithLogs(
  endpoint: ApiEndpointKey,
  { method, params, data }: AxiosRequestConfig
) {
  if (!API[endpoint]) {
    throw new Error(`The endpoint ${endpoint} does not exist in constants.ts`)
  }

  let url = API[endpoint].URL
  let baseURL = API.BASE.URL

  logAction('Fetch data', 'API', {
    isUsingLocalData: USE_LOCAL_DATA,
    endpoint,
    baseURL,
    url,
    method,
    params,
    data,
  })

  if (USE_LOCAL_DATA) {
    url = API[endpoint].LOCAL
    baseURL = API.BASE.LOCAL
    params = {}

    // Mock taking time for req/res round trip
    await sleep(1500)

    // Don't let POST and PATCH requests go through, they are useless while mocking
    if (!method || method !== 'GET') {
      return
    }
  }

  try {
    return await axios.request({
      url,
      method,
      params,
      data,
      baseURL,
    })
  } catch (err) {
    console.error(err)
  }
}

// Utility to wait some time
export const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms))
