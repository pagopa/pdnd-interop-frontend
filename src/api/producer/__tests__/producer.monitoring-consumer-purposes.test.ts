import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, type AxiosAdapter } from 'axios'
import type {
  GetProducerEServiceMonitoringConsumerPurposesParams,
  ProducerEServiceMonitoringConsumerPurposes,
} from '@/api/api.generatedTypes'
import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { createMockEServiceDescriptorProvider } from '../../../../__mocks__/data/eservice.mocks'
import {
  mockProducerDashboardConsumerEServices,
  mockProducerDashboardConsumers,
} from '../../../../__mocks__/data/producer.mocks'
import { getMockProducerEServiceMonitoringConsumerPurposes } from '../../../../__mocks__/data/producer-monitoring.mocks'

const resource =
  mockProducerDashboardConsumerEServices[mockProducerDashboardConsumers[0].consumer.id][0]
const ids = {
  eserviceId: resource.eservice.id,
  descriptorId: resource.descriptorId,
  consumerId: mockProducerDashboardConsumers[0].consumer.id,
}
const request: GetProducerEServiceMonitoringConsumerPurposesParams = {
  ...ids,
  offset: 0,
  limit: 5,
  q: 'Consultazione',
  sortBy: 'DATE_DESC',
  states: ['ACTIVE', 'DRAFT'],
  includeArchived: false,
}
const adapter = vi.fn<AxiosAdapter>()
const originalAdapter = axiosInstance.defaults.adapter
const originalFlag = process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD
const originalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')!

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
  axiosInstance.defaults.adapter = originalAdapter
  if (originalFlag === undefined) delete process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD
  else process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD = originalFlag
  Object.defineProperty(window, 'localStorage', originalStorage)
})

async function load(dev: boolean, mode: string, mockFlag: string) {
  vi.stubEnv('DEV', dev)
  vi.stubEnv('MODE', mode)
  vi.stubEnv('REACT_APP_MOCK_PRODUCER_DASHBOARD', mockFlag)
  const { default: axios } = await import('@/config/axios')
  axios.defaults.adapter = adapter
  const { ProducerQueries, ProducerServices } = await import('..')
  return { ProducerQueries, ProducerServices, axios }
}

function respondWith(data: ProducerEServiceMonitoringConsumerPurposes) {
  adapter.mockImplementation(async (config) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }))
}

