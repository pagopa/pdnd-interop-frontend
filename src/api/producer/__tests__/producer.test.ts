import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, type AxiosAdapter } from 'axios'
import { QueryClient, QueryObserver } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { NotFoundError, UnauthorizedError } from '@/utils/errors.utils'
import type {
  GetProducerDashboardConsumerParams,
  GetProducerDashboardConsumersParams,
  GetProducerDashboardSaturationParams,
  MonitoringArchiving,
  ProducerDashboard,
  ProducerDashboardConsumer,
  ProducerDashboardConsumers,
  ProducerDashboardSaturation,
} from '@/api/api.generatedTypes'
import { ProducerQueries, ProducerServices } from '..'

const dashboard: ProducerDashboard = {
  eservices: {
    total: 97,
    published: 31,
    suspended: 7,
    archiving: 5,
    archivingSuspended: 2,
  },
  pendingAgreements: 13,
  waitingForApprovalPurposes: 29,
  activeAgreements: 14321,
  alignment: {
    aligned: 11001,
    agreementWithoutPurposes: 2202,
    purposesWithoutAgreement: 303,
  },
  averageActivePurposesPerEService: 4.7,
}

// Keep the real service, query options, Axios instance and interceptors.
// Only replace the transport: no live backend or new error contract is needed.
const originalAdapter = axiosInstance.defaults.adapter
const originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')!
const adapter = vi.fn<AxiosAdapter>()
let queryClient: QueryClient

function respondWith(data: ProducerDashboard | ProducerDashboardConsumer) {
  adapter.mockImplementation(async (config) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }))
}

function rejectWithStatus(status: number) {
  const error = new AxiosError('Dashboard request failed', AxiosError.ERR_BAD_RESPONSE)
  adapter.mockImplementation(async (config) => {
    error.config = config
    error.response = {
      data: undefined,
      status,
      statusText: 'Request failed',
      headers: {},
      config,
    }
    throw error
  })
  return error
}

const detailParams: GetProducerDashboardConsumerParams = {
  consumerId: '00000000-0000-4000-8000-000000000013',
  offset: 10,
  limit: 5,
  q: 'Catasto',
  sortBy: 'DAILY_CALLS_DESC',
}
const detailResponse: ProducerDashboardConsumer = {
  consumer: { id: detailParams.consumerId, name: 'Regione Lombardia', kind: 'PA' },
  eservicesCount: 15,
  results: [],
  pagination: { offset: 10, limit: 5, totalCount: 1 },
}

