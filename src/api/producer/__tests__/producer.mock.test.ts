import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, type AxiosAdapter } from 'axios'
import type {
  GetProducerDashboardConsumersParams,
  ProducerDashboard,
  ProducerDashboardConsumers,
} from '@/api/api.generatedTypes'
import {
  getMockProducerDashboardConsumer,
  getMockProducerDashboardConsumers,
  getMockProducerDashboardSaturation,
  mockProducerDashboardArchiving,
  mockProducerDashboardSaturation,
  mockProducerDashboard,
  mockProducerDashboardConsumers,
  mockProducerDashboardConsumerEServices,
} from '../../../../__mocks__/data/producer.mocks'

const originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')!
const originalFlag = process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD
const adapter = vi.fn<AxiosAdapter>()

function stubFlag(value: string | undefined) {
  vi.stubEnv('REACT_APP_MOCK_PRODUCER_DASHBOARD', value)
  // setupTests reassigns process.env; Vitest's env proxy still targets the old
  // object for deletions. Delete from the current object to test a truly unset flag.
  if (value === undefined) delete process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD
}

beforeEach(() => {
  vi.resetModules()
  adapter.mockReset()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: { getItem: vi.fn().mockReturnValue(null) },
  })
})

afterEach(() => {
  vi.unstubAllEnvs()
  if (originalFlag === undefined) delete process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD
  else process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD = originalFlag
  Object.defineProperty(window, 'localStorage', originalLocalStorage)
})

async function loadService({
  dev = true,
  mode = 'development',
  flag = 'true',
}: {
  dev?: boolean
  mode?: 'development' | 'production' | 'test'
  flag?: string
} = {}) {
  vi.stubEnv('DEV', dev)
  vi.stubEnv('MODE', mode)
  stubFlag(flag === 'unset' ? undefined : flag)

  const { default: axiosInstance } = await import('@/config/axios')
  axiosInstance.defaults.adapter = adapter
  const { ProducerServices } = await import('../producer.services')
  return ProducerServices
}

