import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { Endpoint } from '../../types'
import { logAction } from './action-log'
import { API, USE_LOCAL_DATA, USE_LOCAL_DATA_RESPONSE_STATUS } from './constants'
import { testBearerToken } from './mock-static-data'
import isEmpty from 'lodash/isEmpty'

// Utility to wait some time
export const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms))

async function prepareRequest(
  { endpoint, endpointParams }: Endpoint,
  { method, params, data }: AxiosRequestConfig
) {
  if (!API[endpoint]) {
    throw new Error(`WARNING! The endpoint ${endpoint} does not exist in constants.ts`)
  }

  let url = API[endpoint].URL
  let baseURL = API.BASE.URL

  // Replace dynamic parts of the URL by substitution
  if (!isEmpty(endpointParams)) {
    url = Object.keys(endpointParams).reduce(
      (acc, key) => acc.replace(`{{${key}}}`, endpointParams[key]),
      url
    )
  }

  // In case it needs to mock data, reset all relevant variables to mock behavior
  if (USE_LOCAL_DATA) {
    url = API[endpoint].LOCAL
    baseURL = API.BASE.LOCAL
    params = {}
  }

  // Log action with updated variables, in case the call is mocked
  logAction('Prepare request', 'API', {
    isUsingLocalData: USE_LOCAL_DATA,
    endpoint,
    baseURL,
    url,
    method,
    params,
    data,
  })

  // Return the instance of the request, ready to be sent
  return axios.request({
    url,
    method,
    params,
    data,
    baseURL,
    headers: { Authorization: `Bearer ${testBearerToken}` },
  })
}

async function performRequests(requests: Promise<AxiosInstance>[], method?: Method): Promise<any> {
  if (USE_LOCAL_DATA) {
    // Mock taking time for req/res round trip
    await sleep(750)

    // Don't let POST and PATCH requests go through, they are useless while mocking
    if (!method || method !== 'GET') {
      // Return the status code so to test handling error case scenarios
      const mockResponse = { status: USE_LOCAL_DATA_RESPONSE_STATUS } as AxiosResponse
      logAction('Log response', 'API', mockResponse)
      return [mockResponse]
    }
  }

  try {
    const responses = await axios.all(requests)
    logAction('Log response', 'API', responses)
    return responses as unknown as AxiosResponse[] // WHYYYYY?
  } catch (error) {
    console.error(error)
    // return { status: 404 } as AxiosResponse // This is for testing
  }
}

type RequestConfig = {
  path: Endpoint
  config: AxiosRequestConfig
}

export async function fetchAllWithLogs(reqsConfig: RequestConfig[]) {
  const requests = await Promise.all(
    reqsConfig.map(async ({ path, config }) => await prepareRequest(path, config))
  )
  return await performRequests(requests as any, reqsConfig[0].config.method)
}

export async function fetchWithLogs(
  { endpoint, endpointParams }: Endpoint,
  { method, params, data }: AxiosRequestConfig
) {
  // Prepare the request
  const request = await prepareRequest({ endpoint, endpointParams }, { method, params, data })
  const responses = await performRequests([request as any], method)
  return responses[0]
}
