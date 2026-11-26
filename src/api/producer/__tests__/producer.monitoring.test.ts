import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, type AxiosAdapter } from 'axios'
import { QueryClient } from '@tanstack/react-query'
import type { ProducerEServiceMonitoring, MonitoringArchiving } from '@/api/api.generatedTypes'
import { NotFoundError } from '@/utils/errors.utils'
import { createMockEServiceDescriptorProvider } from '../../../../__mocks__/data/eservice.mocks'
import {
  mockProducerDashboardConsumerEServices,
  mockProducerDashboardConsumers,
} from '../../../../__mocks__/data/producer.mocks'
import {
  getMockProducerEServiceMonitoring,
  getMockProducerEServiceMonitoringArchiving,
  getMockProducerEServiceMonitoringSaturation,
} from '../../../../__mocks__/data/producer-monitoring.mocks'

const row = mockProducerDashboardConsumerEServices[mockProducerDashboardConsumers[0].consumer.id][0]
const ids = { eserviceId: row.eservice.id, descriptorId: row.descriptorId }
const preview = { ...ids, offset: 0, limit: 5, sortBy: 'PERCENTAGE_DESC' } as const
const adapter = vi.fn<AxiosAdapter>()
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
  if (originalFlag === undefined) delete process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD
  else process.env.REACT_APP_MOCK_PRODUCER_DASHBOARD = originalFlag
  Object.defineProperty(window, 'localStorage', originalStorage)
})

async function load(dev: boolean, mode: string, flag: string) {
  vi.stubEnv('DEV', dev)
  vi.stubEnv('MODE', mode)
  vi.stubEnv('REACT_APP_MOCK_PRODUCER_DASHBOARD', flag)
  const { default: axios } = await import('@/config/axios')
  axios.defaults.adapter = adapter
  const { ProducerServices, ProducerQueries } = await import('..')
  const { BACKEND_FOR_FRONTEND_URL } = await import('@/config/env')
  return { ProducerServices, ProducerQueries, BACKEND_FOR_FRONTEND_URL }
}

