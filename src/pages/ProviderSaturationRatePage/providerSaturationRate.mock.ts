import type { ProducerDashboardSaturationItem } from '@/api/api.generatedTypes'

export const providerSaturationRateMockItems = [
  {
    eservice: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Consultazione del registro delle imprese',
    },
    descriptorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    version: '1',
    activePurposesCount: 12,
    approvedDailyCalls: 840000,
    dailyCallsTotal: 1000000,
    percentage: 84,
    waitingForApprovalDailyCalls: 12000,
  },
  {
    eservice: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
      name: 'Verifica della posizione contributiva',
    },
    descriptorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    version: '2.1',
    activePurposesCount: 3,
    approvedDailyCalls: 245000,
    dailyCallsTotal: 500000,
    percentage: 49,
    waitingForApprovalDailyCalls: 5000,
  },
  {
    eservice: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31',
      name: 'Anagrafe nazionale della popolazione residente',
    },
    descriptorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32',
    version: '3',
    activePurposesCount: 27,
    approvedDailyCalls: 987500,
    dailyCallsTotal: 1000000,
    percentage: 99,
    waitingForApprovalDailyCalls: 500,
  },
  {
    eservice: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41',
      name: 'Elenco degli istituti scolastici',
    },
    descriptorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a42',
    version: '1.2',
    activePurposesCount: 1,
    approvedDailyCalls: 0,
    dailyCallsTotal: 100000,
    percentage: 0,
    waitingForApprovalDailyCalls: 0,
  },
  {
    eservice: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51',
      name: 'Pagamenti e rendicontazione degli enti',
    },
    descriptorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52',
    version: '4.0',
    activePurposesCount: 8,
    approvedDailyCalls: 1250000,
    dailyCallsTotal: 2500000,
    percentage: 50,
    waitingForApprovalDailyCalls: 35000,
  },
] satisfies ProducerDashboardSaturationItem[]
