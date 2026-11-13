import type {
  GetProducerEServiceMonitoringArchivingParams,
  GetProducerEServiceMonitoringParams,
  GetProducerEServiceMonitoringSaturationParams,
  MonitoringArchiving,
  ProducerEServiceMonitoring,
  ProducerEServiceMonitoringSaturation,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'
import { NotFoundError } from '@/utils/errors.utils'
import {
  mockProducerDashboardConsumerEServices,
  mockProducerDashboardConsumers,
} from './producer.mocks'

// The first consumer-detail link is a real fixture pair, not a wildcard for arbitrary IDs.
const selected =
  mockProducerDashboardConsumerEServices[mockProducerDashboardConsumers[0].consumer.id][0]
const eservice = selected.eservice
const descriptorId = selected.descriptorId
const otherDescriptorId = '20000000-0000-4000-8000-000000000001'
const oldestDescriptorId = '20000000-0000-4000-8000-000000000099'

const monitoring: ProducerEServiceMonitoring = {
  approvedDailyCalls: 38500,
  dailyCallsTotal: 50000,
  percentage: 77,
  waitingForApprovalNewPurposes: 4,
  waitingForApprovalQuotaChanges: 3,
  consumersByVersion: {
    total: 40,
    versions: [
      { descriptorId, version: selected.version, consumersCount: 25 },
      { descriptorId: otherDescriptorId, version: '2', consumersCount: 10 },
      { descriptorId: oldestDescriptorId, version: '0', consumersCount: 5 },
    ],
    medianUpgradeDays: 12,
  },
  consumersByKind: { total: 40, pa: 35, gspScp: 3, private: 2 },
  pendingAgreements: 1,
}

const archiving: MonitoringArchiving = {
  results: [
    {
      eservice,
      descriptorId: oldestDescriptorId,
      version: '0',
      consumersCount: 5,
      archivableOn: '2026-12-01T09:00:00Z',
    },
    {
      eservice,
      descriptorId,
      version: selected.version,
      consumersCount: 25,
      archivableOn: '2027-01-15T09:00:00Z',
    },
  ],
}

const saturation: ProducerEServiceMonitoringSaturation = {
  eservice,
  version: selected.version,
  otherVersions: [
    { descriptorId: otherDescriptorId, version: '2' },
    { descriptorId: oldestDescriptorId, version: '0' },
  ],
  dailyCallsPerConsumer: 10000,
  dailyCallsTotal: 50000,
  customizedQuotaConsumers: 0,
  activeConsumers: 25,
  results: Array.from({ length: 25 }, (_, index) => {
    const approvedDailyCalls = [0, 12000, 9000, 8000, 5500, 4000][index] ?? 0
    return {
      consumer: mockProducerDashboardConsumers[index]?.consumer ?? {
        id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
        name: `Ente territoriale ${index + 1}`,
        kind: 'PA',
      },
      activePurposesCount: index === 0 ? selected.activePurposesCount : index <= 5 ? index : 0,
      approvedDailyCalls,
      dailyCallsPerConsumer: 10000,
      percentage: approvedDailyCalls / 100,
      waitingForApprovalDailyCalls: index >= 1 && index <= 3 ? 1000 : 0,
    }
  }),
  pagination: { offset: 0, limit: 5, totalCount: 25 },
}

// Archived version fixture: lets the archiving-table chevron open a populated monitoring tab.
// E-service-wide counters (versions, kinds, pending agreements) intentionally stay identical.
const oldestApprovedDailyCalls = [2000, 1500, 1200, 800, 500]
const oldestMonitoring: ProducerEServiceMonitoring = {
  ...structuredClone(monitoring),
  approvedDailyCalls: 6000,
  percentage: 12,
  waitingForApprovalNewPurposes: 0,
  waitingForApprovalQuotaChanges: 0,
}

const oldestSaturation: ProducerEServiceMonitoringSaturation = {
  ...structuredClone(saturation),
  version: '0',
  otherVersions: [
    { descriptorId, version: selected.version },
    { descriptorId: otherDescriptorId, version: '2' },
  ],
  activeConsumers: oldestApprovedDailyCalls.length,
  results: oldestApprovedDailyCalls.map((approvedDailyCalls, index) => ({
    consumer: structuredClone(mockProducerDashboardConsumers[index + 5].consumer),
    activePurposesCount: 1,
    approvedDailyCalls,
    dailyCallsPerConsumer: 10000,
    percentage: approvedDailyCalls / 100,
    waitingForApprovalDailyCalls: 0,
  })),
  pagination: { offset: 0, limit: 5, totalCount: oldestApprovedDailyCalls.length },
}

const fixtures: Record<
  string,
  { monitoring: ProducerEServiceMonitoring; saturation: ProducerEServiceMonitoringSaturation }
> = {
  [descriptorId]: { monitoring, saturation },
  [oldestDescriptorId]: { monitoring: oldestMonitoring, saturation: oldestSaturation },
}

// Keep the offline dashboard fixture, but also support a real classic-page resource.
// Only monitoring is simulated: identity/version metadata and access errors come from the shell API.
export async function getMockMonitoringDescriptor(params: GetProducerEServiceMonitoringParams) {
  if (params.eserviceId === eservice.id) return undefined
  const { EServiceServices } = await import('@/api/eservice/eservice.services')
  return EServiceServices.getDescriptorProvider(params.eserviceId, params.descriptorId)
}

function getKnownDescriptorFixture(
  params: GetProducerEServiceMonitoringParams,
  descriptor?: ProducerEServiceDescriptor
) {
  if (descriptor) {
    if (descriptor.id !== params.descriptorId || descriptor.eservice.id !== params.eserviceId) {
      throw new NotFoundError('Mock monitoring resource not found')
    }
    const realEService = { id: descriptor.eservice.id, name: descriptor.eservice.name }
    const versions = descriptor.eservice.descriptors.map(({ id, version }) => ({
      descriptorId: id,
      version,
      consumersCount: 25,
    }))
    const total = versions.length * 25
    return {
      monitoring: {
        ...structuredClone(monitoring),
        consumersByVersion: {
          total,
          versions,
        },
        consumersByKind: {
          total,
          pa: versions.length * 20,
          gspScp: versions.length * 3,
          private: versions.length * 2,
        },
      },
      saturation: {
        ...structuredClone(saturation),
        eservice: realEService,
        version: descriptor.version,
        otherVersions: descriptor.eservice.descriptors
          .filter(({ id }) => id !== descriptor.id)
          .map(({ id, version }) => ({ descriptorId: id, version })),
      },
    }
  }
  const fixture = params.eserviceId === eservice.id ? fixtures[params.descriptorId] : undefined
  if (!fixture) {
    throw new NotFoundError('Mock monitoring resource not found')
  }
  return fixture
}

export function getMockProducerEServiceMonitoring(
  params: GetProducerEServiceMonitoringParams,
  descriptor?: ProducerEServiceDescriptor
): ProducerEServiceMonitoring {
  return structuredClone(getKnownDescriptorFixture(params, descriptor).monitoring)
}

export async function loadMockProducerEServiceMonitoringArchiving(
  params: GetProducerEServiceMonitoringArchivingParams
): Promise<MonitoringArchiving> {
  if (params.eserviceId === eservice.id) return getMockProducerEServiceMonitoringArchiving(params)
  const { EServiceServices } = await import('@/api/eservice/eservice.services')
  const resource = await EServiceServices.getSingle(params.eserviceId)
  if (!resource.latestActiveDescriptorId) return { results: [] }
  const descriptor = await EServiceServices.getDescriptorProvider(
    params.eserviceId,
    resource.latestActiveDescriptorId
  )
  // Simulated schedules must never link to synthetic descriptors on a real e-service.
  return {
    results: descriptor.eservice.descriptors.map((version, index) => ({
      eservice: { id: resource.id, name: resource.name },
      descriptorId: version.id,
      version: version.version,
      consumersCount: 25,
      archivableOn:
        version.archivableOn ?? archiving.results[index % archiving.results.length].archivableOn,
    })),
  }
}

export function getMockProducerEServiceMonitoringArchiving({
  eserviceId,
}: GetProducerEServiceMonitoringArchivingParams): MonitoringArchiving {
  return structuredClone(eserviceId === eservice.id ? archiving : { results: [] })
}

export function getMockProducerEServiceMonitoringSaturation(
  {
    eserviceId,
    descriptorId: requestedDescriptorId,
    offset,
    limit,
    q,
    sortBy = 'PERCENTAGE_DESC',
  }: GetProducerEServiceMonitoringSaturationParams,
  descriptor?: ProducerEServiceDescriptor
): ProducerEServiceMonitoringSaturation {
  const { saturation: fixture } = getKnownDescriptorFixture(
    {
      eserviceId,
      descriptorId: requestedDescriptorId,
    },
    descriptor
  )
  const query = q?.toLowerCase() ?? ''
  const filtered = fixture.results.filter(({ consumer }) =>
    consumer.name.toLowerCase().includes(query)
  )
  filtered.sort((a, b) => {
    const nameComparison = a.consumer.name.localeCompare(b.consumer.name, 'it')
    let comparison: number
    switch (sortBy) {
      case 'PERCENTAGE_ASC':
        comparison = a.percentage - b.percentage
        break
      case 'NAME_ASC':
        comparison = nameComparison
        break
      case 'NAME_DESC':
        comparison = -nameComparison
        break
      default:
        comparison = b.percentage - a.percentage
    }
    return comparison || nameComparison || a.consumer.id.localeCompare(b.consumer.id)
  })
  return structuredClone({
    ...fixture,
    results: filtered.slice(offset, offset + limit),
    pagination: { offset, limit, totalCount: filtered.length },
  })
}