describe('producer consumer detail service and query', () => {
  it.each(['NAME_ASC', 'NAME_DESC', 'DAILY_CALLS_DESC', 'DAILY_CALLS_ASC'] as const)(
    'uses the exact consumer path and only query parameters for %s',
    async (sortBy) => {
      respondWith(detailResponse)
      const params = { ...detailParams, sortBy }
      expect(await ProducerServices.getDashboardConsumer(params)).toBe(detailResponse)
      expect(adapter.mock.calls[0][0]).toMatchObject({
        method: 'get',
        url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/consumers/${params.consumerId}`,
        params: { offset: 10, limit: 5, q: 'Catasto', sortBy },
      })
      expect(adapter.mock.calls[0][0].params).not.toHaveProperty('consumerId')
      expect(adapter.mock.calls[0][0].data).toBeUndefined()
      expect(params).toEqual({ ...detailParams, sortBy })
    }
  )

  it('accepts required paging only and preserves an absent consumer with zero totals', async () => {
    const empty: ProducerDashboardConsumer = {
      eservicesCount: 0,
      results: [],
      pagination: { offset: 0, limit: 10, totalCount: 0 },
    }
    respondWith(empty)
    expect(
      await ProducerServices.getDashboardConsumer({
        consumerId: 'unknown',
        offset: 0,
        limit: 10,
      })
    ).toBe(empty)
    expect(adapter.mock.calls[0][0].params).toEqual({ offset: 0, limit: 10 })
  })

  it.each([undefined, 503, 401, 404])(
    'exposes real-mode errors without a fixture fallback (status %s)',
    async (status) => {
      const error = status
        ? rejectWithStatus(status)
        : new AxiosError('Network Error', AxiosError.ERR_NETWORK)
      if (!status) adapter.mockRejectedValue(error)
      const options = ProducerQueries.getDashboardConsumer(detailParams)
      const request = queryClient.fetchQuery(options)
      if (status === 401) await expect(request).rejects.toBeInstanceOf(UnauthorizedError)
      else if (status === 404) await expect(request).rejects.toBeInstanceOf(NotFoundError)
      else await expect(request).rejects.toBe(error)
      expect(queryClient.getQueryData(options.queryKey)).toBeUndefined()
      expect(queryClient.getQueryState(options.queryKey)?.status).toBe('error')
      expect(adapter).toHaveBeenCalledTimes(1)
    }
  )

  it('isolates identities, paging, filter and sort from each other and list/aggregate caches', async () => {
    const variants: GetProducerDashboardConsumerParams[] = [
      detailParams,
      { ...detailParams, consumerId: 'another-consumer' },
      { ...detailParams, offset: 0 },
      { ...detailParams, limit: 20 },
      { ...detailParams, q: 'Anagrafe' },
      { ...detailParams, sortBy: 'NAME_ASC' },
    ]
    for (const [index, params] of variants.entries()) {
      const response = { ...detailResponse, eservicesCount: index }
      respondWith(response)
      const options = ProducerQueries.getDashboardConsumer(params)
      expect(options.queryKey).toEqual(['ProducerGetDashboardConsumer', params])
      expect(options).not.toHaveProperty('refetchInterval')
      expect(await queryClient.fetchQuery(options)).toBe(response)
    }
    expect(queryClient.getQueryCache().getAll()).toHaveLength(variants.length)
    variants.forEach((params, index) => {
      expect(
        queryClient.getQueryData(ProducerQueries.getDashboardConsumer(params).queryKey)
      ).toMatchObject({ eservicesCount: index })
    })
    expect(queryClient.getQueryData(ProducerQueries.getDashboard().queryKey)).toBeUndefined()
    expect(
      queryClient.getQueryData(
        ProducerQueries.getDashboardConsumers({ offset: 0, limit: 10 }).queryKey
      )
    ).toBeUndefined()
  })

  it('does not poll active consumer detail queries while aggregate polling stays at 60s', async () => {
    vi.useFakeTimers()
    respondWith(detailResponse)
    const options = ProducerQueries.getDashboardConsumer(detailParams)
    const observer = new QueryObserver(queryClient, options)
    const unsubscribe = observer.subscribe(() => {})
    try {
      await queryClient.fetchQuery(options)
      expect(adapter).toHaveBeenCalledTimes(1)
      await vi.advanceTimersByTimeAsync(180_000)
      expect(adapter).toHaveBeenCalledTimes(1)
      expect(ProducerQueries.getDashboard().refetchInterval).toBe(60_000)
    } finally {
      unsubscribe()
      observer.destroy()
      queryClient.clear()
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })
})
beforeEach(() => {
  // Isolate the browser storage dependency from Node's experimental localStorage.
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      length: 0,
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn().mockReturnValue(null),
    } satisfies Storage,
  })
  adapter.mockReset()
  axiosInstance.defaults.adapter = adapter
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  respondWith(dashboard)
})

afterEach(() => {
  queryClient.clear()
  axiosInstance.defaults.adapter = originalAdapter
  Object.defineProperty(window, 'localStorage', originalLocalStorage)
})

describe('ProducerServices.getDashboard', () => {
  it('uses GET on the configured BFF endpoint and returns only the response body', async () => {
    const result = await ProducerServices.getDashboard()

    expect(adapter).toHaveBeenCalledTimes(1)
    expect(adapter.mock.calls[0][0]).toMatchObject({
      method: 'get',
      url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard`,
    })
    expect(adapter.mock.calls[0][0].data).toBeUndefined()
    expect(adapter.mock.calls[0][0].params).toBeUndefined()
    expect(result).toBe(dashboard)
    expect(result.eservices.total).not.toBe(
      Object.entries(result.eservices)
        .filter(([key]) => key !== 'total')
        .reduce((sum, [, count]) => sum + count, 0)
    )
    expect(result.averageActivePurposesPerEService).toBe(4.7)
  })

  it('preserves a zero-valued response without substituting defaults', async () => {
    const emptyDashboard: ProducerDashboard = {
      eservices: { total: 0, published: 0, suspended: 0, archiving: 0, archivingSuspended: 0 },
      pendingAgreements: 0,
      waitingForApprovalPurposes: 0,
      activeAgreements: 0,
      alignment: { aligned: 0, agreementWithoutPurposes: 0, purposesWithoutAgreement: 0 },
      averageActivePurposesPerEService: 0,
    }
    respondWith(emptyDashboard)

    expect(await ProducerServices.getDashboard()).toBe(emptyDashboard)
  })

  it('propagates an HTTP failure without inventing a fallback dashboard or error shape', async () => {
    const error = rejectWithStatus(503)

    await expect(ProducerServices.getDashboard()).rejects.toBe(error)
    expect(adapter).toHaveBeenCalledTimes(1)
  })

  it('propagates a network failure without requiring an HTTP response', async () => {
    const error = new AxiosError('Network Error', AxiosError.ERR_NETWORK)
    adapter.mockRejectedValue(error)

    await expect(ProducerServices.getDashboard()).rejects.toBe(error)
  })

  it.each([
    { status: 401, errorType: UnauthorizedError },
    { status: 404, errorType: NotFoundError },
  ])('retains the shared Axios error handling for HTTP $status', async ({ status, errorType }) => {
    rejectWithStatus(status)

    await expect(ProducerServices.getDashboard()).rejects.toBeInstanceOf(errorType)
  })
})