describe('e-service monitoring consumer purposes service and query', () => {
  it('uses the exact endpoint path and sends only request query parameters', async () => {
    const { ProducerServices, axios } = await load(false, 'production', 'false')
    const response: ProducerEServiceMonitoringConsumerPurposes = {
      eservice: { id: ids.eserviceId, name: resource.eservice.name },
      version: resource.version,
      otherVersions: [],
      dailyCallsPerConsumer: 10000,
      approvedDailyCalls: 4000,
      percentage: 40,
      waitingForApprovalPurposes: 1,
      results: [],
      pagination: { offset: 0, limit: 5, totalCount: 0 },
    }
    respondWith(response)

    await expect(ProducerServices.getEServiceMonitoringConsumerPurposes(request)).resolves.toBe(
      response
    )
    const config = adapter.mock.calls[0][0]
    expect(config).toMatchObject({
      method: 'get',
      url: `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${ids.eserviceId}/descriptors/${ids.descriptorId}/monitoring/consumers/${ids.consumerId}/purposes`,
      params: {
        offset: 0,
        limit: 5,
        q: 'Consultazione',
        sortBy: 'DATE_DESC',
        states: ['ACTIVE', 'DRAFT'],
        includeArchived: false,
      },
    })
    expect(config.params).not.toHaveProperty('eserviceId')
    expect(config.params).not.toHaveProperty('descriptorId')
    expect(config.params).not.toHaveProperty('consumerId')
    expect(axios.getUri(config)).toContain('states=ACTIVE,DRAFT')
    expect(axios.getUri(config)).toContain('includeArchived=false')
  })

  it('serializes multiple selected states and the archived toggle on the real HTTP path', async () => {
    const { ProducerServices, axios } = await load(false, 'production', 'false')
    respondWith({
      eservice: { id: ids.eserviceId, name: resource.eservice.name },
      version: resource.version,
      otherVersions: [],
      dailyCallsPerConsumer: 0,
      approvedDailyCalls: 0,
      percentage: 0,
      waitingForApprovalPurposes: 0,
      results: [],
      pagination: { offset: 0, limit: 5, totalCount: 0 },
    })
    await ProducerServices.getEServiceMonitoringConsumerPurposes({
      ...request,
      q: 'a & b',
      states: ['ACTIVE', 'SUSPENDED', 'WAITING_FOR_APPROVAL', 'REJECTED'],
      includeArchived: true,
    })
    const uri = axios.getUri(adapter.mock.calls[0][0])
    const params = new URL(uri, 'https://example.test').searchParams
    expect(params.get('states')).toBe('ACTIVE,SUSPENDED,WAITING_FOR_APPROVAL,REJECTED')
    expect(params.get('includeArchived')).toBe('true')
    expect(params.get('q')).toBe('a & b')
    expect(uri).not.toContain('states[]')
  })

  it('propagates real transport errors without a mock fallback', async () => {
    const { ProducerServices } = await load(false, 'production', 'true')
    const error = new AxiosError('monitoring request failed', AxiosError.ERR_NETWORK)
    adapter.mockRejectedValue(error)

    await expect(ProducerServices.getEServiceMonitoringConsumerPurposes(request)).rejects.toBe(
      error
    )
    expect(adapter).toHaveBeenCalledTimes(1)
  })

  it.each([
    [true, 'development', 'false'],
    [true, 'test', 'true'],
    [false, 'development', 'true'],
  ])('uses the real endpoint with DEV=%s MODE=%s flag=%s', async (dev, mode, flag) => {
    const { ProducerServices } = await load(dev, mode, flag)
    const error = new AxiosError('request failed', AxiosError.ERR_NETWORK)
    adapter.mockRejectedValue(error)

    await expect(ProducerServices.getEServiceMonitoringConsumerPurposes(request)).rejects.toBe(
      error
    )
    expect(adapter).toHaveBeenCalledTimes(1)
    expect(adapter.mock.calls[0][0].url).toContain('/monitoring/consumers/')
  })

  it('keeps query variants isolated in the purpose query key', async () => {
    const { ProducerQueries } = await load(false, 'production', 'false')
    const options = ProducerQueries.getEServiceMonitoringConsumerPurposes(request)
    const otherOptions = ProducerQueries.getEServiceMonitoringConsumerPurposes({
      ...request,
      states: ['ACTIVE'],
    })

    expect(options.queryKey).toEqual(['ProducerGetEServiceMonitoringConsumerPurposes', request])
    expect(otherOptions.queryKey).not.toEqual(options.queryKey)
    expect(options.queryFn).toBeTypeOf('function')
  })

  it('does not silently retry through the network when a DEV mock shell lookup fails', async () => {
    const { ProducerServices } = await load(true, 'development', 'true')
    const error = new AxiosError('shell unavailable', AxiosError.ERR_NETWORK)
    adapter.mockRejectedValue(error)

    await expect(
      ProducerServices.getEServiceMonitoringConsumerPurposes({
        ...request,
        eserviceId: '10000000-0000-4000-8000-000000000099',
      })
    ).rejects.toBe(error)
    expect(adapter).toHaveBeenCalledTimes(1)
    expect(adapter.mock.calls[0][0].url).not.toContain('/monitoring/consumers/')
  })

  it('uses shell metadata for real e-service and descriptor IDs in DEV mock mode', async () => {
    const { ProducerServices } = await load(true, 'development', 'true')
    const descriptor = createMockEServiceDescriptorProvider()
    const realParams = {
      ...request,
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
    }
    adapter.mockImplementation(async (config) => ({
      config,
      data: descriptor,
      status: 200,
      statusText: 'OK',
      headers: {},
    }))

    const response = await ProducerServices.getEServiceMonitoringConsumerPurposes(realParams)

    expect(response.eservice).toEqual({
      id: descriptor.eservice.id,
      name: descriptor.eservice.name,
    })
    expect(response.consumer?.id).toBe(ids.consumerId)
    expect(adapter).toHaveBeenCalledTimes(1)
    expect(adapter.mock.calls[0][0].url).not.toContain('/monitoring/consumers/')
  })

  it('resolves every dashboard chevron fixture through the real DEV service without HTTP', async () => {
    const { ProducerServices } = await load(true, 'development', 'true')

    for (const { consumer } of mockProducerDashboardConsumers) {
      for (const row of mockProducerDashboardConsumerEServices[consumer.id]) {
        const response = await ProducerServices.getEServiceMonitoringConsumerPurposes({
          consumerId: consumer.id,
          eserviceId: row.eservice.id,
          descriptorId: row.descriptorId,
          offset: 0,
          limit: 5,
          includeArchived: false,
        })
        expect(response.consumer).toEqual(consumer)
        expect(response.eservice).toEqual(row.eservice)
        expect(response.version).toBe(row.version)
      }
    }
    expect(adapter).not.toHaveBeenCalled()
  })

  it('does not invent a relationship for another consumer on a dashboard fixture', async () => {
    const { ProducerServices } = await load(true, 'development', 'true')
    const owner = mockProducerDashboardConsumers[12].consumer
    const row = mockProducerDashboardConsumerEServices[owner.id][0]
    const response = await ProducerServices.getEServiceMonitoringConsumerPurposes({
      eserviceId: row.eservice.id,
      descriptorId: row.descriptorId,
      consumerId: '00000000-0000-4000-8000-000000000999',
      offset: 0,
      limit: 5,
    })

    expect(response.consumer).toBeUndefined()
    expect(response.eservice).toEqual(row.eservice)
    expect(response.results).toEqual([])
    expect(adapter).not.toHaveBeenCalled()
  })
})

