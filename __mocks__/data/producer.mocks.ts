import type {
  CompactEServiceLight,
  GetProducerDashboardConsumerParams,
  GetProducerDashboardConsumersParams,
  GetProducerDashboardSaturationParams,
  MonitoringArchiving,
  ProducerDashboard,
  ProducerDashboardConsumer,
  ProducerDashboardConsumerEService,
  ProducerDashboardConsumerItem,
  ProducerDashboardConsumers,
  ProducerDashboardSaturation,
} from '@/api/api.generatedTypes'

export const mockProducerDashboard: ProducerDashboard = {
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
  alignment: {
    aligned: 200,
    agreementWithoutPurposes: 30,
    purposesWithoutAgreement: 5,
  },
  averageActivePurposesPerEService: 3.4,
}

export const mockProducerDashboardSaturation: ProducerDashboardSaturation = {
  summary: { overThreshold: 2, nearThreshold: 2, total: 6 },
  results: [
    {
      eservice: { id: '10000000-0000-4000-8000-000000000001', name: 'Anagrafe Nazionale' },
      descriptorId: '20000000-0000-4000-8000-000000000001',
      version: '2',
      activePurposesCount: 12,
      approvedDailyCalls: 12500,
      dailyCallsTotal: 10000,
      percentage: 125,
      waitingForApprovalDailyCalls: 2000,
    },
    {
      eservice: { id: '10000000-0000-4000-8000-000000000002', name: 'Catasto Fabbricati' },
      descriptorId: '20000000-0000-4000-8000-000000000002',
      version: '1',
      activePurposesCount: 8,
      approvedDailyCalls: 11000,
      dailyCallsTotal: 10000,
      percentage: 110,
      waitingForApprovalDailyCalls: 500,
    },
    {
      eservice: { id: '10000000-0000-4000-8000-000000000003', name: 'Certificati Anagrafici' },
      descriptorId: '20000000-0000-4000-8000-000000000003',
      version: '3',
      activePurposesCount: 7,
      approvedDailyCalls: 9500,
      dailyCallsTotal: 10000,
      percentage: 95,
      waitingForApprovalDailyCalls: 1000,
    },
    {
      eservice: { id: '10000000-0000-4000-8000-000000000004', name: 'Fascicolo Sanitario' },
      descriptorId: '20000000-0000-4000-8000-000000000004',
      version: '2',
      activePurposesCount: 6,
      approvedDailyCalls: 9000,
      dailyCallsTotal: 10000,
      percentage: 90,
      waitingForApprovalDailyCalls: 0,
    },
    {
      eservice: { id: '10000000-0000-4000-8000-000000000005', name: 'Indice PA' },
      descriptorId: '20000000-0000-4000-8000-000000000005',
      version: '1',
      activePurposesCount: 4,
      approvedDailyCalls: 7000,
      dailyCallsTotal: 10000,
      percentage: 70,
      waitingForApprovalDailyCalls: 300,
    },
    {
      eservice: { id: '10000000-0000-4000-8000-000000000006', name: 'Mobilità Urbana' },
      descriptorId: '20000000-0000-4000-8000-000000000006',
      version: '1',
      activePurposesCount: 2,
      approvedDailyCalls: 2500,
      dailyCallsTotal: 10000,
      percentage: 25,
      waitingForApprovalDailyCalls: 0,
    },
  ],
  pagination: { offset: 0, limit: 6, totalCount: 6 },
}

export function getMockProducerDashboardSaturation({
  offset,
  limit,
  q,
  sortBy = 'PERCENTAGE_DESC',
}: GetProducerDashboardSaturationParams): ProducerDashboardSaturation {
  const query = q?.toLowerCase() ?? ''
  // Filter before sorting so the shared fixture keeps its original order.
  const filtered = mockProducerDashboardSaturation.results.filter(({ eservice }) =>
    eservice.name.toLowerCase().includes(query)
  )

  filtered.sort((a, b) => {
    const nameComparison = a.eservice.name.localeCompare(b.eservice.name, 'it')
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

    return (
      comparison ||
      nameComparison ||
      a.eservice.id.localeCompare(b.eservice.id) ||
      a.descriptorId.localeCompare(b.descriptorId)
    )
  })

  return structuredClone({
    summary: mockProducerDashboardSaturation.summary,
    results: filtered.slice(offset, offset + limit),
    pagination: { offset, limit, totalCount: filtered.length },
  })
}

