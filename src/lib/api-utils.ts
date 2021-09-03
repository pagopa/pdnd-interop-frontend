import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { ApiEndpointKey, Endpoint, RequestConfig } from '../../types'
import { logAction, logError } from './action-log'
import { API, USE_LOCAL_DATA, USE_LOCAL_DATA_RESPONSE_STATUS } from './constants'
import { testBearerToken } from './mock-static-data'
import isEmpty from 'lodash/isEmpty'

// Utility to wait some time
export const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms))

function prepareRequest(
  { endpoint, endpointParams }: Endpoint,
  { method, params, data, headers }: AxiosRequestConfig
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
  if (USE_LOCAL_DATA || !API[endpoint].SHOULD_CALL) {
    url = API[endpoint].LOCAL
    baseURL = API.BASE.LOCAL
    params = {}
  }

  // Log action with updated variables, in case the call is mocked
  logAction('Prepare request', 'API', {
    isMockingRequest: USE_LOCAL_DATA || !API[endpoint].SHOULD_CALL,
    endpoint,
    baseURL,
    url,
    headers,
    method,
    params,
    data,
  })

  // Avoid mock POST and PATCH requests creation
  if (USE_LOCAL_DATA || !API[endpoint].SHOULD_CALL) {
    if (!method || method !== 'GET') {
      return
    }
  }

  // Return the instance of the request, ready to be sent
  return () =>
    axios.request({
      url,
      method,
      params,
      data,
      baseURL,
      headers: { ...headers, Authorization: `Bearer ${testBearerToken}` },
    })
}

async function performRequests(
  requests: (() => Promise<AxiosInstance>)[],
  endpoint: ApiEndpointKey,
  method?: Method
): Promise<AxiosResponse[] | AxiosError[]> {
  if (USE_LOCAL_DATA || !API[endpoint].SHOULD_CALL) {
    // Mock taking time for req/res round trip
    await sleep(750)

    // Don't let POST and PATCH requests go through, they are useless while mocking
    // Give back mock response code instead
    if (!method || method !== 'GET') {
      // Return the status code so to test handling error case scenarios
      const mockResponse = { status: USE_LOCAL_DATA_RESPONSE_STATUS } as AxiosResponse
      logAction('Log response', 'API', mockResponse)
      return [mockResponse]
    }
  }

  try {
    const responses = await axios.all(requests.map((r) => r()))
    logAction('Log response', 'API', responses)
    return responses as unknown as AxiosResponse[] // WHYYYYY?
  } catch (error) {
    logError(error)
    return [error] as AxiosError[] // This is for testing
  }
}

export async function fetchAllWithLogs(reqsConfig: RequestConfig[]) {
  const requests = await Promise.all(
    reqsConfig.map(async ({ path, config }) => await prepareRequest(path, config))
  )
  return await performRequests(
    requests as any,
    reqsConfig[0].path.endpoint,
    reqsConfig[0].config.method
  )
}

export async function fetchWithLogs(
  { endpoint, endpointParams }: Endpoint,
  { method, params, data, headers }: AxiosRequestConfig
) {
  // Prepare the request
  const request = await prepareRequest(
    { endpoint, endpointParams },
    { method, params, data, headers }
  )
  const responses = await performRequests([request as any], endpoint, method)
  return responses[0]
}