describe('ProducerQueries.getDashboard', () => {
  it('creates stable, lazy query options with one-minute polling and default focus/background policies', () => {
    const options = ProducerQueries.getDashboard()

    expect(options.queryKey).toEqual(['ProducerGetDashboard'])
    expect(ProducerQueries.getDashboard().queryKey).toEqual(options.queryKey)
    expect(options.queryFn).toEqual(expect.any(Function))
    expect(options.refetchInterval).toBe(60_000)
    expect(options).not.toHaveProperty('refetchIntervalInBackground')
    expect(options).not.toHaveProperty('refetchOnWindowFocus')
    expect(options).not.toHaveProperty('retry')
    expect(options).not.toHaveProperty('staleTime')
    expect(adapter).not.toHaveBeenCalled()
  })

  it('executes the real service through QueryClient and caches the dashboard under its key', async () => {
    const options = ProducerQueries.getDashboard()
    const result = await queryClient.fetchQuery(options)

    expect(result).toEqual(dashboard)
    expect(queryClient.getQueryData(options.queryKey)).toEqual(dashboard)
    expect(adapter).toHaveBeenCalledTimes(1)
    expect(adapter.mock.calls[0][0]).toMatchObject({
      method: 'get',
      url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard`,
    })
    expect(queryClient.getQueryState(options.queryKey)?.status).toBe('success')
  })

  it('refetches an active dashboard at 60,000ms but not at 59,999ms', async () => {
    vi.useFakeTimers()
    const options = ProducerQueries.getDashboard()
    const observer = new QueryObserver(queryClient, options)
    const unsubscribe = observer.subscribe(() => {})

    try {
      await queryClient.fetchQuery(options)
      expect(adapter).toHaveBeenCalledTimes(1)

      await vi.advanceTimersByTimeAsync(59_999)
      expect(adapter).toHaveBeenCalledTimes(1)

      await vi.advanceTimersByTimeAsync(1)
      expect(adapter).toHaveBeenCalledTimes(2)
      expect(observer.getCurrentResult()).toMatchObject({
        status: 'success',
        fetchStatus: 'idle',
        data: dashboard,
      })
    } finally {
      unsubscribe()
      observer.destroy()
      queryClient.clear()
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })

  it('exposes service failures as query errors and never caches fabricated metrics', async () => {
    const error = rejectWithStatus(503)
    const options = ProducerQueries.getDashboard()

    await expect(queryClient.fetchQuery(options)).rejects.toBe(error)

    expect(queryClient.getQueryData(options.queryKey)).toBeUndefined()
    expect(queryClient.getQueryState(options.queryKey)).toMatchObject({
      status: 'error',
      error,
    })
    expect(adapter).toHaveBeenCalledTimes(1)
  })
})

const consumersParams: GetProducerDashboardConsumersParams = {
  offset: 20,
  limit: 10,
  q: 'Comune di',
  sortBy: 'ESERVICES_COUNT_DESC',
}

const consumersResponse: ProducerDashboardConsumers = {
  totalConsumers: 42,
  results: [
    {
      consumer: { id: '11111111-1111-4111-8111-111111111111', name: 'Comune di Test', kind: 'PA' },
      eservicesCount: 3,
      activePurposesCount: 0,
    },
  ],
  pagination: { offset: 20, limit: 10, totalCount: 21 },
}

function respondWithConsumers(data: ProducerDashboardConsumers) {
  adapter.mockImplementation(async (config) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }))
}

describe('ProducerServices.getDashboardConsumers', () => {
  beforeEach(() => respondWithConsumers(consumersResponse))

  it('issues one GET on /producers/dashboard/consumers with the exact params and returns response.data', async () => {
    const result = await ProducerServices.getDashboardConsumers(consumersParams)

    expect(adapter).toHaveBeenCalledTimes(1)
    const config = adapter.mock.calls[0][0]
    expect(config).toMatchObject({
      method: 'get',
      url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/consumers`,
    })
    expect(config.params).toStrictEqual(consumersParams)
    expect(config.data).toBeUndefined()
    expect(axiosInstance.getUri(config)).toBe(
      `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/consumers?offset=20&limit=10&q=Comune%20di&sortBy=ESERVICES_COUNT_DESC`
    )
    // Identity: the body is returned as-is, not re-mapped or defaulted.
    expect(result).toBe(consumersResponse)
  })

  it('sends only offset/limit when optional q and sortBy are omitted (no client-side defaults)', async () => {
    await ProducerServices.getDashboardConsumers({ offset: 0, limit: 1 })

    const config = adapter.mock.calls[0][0]
    expect(config.params).toStrictEqual({ offset: 0, limit: 1 })
    expect(axiosInstance.getUri(config)).toBe(
      `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/consumers?offset=0&limit=1`
    )
  })

  it('does not mutate the caller params object', async () => {
    const params = { ...consumersParams }
    await ProducerServices.getDashboardConsumers(params)

    expect(params).toStrictEqual(consumersParams)
  })

  it('returns an empty page untouched (zero totals, empty results)', async () => {
    const empty: ProducerDashboardConsumers = {
      totalConsumers: 0,
      results: [],
      pagination: { offset: 0, limit: 10, totalCount: 0 },
    }
    respondWithConsumers(empty)

    expect(await ProducerServices.getDashboardConsumers({ offset: 0, limit: 10 })).toBe(empty)
  })

  it('propagates an HTTP 503 failure as the same error instance', async () => {
    const error = rejectWithStatus(503)

    await expect(ProducerServices.getDashboardConsumers(consumersParams)).rejects.toBe(error)
    expect(adapter).toHaveBeenCalledTimes(1)
  })

  it('propagates a network failure as the same error instance', async () => {
    const error = new AxiosError('Network Error', AxiosError.ERR_NETWORK)
    adapter.mockRejectedValue(error)

    await expect(ProducerServices.getDashboardConsumers(consumersParams)).rejects.toBe(error)
  })

  it.each([
    { status: 401, errorType: UnauthorizedError },
    { status: 404, errorType: NotFoundError },
  ])('retains the shared Axios error mapping for HTTP $status', async ({ status, errorType }) => {
    rejectWithStatus(status)

    await expect(ProducerServices.getDashboardConsumers(consumersParams)).rejects.toBeInstanceOf(
      errorType
    )
  })
})