export const mockProducerDashboardArchiving: MonitoringArchiving = {
  results: [
    {
      eservice: { id: '10000000-0000-4000-8000-000000000003', name: 'Certificati Anagrafici' },
      descriptorId: '20000000-0000-4000-8000-000000000003',
      version: '1',
      consumersCount: 8,
      archivableOn: '2026-11-10T09:00:00Z',
    },
    {
      eservice: { id: '10000000-0000-4000-8000-000000000006', name: 'Mobilità Urbana' },
      consumersCount: 3,
      archivableOn: '2026-12-01T09:00:00Z',
    },
  ],
}

export const mockProducerDashboardConsumers: ProducerDashboardConsumerItem[] = [
  {
    consumer: { id: '00000000-0000-4000-8000-000000000001', name: 'Comune di Roma', kind: 'PA' },
    eservicesCount: 8,
    activePurposesCount: 16,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000002', name: 'Regione Lazio', kind: 'PA' },
    eservicesCount: 12,
    activePurposesCount: 25,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000003', name: 'Comune di Milano', kind: 'PA' },
    eservicesCount: 8,
    activePurposesCount: 10,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000004', name: 'Università di Bologna' },
    eservicesCount: 4,
    activePurposesCount: 7,
  },
  {
    consumer: {
      id: '00000000-0000-4000-8000-000000000005',
      name: 'Servizi Digitali',
      kind: 'PRIVATE',
    },
    eservicesCount: 6,
    activePurposesCount: 9,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000006', name: 'Comune di Napoli', kind: 'PA' },
    eservicesCount: 3,
    activePurposesCount: 5,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000007', name: 'Regione Toscana', kind: 'PA' },
    eservicesCount: 10,
    activePurposesCount: 18,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000008', name: 'Acqua Pubblica', kind: 'GSP' },
    eservicesCount: 2,
    activePurposesCount: 3,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000009', name: 'Comune di Torino', kind: 'PA' },
    eservicesCount: 6,
    activePurposesCount: 12,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000010', name: 'Agenzia Mobilità' },
    eservicesCount: 1,
    activePurposesCount: 0,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000011', name: 'Comune di Firenze', kind: 'PA' },
    eservicesCount: 5,
    activePurposesCount: 8,
  },
  {
    consumer: {
      id: '00000000-0000-4000-8000-000000000012',
      name: 'Consorzio Innovazione',
      kind: 'SCP',
    },
    eservicesCount: 4,
    activePurposesCount: 6,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000013', name: 'Regione Lombardia', kind: 'PA' },
    eservicesCount: 15,
    activePurposesCount: 31,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000014', name: 'Istituto di Ricerca' },
    eservicesCount: 0,
    activePurposesCount: 0,
  },
  {
    consumer: {
      id: '00000000-0000-4000-8000-000000000015',
      name: 'Servizi Digitali',
      kind: 'PRIVATE',
    },
    eservicesCount: 6,
    activePurposesCount: 11,
  },
  {
    consumer: { id: '00000000-0000-4000-8000-000000000016', name: 'Comune di Bari', kind: 'PA' },
    eservicesCount: 3,
    activePurposesCount: 4,
  },
]

export function getMockProducerDashboardConsumers({
  offset,
  limit,
  q,
  sortBy = 'NAME_ASC',
}: GetProducerDashboardConsumersParams): ProducerDashboardConsumers {
  const query = q?.toLowerCase() ?? ''
  // filter creates a new array before sorting; the shared fixture is never reordered.
  const filtered = mockProducerDashboardConsumers.filter(({ consumer }) =>
    consumer.name.toLowerCase().includes(query)
  )

  filtered.sort((a, b) => {
    const nameComparison = a.consumer.name.localeCompare(b.consumer.name, 'it')
    let comparison: number
    switch (sortBy) {
      case 'NAME_DESC':
        comparison = -nameComparison
        break
      case 'ESERVICES_COUNT_DESC':
        comparison = b.eservicesCount - a.eservicesCount
        break
      case 'ESERVICES_COUNT_ASC':
        comparison = a.eservicesCount - b.eservicesCount
        break
      default:
        comparison = nameComparison
    }

    return comparison || nameComparison || a.consumer.id.localeCompare(b.consumer.id)
  })

  return structuredClone({
    totalConsumers: mockProducerDashboardConsumers.length,
    results: filtered.slice(offset, offset + limit),
    pagination: { offset, limit, totalCount: filtered.length },
  })
}