describe('e-service monitoring fixtures', () => {
  it('uses the selected resource and coherent generated counters and preview', () => {
    const data = getMockProducerEServiceMonitoring(ids)
    const page = getMockProducerEServiceMonitoringSaturation(preview)
    const archived = getMockProducerEServiceMonitoringArchiving(ids)
    expect(data).toMatchObject({
      approvedDailyCalls: 38500,
      dailyCallsTotal: 50000,
      percentage: 77,
      waitingForApprovalNewPurposes: 4,
      waitingForApprovalQuotaChanges: 3,
      consumersByVersion: { total: 40, medianUpgradeDays: 12 },
      consumersByKind: { total: 40, pa: 35, gspScp: 3, private: 2 },
      pendingAgreements: 1,
    })
    expect(data.consumersByVersion.versions.map((v) => v.consumersCount)).toEqual([25, 10, 5])
    expect(page.results.map((item) => item.approvedDailyCalls)).toEqual([
      12000, 9000, 8000, 5500, 4000,
    ])
    expect(page.results.reduce((sum, item) => sum + item.approvedDailyCalls, 0)).toBe(
      data.approvedDailyCalls
    )
    expect(page.pagination).toEqual({ offset: 0, limit: 5, totalCount: 25 })
    const selectedConsumer = getMockProducerEServiceMonitoringSaturation({
      ...preview,
      q: mockProducerDashboardConsumers[0].consumer.name,
    }).results[0]
    expect(selectedConsumer.approvedDailyCalls).toBe(row.approvedDailyCalls)
    expect(selectedConsumer.activePurposesCount).toBe(row.activePurposesCount)
    expect(archived.results).toHaveLength(2)
    expect(archived.results.every((item) => item.eservice.id === ids.eserviceId)).toBe(true)
    expect(archived.results.map((item) => item.archivableOn)).toEqual(
      archived.results.map((item) => item.archivableOn).sort()
    )
  })

  it.each(['PERCENTAGE_DESC', 'PERCENTAGE_ASC', 'NAME_ASC', 'NAME_DESC'] as const)(
    'filters, sorts and paginates by %s',
    (sortBy) => {
      const request = { ...preview, q: 'comune', sortBy }
      const all = getMockProducerEServiceMonitoringSaturation({ ...request, offset: 0, limit: 50 })
      const next = getMockProducerEServiceMonitoringSaturation({ ...request, offset: 1, limit: 1 })
      expect(all.results.length).toBeGreaterThan(1)
      expect(
        all.results.every(({ consumer }) => consumer.name.toLowerCase().includes('comune'))
      ).toBe(true)
      expect(next.results).toEqual(all.results.slice(1, 2))
      expect(next.pagination.totalCount).toBe(all.results.length)
      const values = all.results.map((item) =>
        sortBy.startsWith('NAME') ? item.consumer.name : item.percentage
      )
      const sorted = [...values].sort((a, b) =>
        typeof a === 'string' && typeof b === 'string'
          ? a.localeCompare(b, 'it')
          : Number(a) - Number(b)
      )
      expect(values).toEqual(sortBy.endsWith('DESC') ? sorted.reverse() : sorted)
    }
  )

  it('returns isolated copies and does not leak data to unknown resources', () => {
    const first = getMockProducerEServiceMonitoring(ids)
    first.consumersByVersion.versions[0].consumersCount = -1
    expect(
      getMockProducerEServiceMonitoring(ids).consumersByVersion.versions[0].consumersCount
    ).toBe(25)
    const firstPage = getMockProducerEServiceMonitoringSaturation(preview)
    firstPage.results[0].consumer.name = 'changed'
    expect(getMockProducerEServiceMonitoringSaturation(preview).results[0].consumer.name).not.toBe(
      'changed'
    )
    const archiving = getMockProducerEServiceMonitoringArchiving(ids)
    archiving.results[0].eservice.name = 'changed'
    expect(getMockProducerEServiceMonitoringArchiving(ids).results[0].eservice.name).not.toBe(
      'changed'
    )
    expect(() => getMockProducerEServiceMonitoring({ ...ids, descriptorId: 'unknown' })).toThrow(
      NotFoundError
    )
    expect(() =>
      getMockProducerEServiceMonitoringSaturation({ ...preview, eserviceId: 'unknown' })
    ).toThrow(NotFoundError)
    expect(getMockProducerEServiceMonitoringArchiving({ eserviceId: 'unknown' })).toEqual({
      results: [],
    })
  })

  it('rejects mismatched shell metadata instead of leaking a different resource into the mock', () => {
    const descriptor = createMockEServiceDescriptorProvider()
    expect(() => getMockProducerEServiceMonitoring(ids, descriptor)).toThrow(NotFoundError)
    expect(() =>
      getMockProducerEServiceMonitoringSaturation(
        { ...preview, eserviceId: descriptor.eservice.id },
        descriptor
      )
    ).toThrow(NotFoundError)
  })

  it('serves a populated fixture for every archiving row that carries a descriptor', () => {
    const { results } = getMockProducerEServiceMonitoringArchiving(ids)
    const archivedDescriptorIds = results.flatMap((item) =>
      item.descriptorId ? [item.descriptorId] : []
    )
    expect(archivedDescriptorIds).toContain(ids.descriptorId)
    expect(archivedDescriptorIds.some((id) => id !== ids.descriptorId)).toBe(true)

    for (const descriptorId of archivedDescriptorIds) {
      const params = { ...ids, descriptorId }
      const monitoring = getMockProducerEServiceMonitoring(params)
      const saturation = getMockProducerEServiceMonitoringSaturation({ ...preview, descriptorId })
      expect(saturation.results.length).toBeGreaterThan(0)
      expect(saturation.results.length).toBeLessThanOrEqual(5)
      const percentages = saturation.results.map(({ percentage }) => percentage)
      expect(percentages).toEqual([...percentages].sort((a, b) => b - a))
      // E-service-wide counters do not depend on the selected version.
      expect(monitoring.consumersByVersion).toEqual(
        getMockProducerEServiceMonitoring(ids).consumersByVersion
      )
      expect(monitoring.pendingAgreements).toBe(
        getMockProducerEServiceMonitoring(ids).pendingAgreements
      )
    }
  })
})