describe('consumer purposes monitoring mock', () => {
  it.each(['DATE_DESC', 'DATE_ASC', 'NAME_ASC', 'NAME_DESC'] as const)(
    'filters, sorts and paginates by %s without mutating its fixture',
    (sortBy) => {
      const filters: GetProducerEServiceMonitoringConsumerPurposesParams = {
        ...request,
        q: 'Consultazione',
        states: ['ACTIVE'],
        sortBy,
      }
      const all = getMockProducerEServiceMonitoringConsumerPurposes({
        ...filters,
        offset: 0,
        limit: 50,
      })
      const page = getMockProducerEServiceMonitoringConsumerPurposes({
        ...filters,
        offset: 1,
        limit: 1,
      })
      const values = all.results.map(({ title, updatedAt }) =>
        sortBy.startsWith('NAME') ? title : updatedAt
      )
      const sorted = [...values].sort((a, b) => a.localeCompare(b, 'it'))

      expect(
        all.results.every(
          ({ state, title }) => state === 'ACTIVE' && title.includes('Consultazione')
        )
      ).toBe(true)
      expect(values).toEqual(sortBy.endsWith('DESC') ? sorted.reverse() : sorted)
      expect(page.results).toEqual(all.results.slice(1, 2))
      expect(page.pagination).toEqual({ offset: 1, limit: 1, totalCount: all.results.length })
    }
  )

  it('defaults to excluding archived purposes and omits consumer when no relationship exists', () => {
    const defaultPage = getMockProducerEServiceMonitoringConsumerPurposes({
      ...request,
      q: undefined,
      states: undefined,
      offset: 0,
      limit: 50,
    })
    const includingArchived = getMockProducerEServiceMonitoringConsumerPurposes({
      ...request,
      q: undefined,
      states: undefined,
      includeArchived: true,
      offset: 0,
      limit: 50,
    })
    const noRelationship = getMockProducerEServiceMonitoringConsumerPurposes({
      ...request,
      consumerId: '00000000-0000-4000-8000-000000000099',
    })

    expect(defaultPage.results.some(({ state }) => state === 'ARCHIVED')).toBe(false)
    expect(includingArchived.results.some(({ state }) => state === 'ARCHIVED')).toBe(true)
    expect(noRelationship).not.toHaveProperty('consumer')
    expect(noRelationship.results).toEqual([])
    expect(noRelationship.pagination.totalCount).toBe(0)
    expect(noRelationship.waitingForApprovalPurposes).toBe(0)
  })

  it('exposes waiting-for-approval purposes only for consumers with waiting calls in saturation', () => {
    const waitingFor = (index: number) =>
      getMockProducerEServiceMonitoringConsumerPurposes({
        ...request,
        consumerId: mockProducerDashboardConsumers[index].consumer.id,
        q: undefined,
        states: ['WAITING_FOR_APPROVAL'],
        offset: 0,
        limit: 1,
      })

    expect(waitingFor(0).pagination.totalCount).toBe(0)
    expect(waitingFor(0).waitingForApprovalPurposes).toBe(0)
    ;[1, 2, 3].forEach((index) => {
      const response = waitingFor(index)
      expect(response.consumer?.id).toBe(mockProducerDashboardConsumers[index].consumer.id)
      expect(response.pagination.totalCount).toBe(1)
      expect(response.waitingForApprovalPurposes).toBe(1)
      expect(response.results).toEqual([
        expect.objectContaining({ state: 'WAITING_FOR_APPROVAL', dailyCalls: 1000 }),
      ])
    })
    expect(waitingFor(4).pagination.totalCount).toBe(0)
    expect(waitingFor(4).waitingForApprovalPurposes).toBe(0)
  })

  it('counts waiting purposes before applying search, state, archived and pagination parameters', () => {
    const unfilteredRequest = {
      ...request,
      consumerId: mockProducerDashboardConsumers[1].consumer.id,
      q: undefined,
      states: undefined,
      offset: 0,
      limit: 50,
    }
    const unfiltered = getMockProducerEServiceMonitoringConsumerPurposes(unfilteredRequest)
    const waiting = unfiltered.results.filter(({ state }) => state === 'WAITING_FOR_APPROVAL')
    expect(waiting).toHaveLength(1)
    expect(unfiltered.waitingForApprovalPurposes).toBe(waiting.length)

    const variants: GetProducerEServiceMonitoringConsumerPurposesParams[] = [
      { ...unfilteredRequest, q: 'nessuna finalità corrispondente' },
      { ...unfilteredRequest, states: ['ACTIVE'], includeArchived: true },
      { ...unfilteredRequest, offset: unfiltered.pagination.totalCount, limit: 1 },
    ]
    for (const params of variants) {
      const response = getMockProducerEServiceMonitoringConsumerPurposes(params)
      expect(response.results.some(({ state }) => state === 'WAITING_FOR_APPROVAL')).toBe(false)
      expect(response.waitingForApprovalPurposes).toBe(waiting.length)
    }
  })
})