const mockConsumerEServiceCatalog: CompactEServiceLight[] = [
  { id: '10000000-0000-4000-8000-000000000001', name: 'Anagrafe Nazionale' },
  { id: '10000000-0000-4000-8000-000000000002', name: 'Catasto Fabbricati' },
  { id: '10000000-0000-4000-8000-000000000003', name: 'Certificati Anagrafici' },
  { id: '10000000-0000-4000-8000-000000000004', name: 'Fascicolo Sanitario' },
  { id: '10000000-0000-4000-8000-000000000005', name: 'Indice PA' },
  { id: '10000000-0000-4000-8000-000000000006', name: 'Mobilità Urbana' },
  { id: '10000000-0000-4000-8000-000000000007', name: 'Notifiche Digitali' },
  { id: '10000000-0000-4000-8000-000000000008', name: 'Pagamenti PA' },
  { id: '10000000-0000-4000-8000-000000000009', name: 'Registro Imprese' },
  { id: '10000000-0000-4000-8000-000000000010', name: 'Residenza Online' },
  { id: '10000000-0000-4000-8000-000000000011', name: 'Servizi Scolastici' },
  { id: '10000000-0000-4000-8000-000000000012', name: 'Stato Civile' },
  { id: '10000000-0000-4000-8000-000000000013', name: 'Tributi Locali' },
  { id: '10000000-0000-4000-8000-000000000014', name: 'Verifica ISEE' },
  { id: '10000000-0000-4000-8000-000000000015', name: 'Zone Traffico Limitato' },
]

/**
 * Deterministic per-consumer rows derived from the list fixture: each consumer gets exactly
 * `eservicesCount` rows and its `activePurposesCount` is distributed across them, so list and
 * detail mocks reconcile. Regione Lombardia (15 rows) spans multiple pages for small limits.
 */
function buildMockConsumerEServices(
  { eservicesCount, activePurposesCount }: ProducerDashboardConsumerItem,
  consumerIndex: number
): ProducerDashboardConsumerEService[] {
  const consumerCode = String(consumerIndex + 1).padStart(2, '0')
  const basePurposes = Math.floor(activePurposesCount / eservicesCount)
  const extraPurposes = activePurposesCount % eservicesCount

  return Array.from({ length: eservicesCount }, (_, index) => {
    const catalogIndex = (consumerIndex + index) % mockConsumerEServiceCatalog.length
    const rowCode = `0000000${consumerCode}${String(catalogIndex + 1).padStart(3, '0')}`

    return {
      eservice: mockConsumerEServiceCatalog[catalogIndex],
      descriptorId: `20000000-0000-4000-8000-${rowCode}`,
      version: String((catalogIndex % 3) + 1),
      agreement: {
        id: `30000000-0000-4000-8000-${rowCode}`,
        state: index % 4 === 3 ? 'SUSPENDED' : 'ACTIVE',
      },
      activePurposesCount: basePurposes + (index < extraPurposes ? 1 : 0),
      approvedDailyCalls: (((consumerIndex + 1) * 7 + (index + 1) * 3) % 5) * 1000,
    }
  })
}

export const mockProducerDashboardConsumerEServices: Record<
  string,
  ProducerDashboardConsumerEService[]
> = Object.fromEntries(
  mockProducerDashboardConsumers.map((item, index) => [
    item.consumer.id,
    buildMockConsumerEServices(item, index),
  ])
)

export function getMockProducerDashboardConsumer({
  consumerId,
  offset,
  limit,
  q,
  sortBy = 'NAME_ASC',
}: GetProducerDashboardConsumerParams): ProducerDashboardConsumer {
  const consumer = mockProducerDashboardConsumers.find(
    (item) => item.consumer.id === consumerId
  )?.consumer

  // No producer relation: consumer absent, zero totals, empty page (never a fake 404).
  if (!consumer) {
    return { eservicesCount: 0, results: [], pagination: { offset, limit, totalCount: 0 } }
  }

  const eservices = mockProducerDashboardConsumerEServices[consumerId]
  const query = q?.toLowerCase() ?? ''
  // filter creates a new array before sorting; the shared fixture is never reordered.
  const filtered = eservices.filter(({ eservice }) => eservice.name.toLowerCase().includes(query))

  filtered.sort((a, b) => {
    const nameComparison = a.eservice.name.localeCompare(b.eservice.name, 'it')
    let comparison: number
    switch (sortBy) {
      case 'NAME_DESC':
        comparison = -nameComparison
        break
      case 'DAILY_CALLS_DESC':
        comparison = b.approvedDailyCalls - a.approvedDailyCalls
        break
      case 'DAILY_CALLS_ASC':
        comparison = a.approvedDailyCalls - b.approvedDailyCalls
        break
      default:
        comparison = nameComparison
    }

    return (
      comparison ||
      nameComparison ||
      a.eservice.id.localeCompare(b.eservice.id) ||
      a.descriptorId.localeCompare(b.descriptorId)
    )
  })

  return structuredClone({
    consumer,
    eservicesCount: eservices.length,
    results: filtered.slice(offset, offset + limit),
    pagination: { offset, limit, totalCount: filtered.length },
  })
}