describe('ProducerQueries.getDashboardConsumers', () => {
  beforeEach(() => respondWithConsumers(consumersResponse))

  it('builds a lazy, non-polling query keyed by name and params', () => {
    const options = ProducerQueries.getDashboardConsumers(consumersParams)

    expect(options.queryKey).toEqual(['ProducerGetDashboardConsumers', consumersParams])
    expect(options.queryKey[1]).toBe(consumersParams)
    expect(options.queryFn).toEqual(expect.any(Function))
    expect(options).not.toHaveProperty('refetchInterval')
    expect(options).not.toHaveProperty('refetchIntervalInBackground')
    expect(options).not.toHaveProperty('placeholderData')
    expect(options).not.toHaveProperty('retry')
    expect(options).not.toHaveProperty('staleTime')
    expect(adapter).not.toHaveBeenCalled()
  })

  it('leaves the aggregate dashboard query unchanged (key and 60s polling)', () => {
    const aggregate = ProducerQueries.getDashboard()

    expect(aggregate.queryKey).toEqual(['ProducerGetDashboard'])
    expect(aggregate.refetchInterval).toBe(60_000)
  })

  it('produces distinct cache entries per params and never collides with the aggregate key', async () => {
    const page1 = ProducerQueries.getDashboardConsumers({ offset: 0, limit: 10 })
    const page2 = ProducerQueries.getDashboardConsumers({ offset: 10, limit: 10 })
    const searched = ProducerQueries.getDashboardConsumers({ offset: 0, limit: 10, q: 'x' })
    const sorted = ProducerQueries.getDashboardConsumers({
      offset: 0,
      limit: 10,
      sortBy: 'NAME_DESC',
    })

    const hashes = [page1, page2, searched, sorted, ProducerQueries.getDashboard()].map((o) =>
      JSON.stringify(o.queryKey)
    )
    expect(new Set(hashes).size).toBe(hashes.length)

    await queryClient.fetchQuery(page1)
    // structurally equal params hit the same cache entry
    expect(
      queryClient.getQueryData(['ProducerGetDashboardConsumers', { limit: 10, offset: 0 }])
    ).toBe(consumersResponse)
    expect(queryClient.getQueryData(page2.queryKey)).toBeUndefined()
    expect(queryClient.getQueryData(ProducerQueries.getDashboard().queryKey)).toBeUndefined()
    // aggregate-key prefix must not match consumers entries
    expect(
      queryClient.getQueryCache().findAll({ queryKey: ['ProducerGetDashboard'] })
    ).toHaveLength(0)
  })

  it('executes the real service through QueryClient with the params from the key', async () => {
    const options = ProducerQueries.getDashboardConsumers(consumersParams)
    const result = await queryClient.fetchQuery(options)

    expect(result).toBe(consumersResponse)
    expect(adapter).toHaveBeenCalledTimes(1)
    expect(adapter.mock.calls[0][0].params).toStrictEqual(consumersParams)
    expect(queryClient.getQueryState(options.queryKey)?.status).toBe('success')
  })

  it('does not poll an active consumers query', async () => {
    vi.useFakeTimers()
    const options = ProducerQueries.getDashboardConsumers(consumersParams)
    const observer = new QueryObserver(queryClient, options)
    const unsubscribe = observer.subscribe(() => {})

    try {
      await queryClient.fetchQuery(options)
      expect(adapter).toHaveBeenCalledTimes(1)

      await vi.advanceTimersByTimeAsync(180_000)
      expect(adapter).toHaveBeenCalledTimes(1)
      expect(observer.getCurrentResult()).toMatchObject({ status: 'success', fetchStatus: 'idle' })
    } finally {
      unsubscribe()
      observer.destroy()
      queryClient.clear()
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })

  it('exposes service failures as query errors without caching data', async () => {
    const error = rejectWithStatus(503)
    const options = ProducerQueries.getDashboardConsumers(consumersParams)

    await expect(queryClient.fetchQuery(options)).rejects.toBe(error)
    expect(queryClient.getQueryData(options.queryKey)).toBeUndefined()
    expect(queryClient.getQueryState(options.queryKey)).toMatchObject({ status: 'error', error })
  })
})

function respondWithBody(data: ProducerDashboardSaturation | MonitoringArchiving) {
  adapter.mockImplementation(async (config) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }))
}