describe('monitoring service and query options', () => {
  it('mocks monitoring on an existing classic resource without mocking the shell or inventing version destinations', async () => {
    const { ProducerServices, BACKEND_FOR_FRONTEND_URL } = await load(true, 'development', 'true')
    const descriptor = createMockEServiceDescriptorProvider()
    const realIds = { eserviceId: descriptor.eservice.id, descriptorId: descriptor.id }
    descriptor.eservice.descriptors = [
      { id: descriptor.id, version: descriptor.version, state: 'PUBLISHED', audience: [] },
      {
        id: 'real-older-descriptor',
        version: '2',
        state: 'ARCHIVING',
        audience: [],
        archivableOn: '2027-01-01T00:00:00Z',
      },
    ]
    const base = `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${realIds.eserviceId}`
    adapter.mockImplementation(async (config) => ({
      config,
      data:
        config.url === base
          ? {
              id: realIds.eserviceId,
              name: descriptor.eservice.name,
              latestActiveDescriptorId: descriptor.id,
            }
          : {
              ...descriptor,
              id: config.url?.endsWith('/real-older-descriptor')
                ? 'real-older-descriptor'
                : descriptor.id,
              version: config.url?.endsWith('/real-older-descriptor') ? '2' : descriptor.version,
            },
      status: 200,
      statusText: 'OK',
      headers: {},
    }))

    const monitoring = await ProducerServices.getEServiceMonitoring(realIds)
    expect(monitoring.percentage).toBe(77)
    expect(monitoring.consumersByVersion.versions).toEqual([
      { descriptorId: descriptor.id, version: descriptor.version, consumersCount: 25 },
      { descriptorId: 'real-older-descriptor', version: '2', consumersCount: 25 },
    ])
    expect(monitoring.consumersByVersion.total).toBe(50)
    expect(monitoring.consumersByKind.total).toBe(50)
    const saturation = await ProducerServices.getEServiceMonitoringSaturation({
      ...realIds,
      offset: 1,
      limit: 2,
      sortBy: 'PERCENTAGE_DESC',
    })
    expect(saturation.eservice).toEqual({ id: realIds.eserviceId, name: descriptor.eservice.name })
    expect(saturation.version).toBe(descriptor.version)
    expect(saturation.otherVersions).toEqual([
      { descriptorId: 'real-older-descriptor', version: '2' },
    ])
    expect(saturation.results).toHaveLength(2)
    expect(saturation.pagination).toEqual({ offset: 1, limit: 2, totalCount: 25 })

    const archiving = await ProducerServices.getEServiceMonitoringArchiving(realIds)
    expect(archiving.results.map(({ descriptorId }) => descriptorId)).toEqual([
      descriptor.id,
      'real-older-descriptor',
    ])
    expect(archiving.results[1].archivableOn).toBe('2027-01-01T00:00:00Z')
    for (const row of archiving.results) {
      expect(row.eservice.id).toBe(realIds.eserviceId)
      await expect(
        ProducerServices.getEServiceMonitoring({
          eserviceId: row.eservice.id,
          descriptorId: row.descriptorId!,
        })
      ).resolves.toMatchObject({
        percentage: 77,
        consumersByVersion: monitoring.consumersByVersion,
      })
    }
    expect(
      adapter.mock.calls.every(
        ([config]) => config.url === base || config.url?.startsWith(`${base}/descriptors/`)
      )
    ).toBe(true)
    expect(adapter.mock.calls.some(([config]) => config.url?.includes('/monitoring'))).toBe(false)
  })

  it('does not mask real shell access/network errors behind successful mock data', async () => {
    const { ProducerServices } = await load(true, 'development', 'true')
    const error = new AxiosError('shell unavailable', AxiosError.ERR_NETWORK)
    adapter.mockRejectedValue(error)
    const realIds = { eserviceId: 'real-eservice', descriptorId: 'real-descriptor' }
    await expect(ProducerServices.getEServiceMonitoring(realIds)).rejects.toBe(error)
    await expect(
      ProducerServices.getEServiceMonitoringSaturation({
        ...realIds,
        offset: 0,
        limit: 5,
      })
    ).rejects.toBe(error)
    await expect(ProducerServices.getEServiceMonitoringArchiving(realIds)).rejects.toBe(error)
  })

  it('has no synthetic archiving destinations when the real service has no active descriptor', async () => {
    const { ProducerServices } = await load(true, 'development', 'true')
    adapter.mockImplementation(async (config) => ({
      config,
      data: { id: 'real-eservice', name: 'Archived service' },
      status: 200,
      statusText: 'OK',
      headers: {},
    }))
    await expect(
      ProducerServices.getEServiceMonitoringArchiving({
        eserviceId: 'real-eservice',
      })
    ).resolves.toEqual({ results: [] })
    expect(adapter).toHaveBeenCalledTimes(1)
  })

  it('uses populated mocks for fixture resources with consistent pagination', async () => {
    const { ProducerServices } = await load(true, 'development', 'true')
    await expect(ProducerServices.getEServiceMonitoring(ids)).resolves.toMatchObject({
      percentage: 77,
    })
    for (const params of [preview, { ...preview, offset: 7, limit: 2, q: 'Comune' }]) {
      await expect(ProducerServices.getEServiceMonitoringSaturation(params)).resolves.toEqual(
        getMockProducerEServiceMonitoringSaturation(params)
      )
    }
    await expect(ProducerServices.getEServiceMonitoringArchiving(ids)).resolves.toMatchObject({
      results: expect.arrayContaining([expect.objectContaining({ eservice: row.eservice })]),
    })
    await expect(
      ProducerServices.getEServiceMonitoring({ ...ids, descriptorId: 'unknown' })
    ).rejects.toMatchObject({
      name: 'Error',
      message: 'Mock monitoring resource not found',
    })
    expect(adapter).not.toHaveBeenCalled()
  })

  it.each([
    [true, 'development', 'false'],
    [true, 'test', 'true'],
    [false, 'development', 'true'],
    [false, 'production', 'true'],
  ])(
    'uses real transport with DEV=%s MODE=%s flag=%s, preserving responses and errors',
    async (dev, mode, flag) => {
      const { ProducerServices, BACKEND_FOR_FRONTEND_URL } = await load(dev, mode, flag)
      const body = getMockProducerEServiceMonitoring(ids)
      delete body.consumersByVersion.medianUpgradeDays
      delete body.consumersByVersion.olderVersionsConsumersCount
      const optionalArchiving: MonitoringArchiving = {
        results: [
          { eservice: row.eservice, consumersCount: 0, archivableOn: '2027-01-01T00:00:00Z' },
          {
            eservice: row.eservice,
            descriptorId: ids.descriptorId,
            consumersCount: 0,
            archivableOn: '2027-01-02T00:00:00Z',
          },
          {
            eservice: row.eservice,
            version: '1',
            consumersCount: 0,
            archivableOn: '2027-01-03T00:00:00Z',
          },
        ],
      }
      const saturationBody = getMockProducerEServiceMonitoringSaturation(preview)
      adapter.mockImplementation(async (config) => ({
        config,
        data: config.url?.endsWith('/archiving')
          ? optionalArchiving
          : config.url?.endsWith('/saturation')
            ? saturationBody
            : body,
        status: 200,
        statusText: 'OK',
        headers: {},
      }))
      const aggregate: ProducerEServiceMonitoring =
        await ProducerServices.getEServiceMonitoring(ids)
      expect(aggregate).toBe(body)
      expect(aggregate.consumersByVersion).not.toHaveProperty('medianUpgradeDays')
      expect(await ProducerServices.getEServiceMonitoringArchiving(ids)).toBe(optionalArchiving)
      expect(await ProducerServices.getEServiceMonitoringSaturation(preview)).toBe(saturationBody)
      const search = { ...preview, offset: 5, limit: 3, q: 'Comune', sortBy: 'NAME_ASC' } as const
      await ProducerServices.getEServiceMonitoringSaturation(search)
      const base = `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${ids.eserviceId}`
      expect(adapter.mock.calls.map(([config]) => [config.url, config.params])).toEqual([
        [`${base}/descriptors/${ids.descriptorId}/monitoring`, undefined],
        [`${base}/monitoring/archiving`, undefined],
        [
          `${base}/descriptors/${ids.descriptorId}/monitoring/saturation`,
          {
            offset: 0,
            limit: 5,
            sortBy: 'PERCENTAGE_DESC',
          },
        ],
        [
          `${base}/descriptors/${ids.descriptorId}/monitoring/saturation`,
          { offset: 5, limit: 3, q: 'Comune', sortBy: 'NAME_ASC' },
        ],
      ])
      const error = new AxiosError('network failure', AxiosError.ERR_NETWORK)
      adapter.mockRejectedValue(error)
      await expect(ProducerServices.getEServiceMonitoring(ids)).rejects.toBe(error)
      await expect(ProducerServices.getEServiceMonitoringArchiving(ids)).rejects.toBe(error)
      await expect(ProducerServices.getEServiceMonitoringSaturation(preview)).rejects.toBe(error)
      const notFound = new AxiosError('not found', AxiosError.ERR_BAD_RESPONSE)
      adapter.mockImplementation(async (config) => {
        notFound.config = config
        notFound.response = {
          config,
          data: undefined,
          status: 404,
          statusText: 'Not Found',
          headers: {},
        }
        throw notFound
      })
      const { NotFoundError: CurrentNotFoundError } = await import('@/utils/errors.utils')
      await expect(ProducerServices.getEServiceMonitoring(ids)).rejects.toBeInstanceOf(
        CurrentNotFoundError
      )
    }
  )

  it('keys queries by resource and all saturation request parameters', async () => {
    const { ProducerQueries } = await load(true, 'development', 'true')
    const counter = ProducerQueries.getEServiceMonitoring(ids)
    const archiving = ProducerQueries.getEServiceMonitoringArchiving({ eserviceId: ids.eserviceId })
    const saturation = ProducerQueries.getEServiceMonitoringSaturation(preview)
    expect(counter.queryKey).not.toEqual(
      ProducerQueries.getEServiceMonitoring({ ...ids, descriptorId: 'other' }).queryKey
    )
    expect(archiving.queryKey).not.toEqual(
      ProducerQueries.getEServiceMonitoringArchiving({ eserviceId: 'other' }).queryKey
    )
    expect(saturation.queryKey).not.toEqual(
      ProducerQueries.getEServiceMonitoringSaturation({ ...preview, offset: 5 }).queryKey
    )
    expect(saturation.queryKey).not.toEqual(
      ProducerQueries.getEServiceMonitoringSaturation({ ...preview, q: 'Comune' }).queryKey
    )
    expect(saturation.queryKey).not.toEqual(
      ProducerQueries.getEServiceMonitoringSaturation({ ...preview, sortBy: 'NAME_ASC' }).queryKey
    )
    expect(counter.queryKey).not.toEqual(saturation.queryKey)
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    expect(await client.fetchQuery(counter)).toMatchObject({ percentage: 77 })
    expect(await client.fetchQuery(archiving)).toMatchObject({ results: expect.any(Array) })
    expect(await client.fetchQuery(saturation)).toMatchObject({ pagination: { totalCount: 25 } })
    client.clear()
  })
})