describe('development-only producer dashboard mock', () => {
  it('returns the exact provided fixture without reaching the HTTP transport', async () => {
    const service = await loadService()
    adapter.mockRejectedValue(new Error('The mock must not issue a request'))

    const result = await service.getDashboard()

    expect(result).toStrictEqual({
      eservices: {
        total: 12,
        published: 8,
        suspended: 2,
        archiving: 1,
        archivingSuspended: 1,
      },
      pendingAgreements: 4,
      waitingForApprovalPurposes: 7,
      activeAgreements: 230,
      alignment: { aligned: 200, agreementWithoutPurposes: 30, purposesWithoutAgreement: 5 },
      averageActivePurposesPerEService: 3.4,
    } satisfies ProducerDashboard)
    expect(result).toStrictEqual(mockProducerDashboard)
    expect(adapter).not.toHaveBeenCalled()
  })

  it('deep-clones every response, isolating concurrent callers and the source fixture', async () => {
    const service = await loadService()
    const { mockProducerDashboard: source } =
      await import('../../../../__mocks__/data/producer.mocks')
    const [first, second] = await Promise.all([service.getDashboard(), service.getDashboard()])

    expect(first).not.toBe(source)
    expect(first).not.toBe(second)
    expect(first.eservices).not.toBe(source.eservices)
    expect(first.alignment).not.toBe(source.alignment)
    expect(first.eservices).not.toBe(second.eservices)
    expect(first.alignment).not.toBe(second.alignment)
    first.eservices.total = -1
    first.alignment.aligned = -1
    first.activeAgreements = -1

    expect(source).toStrictEqual(mockProducerDashboard)
    expect(second).toStrictEqual(mockProducerDashboard)
    expect(await service.getDashboard()).toStrictEqual(mockProducerDashboard)
    expect(adapter).not.toHaveBeenCalled()
  })

  describe.each([
    { name: 'disabled flag', dev: true, mode: 'development', flag: 'false' },
    { name: 'unset flag', dev: true, mode: 'development', flag: 'unset' },
    { name: 'test mode with flag enabled', dev: true, mode: 'test', flag: 'true' },
    { name: 'production mode with flag enabled', dev: true, mode: 'production', flag: 'true' },
    { name: 'production build', dev: false, mode: 'production', flag: 'true' },
    {
      name: 'production build even with development mode and flag enabled',
      dev: false,
      mode: 'development',
      flag: 'true',
    },
  ] as const)('$name', ({ dev, mode, flag }) => {
    it('uses the unchanged real GET and returns its response body', async () => {
      const service = await loadService({ dev, mode, flag })
      const { BACKEND_FOR_FRONTEND_URL } = await import('@/config/env')
      const response: ProducerDashboard = {
        ...mockProducerDashboard,
        pendingAgreements: 0,
        activeAgreements: 999,
      }
      adapter.mockImplementation(async (config) => ({
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }))

      expect(await service.getDashboard()).toBe(response)
      expect(adapter).toHaveBeenCalledTimes(1)
      expect(adapter.mock.calls[0][0]).toMatchObject({
        method: 'get',
        url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard`,
      })
      expect(adapter.mock.calls[0][0].data).toBeUndefined()
      expect(adapter.mock.calls[0][0].params).toBeUndefined()
    })

    it.each([undefined, 503, 401, 404])(
      'preserves existing error handling without mock fallback (status %s)',
      async (status) => {
        const service = await loadService({ dev, mode, flag })
        const { NotFoundError, UnauthorizedError } = await import('@/utils/errors.utils')
        const error = new AxiosError(
          'Dashboard request failed',
          status ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_NETWORK
        )
        adapter.mockImplementation(async (config) => {
          error.config = config
          if (status) {
            error.response = {
              data: undefined,
              status,
              statusText: 'Request failed',
              headers: {},
              config,
            }
          }
          throw error
        })

        const request = service.getDashboard()
        if (status === 401) {
          await expect(request).rejects.toBeInstanceOf(UnauthorizedError)
        } else if (status === 404) {
          await expect(request).rejects.toBeInstanceOf(NotFoundError)
        } else {
          await expect(request).rejects.toBe(error)
        }
        expect(adapter).toHaveBeenCalledTimes(1)
      }
    )
  })
})

describe('MOCK_PRODUCER_DASHBOARD config flag', () => {
  it.each([
    { flag: 'true', expected: true },
    { flag: 'false', expected: false },
    { flag: undefined, expected: false },
    { flag: '', expected: false },
    { flag: 'TRUE', expected: false },
    { flag: '1', expected: false },
    { flag: ' true ', expected: false },
  ])('uses raw equality for $flag', async ({ flag, expected }) => {
    vi.stubEnv('MODE', 'test')
    stubFlag(flag)

    const config = await import('@/config/env')

    expect(config.APP_MODE).toBe('test')
    expect(config.MOCK_PRODUCER_DASHBOARD).toBe(expected)
  })

  it('does not gate the raw flag itself on DEV or APP_MODE', async () => {
    vi.stubEnv('DEV', false)
    vi.stubEnv('MODE', 'production')
    stubFlag('true')

    const config = await import('@/config/env')

    expect(config.APP_MODE).toBe('production')
    expect(config.MOCK_PRODUCER_DASHBOARD).toBe(true)
  })
})

const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const ids = (r: ProducerDashboardConsumers) => r.results.map(({ consumer }) => consumer.id)
const ALL = { offset: 0, limit: 50 } as const

describe('consumer detail mock contract', () => {
  const params = { consumerId: id(13), offset: 0, limit: 50 }
  const names = [
    'Anagrafe Nazionale',
    'Catasto Fabbricati',
    'Certificati Anagrafici',
    'Fascicolo Sanitario',
    'Indice PA',
    'Mobilità Urbana',
    'Notifiche Digitali',
    'Pagamenti PA',
    'Registro Imprese',
    'Residenza Online',
    'Servizi Scolastici',
    'Stato Civile',
    'Tributi Locali',
    'Verifica ISEE',
    'Zone Traffico Limitato',
  ]

  it('reconciles all 16 list identities, row counts and active-purpose totals', () => {
    expect(mockProducerDashboardConsumers).toHaveLength(16)
    for (const item of mockProducerDashboardConsumers) {
      const result = getMockProducerDashboardConsumer({
        ...params,
        consumerId: item.consumer.id,
      })
      expect(result.consumer).toEqual(item.consumer)
      expect(result.eservicesCount).toBe(item.eservicesCount)
      expect(result.results).toHaveLength(item.eservicesCount)
      expect(result.pagination.totalCount).toBe(item.eservicesCount)
      expect(result.results.reduce((sum, row) => sum + row.activePurposesCount, 0)).toBe(
        item.activePurposesCount
      )
      expect(new Set(result.results.map((row) => row.agreement.id)).size).toBe(item.eservicesCount)
    }
  })

  it('sorts all names in both directions and defaults to NAME_ASC', () => {
    const asc = getMockProducerDashboardConsumer(params)
    expect(asc.results.map((row) => row.eservice.name)).toEqual(names)
    expect(getMockProducerDashboardConsumer({ ...params, sortBy: 'NAME_ASC' }).results).toEqual(
      asc.results
    )
    expect(
      getMockProducerDashboardConsumer({ ...params, sortBy: 'NAME_DESC' }).results.map(
        (row) => row.eservice.name
      )
    ).toEqual([...names].reverse())
  })

  it.each(['DAILY_CALLS_ASC', 'DAILY_CALLS_DESC'] as const)(
    'sorts daily calls with deterministic ascending name tie breaks for %s',
    (sortBy) => {
      const result = getMockProducerDashboardConsumer({ ...params, sortBy })
      const direction = sortBy === 'DAILY_CALLS_ASC' ? 1 : -1
      for (let index = 1; index < result.results.length; index++) {
        const previous = result.results[index - 1]
        const current = result.results[index]
        expect(
          direction * (current.approvedDailyCalls - previous.approvedDailyCalls)
        ).toBeGreaterThanOrEqual(0)
        if (previous.approvedDailyCalls === current.approvedDailyCalls) {
          expect(previous.eservice.name.localeCompare(current.eservice.name, 'it')).toBeLessThan(0)
        }
      }
      expect(result.results.some((row) => row.approvedDailyCalls === 0)).toBe(true)
    }
  )

  it('filters names case-insensitively before pagination while retaining the overall count', () => {
    const result = getMockProducerDashboardConsumer({
      ...params,
      q: 'aNaGrAf',
      offset: 1,
      limit: 1,
    })
    expect(result.consumer?.id).toBe(id(13))
    expect(result.eservicesCount).toBe(15)
    expect(result.results.map((row) => row.eservice.name)).toEqual(['Certificati Anagrafici'])
    expect(result.pagination).toEqual({ offset: 1, limit: 1, totalCount: 2 })
  })

  it('paginates Lombardia across three disjoint pages without losing or duplicating rows', () => {
    const pages = [0, 5, 10].map((offset) =>
      getMockProducerDashboardConsumer({ ...params, offset, limit: 5 })
    )
    expect(pages.flatMap((page) => page.results.map((row) => row.eservice.name))).toEqual(names)
    for (const page of pages) {
      expect(page.eservicesCount).toBe(15)
      expect(page.results).toHaveLength(5)
      expect(page.pagination.totalCount).toBe(15)
    }
  })

  it.each([
    { q: 'does-not-exist', offset: 0, totalCount: 0 },
    { q: '', offset: 99, totalCount: 15 },
  ])('retains the related consumer on an empty page: %j', ({ q, offset, totalCount }) => {
    const result = getMockProducerDashboardConsumer({ ...params, q, offset })
    expect(result.consumer?.name).toBe('Regione Lombardia')
    expect(result.eservicesCount).toBe(15)
    expect(result.results).toEqual([])
    expect(result.pagination).toEqual({ offset, limit: 50, totalCount })
  })

  it('distinguishes no relation from a known consumer with zero e-services', () => {
    const unknown = getMockProducerDashboardConsumer({ ...params, consumerId: 'unknown' })
    expect(unknown).toEqual({
      eservicesCount: 0,
      results: [],
      pagination: { offset: 0, limit: 50, totalCount: 0 },
    })
    expect(unknown).not.toHaveProperty('consumer')
    const knownEmpty = getMockProducerDashboardConsumer({ ...params, consumerId: id(14) })
    expect(knownEmpty.consumer?.name).toBe('Istituto di Ricerca')
    expect(knownEmpty.results).toEqual([])
    expect(knownEmpty.eservicesCount).toBe(0)
    expect(knownEmpty.pagination.totalCount).toBe(0)
  })

  it('deep-clones consumer, rows, agreements and e-services without reordering fixtures', () => {
    const before = structuredClone(mockProducerDashboardConsumerEServices)
    const first = getMockProducerDashboardConsumer({ ...params, sortBy: 'DAILY_CALLS_DESC' })
    const second = getMockProducerDashboardConsumer({ ...params, sortBy: 'DAILY_CALLS_DESC' })
    first.consumer!.name = 'mutated'
    first.results[0].eservice.name = 'mutated'
    first.results[0].agreement.state = 'REJECTED'
    first.results[0].activePurposesCount = -1
    first.results.pop()
    expect(getMockProducerDashboardConsumer({ ...params, sortBy: 'DAILY_CALLS_DESC' })).toEqual(
      second
    )
    expect(mockProducerDashboardConsumerEServices).toEqual(before)
  })

  it('serves detail through the guarded mock branch without HTTP and clones each response', async () => {
    const service = await loadService()
    adapter.mockRejectedValue(new Error('The mock must not issue a request'))
    const first = await service.getDashboardConsumer(params)
    const second = await service.getDashboardConsumer(params)
    expect(first).toEqual(getMockProducerDashboardConsumer(params))
    expect(first).not.toBe(second)
    expect(first.consumer).not.toBe(second.consumer)
    expect(first.results[0].agreement).not.toBe(second.results[0].agreement)
    expect(adapter).not.toHaveBeenCalled()
  })

  it.each([
    { dev: true, mode: 'development', flag: 'false' },
    { dev: true, mode: 'development', flag: 'unset' },
    { dev: true, mode: 'test', flag: 'true' },
    { dev: true, mode: 'production', flag: 'true' },
    { dev: false, mode: 'production', flag: 'true' },
    { dev: false, mode: 'development', flag: 'true' },
  ] as const)('uses real detail HTTP when mock guard is closed: %j', async (guard) => {
    const service = await loadService(guard)
    const { BACKEND_FOR_FRONTEND_URL } = await import('@/config/env')
    const response = { eservicesCount: 0, results: [], pagination: { ...ALL, totalCount: 0 } }
    adapter.mockImplementation(async (config) => ({
      config,
      data: response,
      status: 200,
      statusText: 'OK',
      headers: {},
    }))
    expect(await service.getDashboardConsumer(params)).toBe(response)
    expect(adapter.mock.calls[0][0]).toMatchObject({
      method: 'get',
      url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/consumers/${id(13)}`,
      params: ALL,
    })
    const error = new AxiosError('Network Error', AxiosError.ERR_NETWORK)
    adapter.mockRejectedValue(error)
    await expect(service.getDashboardConsumer(params)).rejects.toBe(error)
    expect(adapter).toHaveBeenCalledTimes(2)
  })
})

describe('development-only producer dashboard consumers mock', () => {
  it('serves 16 fixtures with overall and filtered totals without reaching the HTTP transport', async () => {
    const service = await loadService()
    adapter.mockRejectedValue(new Error('The mock must not issue a request'))

    const result = await service.getDashboardConsumers({ offset: 0, limit: 10 })

    expect(mockProducerDashboardConsumers).toHaveLength(16)
    expect(result.totalConsumers).toBe(16)
    expect(result.pagination).toStrictEqual({ offset: 0, limit: 10, totalCount: 16 })
    expect(result.results).toHaveLength(10)
    expect(adapter).not.toHaveBeenCalled()
  })

  it.each([
    { sortBy: undefined, expected: [8, 10, 16, 11, 3, 6, 1, 9, 12, 14, 2, 13, 7, 5, 15, 4] },
    { sortBy: 'NAME_ASC', expected: [8, 10, 16, 11, 3, 6, 1, 9, 12, 14, 2, 13, 7, 5, 15, 4] },
    { sortBy: 'NAME_DESC', expected: [4, 5, 15, 7, 13, 2, 14, 12, 9, 1, 6, 3, 11, 16, 10, 8] },
    {
      sortBy: 'ESERVICES_COUNT_DESC',
      expected: [13, 2, 7, 3, 1, 9, 5, 15, 11, 12, 4, 16, 6, 8, 10, 14],
    },
    {
      sortBy: 'ESERVICES_COUNT_ASC',
      expected: [14, 10, 8, 16, 6, 12, 4, 11, 9, 5, 15, 3, 1, 7, 2, 13],
    },
  ] as const)(
    'sorts deterministically by $sortBy (ties: name asc, then id asc)',
    ({ sortBy, expected }) => {
      const result = getMockProducerDashboardConsumers({ ...ALL, sortBy })

      expect(ids(result)).toStrictEqual(expected.map(id))
    }
  )

  it.each(['comune', 'COMUNE', 'CoMuNe di'])('filters by name case-insensitively (q=%s)', (q) => {
    const result = getMockProducerDashboardConsumers({ ...ALL, q })

    expect(ids(result)).toStrictEqual([16, 11, 3, 6, 1, 9].map(id))
    expect(result.pagination.totalCount).toBe(6)
    expect(result.totalConsumers).toBe(16)
  })

  it('treats an empty q as no filter', () => {
    expect(getMockProducerDashboardConsumers({ ...ALL, q: '' }).pagination.totalCount).toBe(16)
  })

  it('returns an empty filtered page while keeping the overall total', () => {
    expect(getMockProducerDashboardConsumers({ ...ALL, q: 'zzz-no-match' })).toStrictEqual({
      totalConsumers: 16,
      results: [],
      pagination: { offset: 0, limit: 50, totalCount: 0 },
    })
  })

  it('applies filter, then sort, then page slicing', () => {
    const params: GetProducerDashboardConsumersParams = {
      offset: 2,
      limit: 2,
      q: 'comune',
      sortBy: 'ESERVICES_COUNT_DESC',
    }
    // comune by eservices desc: Milano(8), Roma(8), Torino(6), Firenze(5), Bari(3), Napoli(3)
    const result = getMockProducerDashboardConsumers(params)

    expect(ids(result)).toStrictEqual([9, 11].map(id))
    expect(result.pagination).toStrictEqual({ offset: 2, limit: 2, totalCount: 6 })
  })

  it.each([
    { offset: 10, limit: 10, expectedLength: 6 },
    { offset: 15, limit: 10, expectedLength: 1 },
    { offset: 16, limit: 10, expectedLength: 0 },
    { offset: 100, limit: 10, expectedLength: 0 },
    { offset: 0, limit: 1, expectedLength: 1 },
  ])('pages offset=$offset limit=$limit', ({ offset, limit, expectedLength }) => {
    const result = getMockProducerDashboardConsumers({ offset, limit })

    expect(result.results).toHaveLength(expectedLength)
    expect(result.pagination).toStrictEqual({ offset, limit, totalCount: 16 })
  })

  it('never reorders or shares references with the source fixture', async () => {
    const service = await loadService()
    const snapshot = structuredClone(mockProducerDashboardConsumers)
    const { mockProducerDashboardConsumers: source } =
      await import('../../../../__mocks__/data/producer.mocks')

    const first = await service.getDashboardConsumers({ ...ALL, sortBy: 'NAME_DESC' })
    const second = await service.getDashboardConsumers({ ...ALL, sortBy: 'NAME_DESC' })

    expect(first).not.toBe(second)
    expect(first.results).not.toBe(second.results)
    first.results.forEach((item) => {
      const original = source.find(({ consumer }) => consumer.id === item.consumer.id)!
      expect(item).not.toBe(original)
      expect(item.consumer).not.toBe(original.consumer)
    })
    first.results[0].consumer.name = 'mutated'
    first.results[0].eservicesCount = -1
    first.results.reverse()

    expect(source).toStrictEqual(snapshot)
    expect(mockProducerDashboardConsumers).toStrictEqual(snapshot)
    expect(second).toStrictEqual(
      await service.getDashboardConsumers({ ...ALL, sortBy: 'NAME_DESC' })
    )
    expect(adapter).not.toHaveBeenCalled()
  })

  describe.each([
    { name: 'disabled flag', dev: true, mode: 'development', flag: 'false' },
    { name: 'unset flag', dev: true, mode: 'development', flag: 'unset' },
    { name: 'test mode with flag enabled', dev: true, mode: 'test', flag: 'true' },
    { name: 'production mode with flag enabled', dev: true, mode: 'production', flag: 'true' },
    { name: 'production build', dev: false, mode: 'production', flag: 'true' },
    {
      name: 'production build with dev mode + flag',
      dev: false,
      mode: 'development',
      flag: 'true',
    },
  ] as const)('$name', ({ dev, mode, flag }) => {
    const params: GetProducerDashboardConsumersParams = {
      offset: 0,
      limit: 5,
      q: 'abc',
      sortBy: 'NAME_DESC',
    }

    it('uses the real GET with params and returns the response body', async () => {
      const service = await loadService({ dev, mode, flag })
      const { BACKEND_FOR_FRONTEND_URL } = await import('@/config/env')
      const response: ProducerDashboardConsumers = {
        totalConsumers: 1,
        results: [],
        pagination: { offset: 0, limit: 5, totalCount: 0 },
      }
      adapter.mockImplementation(async (config) => ({
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }))

      expect(await service.getDashboardConsumers(params)).toBe(response)
      expect(adapter).toHaveBeenCalledTimes(1)
      expect(adapter.mock.calls[0][0]).toMatchObject({
        method: 'get',
        url: `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/consumers`,
      })
      expect(adapter.mock.calls[0][0].params).toStrictEqual(params)
    })

    it('propagates failures without mock fallback', async () => {
      const service = await loadService({ dev, mode, flag })
      const error = new AxiosError('Consumers request failed', AxiosError.ERR_NETWORK)
      adapter.mockRejectedValue(error)

      await expect(service.getDashboardConsumers(params)).rejects.toBe(error)
      expect(adapter).toHaveBeenCalledTimes(1)
    })
  })
})

describe('development-only saturation and archiving mocks', () => {
  const names = (page: { results: { eservice: { name: string } }[] }) =>
    page.results.map(({ eservice }) => eservice.name)

  it('ships six saturation rows including an unclamped >100 percentage', () => {
    expect(mockProducerDashboardSaturation.results).toHaveLength(6)
    expect(Math.max(...mockProducerDashboardSaturation.results.map((r) => r.percentage))).toBe(125)
  })

  it.each([
    ['PERCENTAGE_DESC', [125, 110, 95, 90, 70, 25]],
    ['PERCENTAGE_ASC', [25, 70, 90, 95, 110, 125]],
    [undefined, [125, 110, 95, 90, 70, 25]],
  ] as const)('sorts saturation by %s (default PERCENTAGE_DESC)', (sortBy, expected) => {
    const page = getMockProducerDashboardSaturation({ offset: 0, limit: 50, sortBy })
    expect(page.results.map(({ percentage }) => percentage)).toEqual(expected)
  })

  it.each(['NAME_ASC', 'NAME_DESC'] as const)('sorts saturation names by %s', (sortBy) => {
    const sorted = names(getMockProducerDashboardSaturation({ offset: 0, limit: 50, sortBy }))
    const expected = [...sorted].sort((a, b) => a.localeCompare(b, 'it'))
    expect(sorted).toEqual(sortBy === 'NAME_ASC' ? expected : expected.reverse())
  })

  it('filters case-insensitively before sorting and paging, with full summary and filtered total', () => {
    const page = getMockProducerDashboardSaturation({ offset: 0, limit: 5, q: 'ANAGRAF' })
    expect(names(page)).toEqual(['Anagrafe Nazionale', 'Certificati Anagrafici'])
    expect(page.pagination).toEqual({ offset: 0, limit: 5, totalCount: 2 })
    expect(page.summary).toEqual(mockProducerDashboardSaturation.summary)
    expect(getMockProducerDashboardSaturation({ offset: 0, limit: 5, q: 'zzz' }).results).toEqual(
      []
    )
  })

  it('returns the top five for the dashboard request and pages without overlap', () => {
    const top = getMockProducerDashboardSaturation({
      offset: 0,
      limit: 5,
      sortBy: 'PERCENTAGE_DESC',
    })
    const rest = getMockProducerDashboardSaturation({
      offset: 5,
      limit: 5,
      sortBy: 'PERCENTAGE_DESC',
    })
    expect(top.results).toHaveLength(5)
    expect(rest.results.map(({ percentage }) => percentage)).toEqual([25])
    expect(top.pagination.totalCount).toBe(6)
  })

  it('archiving fixture is pre-ordered by date and mixes descriptor and whole e-service rows', () => {
    const rows = mockProducerDashboardArchiving.results
    const dates = rows.map(({ archivableOn }) => archivableOn)
    expect(dates).toEqual([...dates].sort())
    expect(rows.some((row) => row.descriptorId && row.version)).toBe(true)
    expect(rows.some((row) => !('descriptorId' in row) && !('version' in row))).toBe(true)
  })

  it('serves deep clones of both mocks through the guarded branch without HTTP', async () => {
    const service = await loadService()
    const saturationSnapshot = structuredClone(mockProducerDashboardSaturation)
    const archivingSnapshot = structuredClone(mockProducerDashboardArchiving)
    const source = await import('../../../../__mocks__/data/producer.mocks')

    const params = { offset: 0, limit: 5, sortBy: 'PERCENTAGE_DESC' } as const
    const s1 = await service.getDashboardSaturation(params)
    const s2 = await service.getDashboardSaturation(params)
    const a1 = await service.getDashboardArchiving()
    const a2 = await service.getDashboardArchiving()

    expect(s1).toStrictEqual(s2)
    expect(s1).not.toBe(s2)
    expect(s1.results[0]).not.toBe(source.mockProducerDashboardSaturation.results[0])
    expect(a1).toStrictEqual(source.mockProducerDashboardArchiving)
    expect(a1).not.toBe(source.mockProducerDashboardArchiving)
    expect(a1.results[0].eservice).not.toBe(
      source.mockProducerDashboardArchiving.results[0].eservice
    )

    s1.results[0].percentage = -1
    s1.summary.total = -1
    a1.results.reverse()
    a1.results[0].eservice.name = 'mutated'

    expect(source.mockProducerDashboardSaturation).toStrictEqual(saturationSnapshot)
    expect(source.mockProducerDashboardArchiving).toStrictEqual(archivingSnapshot)
    expect(a2).toStrictEqual(archivingSnapshot)
    expect(adapter).not.toHaveBeenCalled()
  })

  describe.each([
    { name: 'disabled flag', dev: true, mode: 'development', flag: 'false' },
    { name: 'test mode with flag enabled', dev: true, mode: 'test', flag: 'true' },
    { name: 'production build', dev: false, mode: 'production', flag: 'true' },
  ] as const)('$name', ({ dev, mode, flag }) => {
    it('uses the real saturation/archiving GETs and propagates failures without fallback', async () => {
      const service = await loadService({ dev, mode, flag })
      const { BACKEND_FOR_FRONTEND_URL } = await import('@/config/env')
      const body = { results: [] }
      adapter.mockImplementation(async (config) => ({
        data: body,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }))
      const params = { offset: 0, limit: 5, sortBy: 'PERCENTAGE_DESC' } as const

      expect(await service.getDashboardSaturation(params)).toBe(body)
      expect(await service.getDashboardArchiving()).toBe(body)
      expect(adapter.mock.calls.map(([config]) => [config.url, config.params])).toEqual([
        [`${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/saturation`, params],
        [`${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/archiving`, undefined],
      ])

      const error = new AxiosError('down', AxiosError.ERR_NETWORK)
      adapter.mockRejectedValue(error)
      await expect(service.getDashboardSaturation(params)).rejects.toBe(error)
      await expect(service.getDashboardArchiving()).rejects.toBe(error)
    })
  })
})