const saturationParams: GetProducerDashboardSaturationParams = {
  offset: 0,
  limit: 5,
  sortBy: 'PERCENTAGE_DESC',
}

const saturationResponse: ProducerDashboardSaturation = {
  summary: { overThreshold: 1, nearThreshold: 0, total: 2 },
  results: [
    {
      eservice: { id: 'es-1', name: 'Fractional' },
      descriptorId: 'desc-1',
      version: '1',
      activePurposesCount: 2,
      approvedDailyCalls: 12345,
      dailyCallsTotal: 10000,
      percentage: 123.45,
      waitingForApprovalDailyCalls: 0,
    },
  ],
  pagination: { offset: 0, limit: 5, totalCount: 2 },
}

// Deliberately not in date order and mixing every optional descriptor/version shape.
const archivingResponse: MonitoringArchiving = {
  results: [
    {
      eservice: { id: 'es-b', name: 'B' },
      descriptorId: 'desc-b',
      consumersCount: 0,
      archivableOn: '2027-01-01T00:00:00Z',
    },
    {
      eservice: { id: 'es-a', name: 'A' },
      version: '3',
      consumersCount: 1,
      archivableOn: '2026-01-01T00:00:00Z',
    },
    {
      eservice: { id: 'es-c', name: 'C' },
      consumersCount: 2,
      archivableOn: '2026-06-01T00:00:00Z',
    },
  ],
}

describe('ProducerServices.getDashboardSaturation', () => {
  beforeEach(() => respondWithBody(saturationResponse))

  it('issues one GET on /producers/dashboard/saturation with the exact params and returns the full body', async () => {
    const result = await ProducerServices.getDashboardSaturation(saturationParams)

    expect(adapter).toHaveBeenCalledTimes(1)
    const config = adapter.mock.calls[0][0]
    expect(config).toMatchObject({
      method: 'get',
      url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/saturation`,
    })
    expect(config.params).toStrictEqual(saturationParams)
    expect(config.data).toBeUndefined()
    expect(axiosInstance.getUri(config)).toBe(
      `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/saturation?offset=0&limit=5&sortBy=PERCENTAGE_DESC`
    )
    // Full generated response (summary + results + pagination) is returned untouched.
    expect(result).toBe(saturationResponse)
    expect(result.results[0].percentage).toBe(123.45)
  })

  it('forwards optional q/sortBy only when provided and does not mutate params', async () => {
    const params = { offset: 5, limit: 50, q: 'Ana grafe', sortBy: 'NAME_ASC' } as const
    const snapshot = { ...params }
    await ProducerServices.getDashboardSaturation(params)
    await ProducerServices.getDashboardSaturation({ offset: 0, limit: 1 })

    expect(params).toStrictEqual(snapshot)
    expect(axiosInstance.getUri(adapter.mock.calls[0][0])).toBe(
      `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/saturation?offset=5&limit=50&q=Ana%20grafe&sortBy=NAME_ASC`
    )
    expect(adapter.mock.calls[1][0].params).toStrictEqual({ offset: 0, limit: 1 })
  })

  it('propagates HTTP and network failures as the same error instance', async () => {
    const httpError = rejectWithStatus(503)
    await expect(ProducerServices.getDashboardSaturation(saturationParams)).rejects.toBe(httpError)

    const networkError = new AxiosError('Network Error', AxiosError.ERR_NETWORK)
    adapter.mockRejectedValue(networkError)
    await expect(ProducerServices.getDashboardSaturation(saturationParams)).rejects.toBe(
      networkError
    )
  })

  it.each([
    { status: 401, errorType: UnauthorizedError },
    { status: 404, errorType: NotFoundError },
  ])('retains the shared Axios error mapping for HTTP $status', async ({ status, errorType }) => {
    rejectWithStatus(status)
    await expect(ProducerServices.getDashboardSaturation(saturationParams)).rejects.toBeInstanceOf(
      errorType
    )
  })
})

describe('ProducerServices.getDashboardArchiving', () => {
  beforeEach(() => respondWithBody(archivingResponse))

  it('issues one parameterless GET on /producers/dashboard/archiving and returns the body as-is', async () => {
    const result = await ProducerServices.getDashboardArchiving()

    expect(adapter).toHaveBeenCalledTimes(1)
    const config = adapter.mock.calls[0][0]
    expect(config).toMatchObject({
      method: 'get',
      url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/archiving`,
    })
    expect(config.params).toBeUndefined()
    expect(config.data).toBeUndefined()
    expect(axiosInstance.getUri(config)).toBe(
      `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/archiving`
    )
    expect(result).toBe(archivingResponse)
    // Backend order and optional-field shapes are preserved (no sort, no defaults).
    expect(result.results.map(({ eservice }) => eservice.id)).toEqual(['es-b', 'es-a', 'es-c'])
    expect(result.results[0]).not.toHaveProperty('version')
    expect(result.results[1]).not.toHaveProperty('descriptorId')
    expect(result.results[2]).not.toHaveProperty('descriptorId')
    expect(result.results[2]).not.toHaveProperty('version')
  })

  it('returns an empty list untouched', async () => {
    const empty: MonitoringArchiving = { results: [] }
    respondWithBody(empty)
    expect(await ProducerServices.getDashboardArchiving()).toBe(empty)
  })

  it.each([
    { status: 401, errorType: UnauthorizedError },
    { status: 404, errorType: NotFoundError },
  ])('maps HTTP $status via the shared Axios mapping', async ({ status, errorType }) => {
    rejectWithStatus(status)
    await expect(ProducerServices.getDashboardArchiving()).rejects.toBeInstanceOf(errorType)
  })

  it('propagates a 503 as the same error instance', async () => {
    const error = rejectWithStatus(503)
    await expect(ProducerServices.getDashboardArchiving()).rejects.toBe(error)
  })
})

describe('ProducerQueries saturation/archiving', () => {
  it.each(['PERCENTAGE_ASC', 'PERCENTAGE_DESC', 'NAME_ASC', 'NAME_DESC'] as const)(
    'forwards search/paging/%s through the real query and transport without reordering backend results',
    async (sortBy) => {
      const params = { offset: 10, limit: 24, q: 'Sanità & mobilità', sortBy }
      const body: ProducerDashboardSaturation = {
        summary: { overThreshold: 2, nearThreshold: 1, total: 99 },
        results: [
          {
            ...saturationResponse.results[0],
            eservice: { id: 'z', name: 'Zeta' },
            percentage: 25,
          },
          {
            ...saturationResponse.results[0],
            eservice: { id: 'a', name: 'Alfa' },
            percentage: 125,
          },
          {
            ...saturationResponse.results[0],
            eservice: { id: 'm', name: 'Medio' },
            percentage: 70,
          },
        ],
        pagination: { offset: 10, limit: 24, totalCount: 13 },
      }
      respondWithBody(body)
      const options = ProducerQueries.getDashboardSaturation(params)
      const result = await queryClient.fetchQuery(options)

      expect(adapter).toHaveBeenCalledTimes(1)
      expect(adapter.mock.calls[0][0]).toMatchObject({
        method: 'get',
        url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/saturation`,
        params,
      })
      const url = new URL(axiosInstance.getUri(adapter.mock.calls[0][0]))
      expect(Object.fromEntries(url.searchParams)).toEqual({
        offset: '10',
        limit: '24',
        q: 'Sanità & mobilità',
        sortBy,
      })
      expect(result).toBe(body)
      expect(result.results.map(({ eservice }) => eservice.name)).toEqual(['Zeta', 'Alfa', 'Medio'])
      expect(queryClient.getQueryData(options.queryKey)).toEqual(body)
    }
  )

  it('builds lazy, non-polling queries with the exact keys and leaves the aggregate at 60s', () => {
    const saturation = ProducerQueries.getDashboardSaturation(saturationParams)
    const archiving = ProducerQueries.getDashboardArchiving()

    expect(saturation.queryKey).toEqual(['ProducerGetDashboardSaturation', saturationParams])
    expect(saturation.queryKey[1]).toBe(saturationParams)
    expect(archiving.queryKey).toEqual(['ProducerGetDashboardArchiving'])
    for (const options of [saturation, archiving]) {
      expect(options).not.toHaveProperty('refetchInterval')
      expect(options).not.toHaveProperty('refetchIntervalInBackground')
      expect(options).not.toHaveProperty('staleTime')
      expect(options).not.toHaveProperty('retry')
    }
    expect(ProducerQueries.getDashboard().queryKey).toEqual(['ProducerGetDashboard'])
    expect(ProducerQueries.getDashboard().refetchInterval).toBe(60_000)
    expect(adapter).not.toHaveBeenCalled()
  })

  it('executes each real service through QueryClient and keeps separate cache entries', async () => {
    respondWithBody(saturationResponse)
    const saturation = ProducerQueries.getDashboardSaturation(saturationParams)
    expect(await queryClient.fetchQuery(saturation)).toBe(saturationResponse)

    respondWithBody(archivingResponse)
    const archiving = ProducerQueries.getDashboardArchiving()
    expect(await queryClient.fetchQuery(archiving)).toBe(archivingResponse)

    expect(adapter).toHaveBeenCalledTimes(2)
    expect(adapter.mock.calls[0][0].params).toStrictEqual(saturationParams)
    expect(adapter.mock.calls[1][0].params).toBeUndefined()
    expect(queryClient.getQueryData(saturation.queryKey)).toBe(saturationResponse)
    expect(queryClient.getQueryData(archiving.queryKey)).toBe(archivingResponse)
    expect(queryClient.getQueryData(['ProducerGetDashboard'])).toBeUndefined()
  })

  it('does not poll active saturation/archiving queries', async () => {
    vi.useFakeTimers()
    respondWithBody(archivingResponse)
    const observers = [
      new QueryObserver(queryClient, ProducerQueries.getDashboardSaturation(saturationParams)),
      new QueryObserver(queryClient, ProducerQueries.getDashboardArchiving()),
    ]
    const unsubscribes = observers.map((observer) => observer.subscribe(() => {}))

    try {
      await vi.advanceTimersByTimeAsync(0)
      const initialCalls = adapter.mock.calls.length
      expect(initialCalls).toBe(2)
      await vi.advanceTimersByTimeAsync(180_000)
      expect(adapter).toHaveBeenCalledTimes(initialCalls)
    } finally {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
      observers.forEach((observer) => observer.destroy())
      queryClient.clear()
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })

  it('exposes failures as query errors without caching data', async () => {
    const error = rejectWithStatus(503)
    const saturation = ProducerQueries.getDashboardSaturation(saturationParams)
    const archiving = ProducerQueries.getDashboardArchiving()

    await expect(queryClient.fetchQuery(saturation)).rejects.toBe(error)
    await expect(queryClient.fetchQuery(archiving)).rejects.toBe(error)
    for (const queryKey of [saturation.queryKey, archiving.queryKey]) {
      expect(queryClient.getQueryData(queryKey)).toBeUndefined()
      expect(queryClient.getQueryState(queryKey)).toMatchObject({ status: 'error', error })
    }
  })
})
