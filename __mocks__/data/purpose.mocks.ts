import type { Purpose, RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockPurpose = createMockFactory<Purpose>({
  agreement: { id: '3ec3875a-cf24-450a-b94b-550ca2ec5e86', state: 'ACTIVE', canBeUpgraded: false },
  clients: [],
  consumer: { id: '6b16be70-9230-4209-bd1f-7e5ae0eed289', name: 'PagoPa S.p.A.' },
  description: 'Lorem ipsum dolor sit amet...',
  eservice: {
    descriptor: {
      id: 'cd80bfe6-54be-493a-aaa1-6bb2b54545f8',
      state: 'PUBLISHED',
      version: '1',
      audience: [],
    },
    id: 'dea4bbf4-df64-4b8a-9ca9-125dd4cd1f5e',
    name: 'Test Attributi 2 - Ste',
    producer: { id: '6b16be70-9230-4209-bd1f-7e5ae0eed289', name: 'PagoPa S.p.A.' },
  },
  id: 'e46c7d27-18a0-40db-b7f9-ae8652355e8e',
  riskAnalysisForm: {
    answers: {
      checkedExistenceMereCorrectnessInteropCatalogue: ['true'],
      deliveryMethod: ['CLEARTEXT'],
      confirmPricipleIntegrityAndDiscretion: ['true'],
      usesThirdPartyData: ['NO'],
      purpose: ['INSTITUTIONAL'],
      doneDpia: ['NO'],
      personalDataTypes: ['WITH_NON_IDENTIFYING_DATA'],
      legalBasis: ['CONTRACT'],
      dataRetentionPeriod: ['true'],
      knowsDataQuantity: ['NO'],
      institutionalPurpose: ['test'],
      policyProvided: ['YES'],
      declarationConfirmGDPR: ['true'],
      purposePursuit: ['MERE_CORRECTNESS'],
    },
    version: '2.0',
  },
  suspendedByConsumer: false,
  suspendedByProducer: false,
  title: 'Nuova finalità',
  versions: [
    {
      createdAt: '2023-02-03T07:59:52.458Z',
      dailyCalls: 1,
      firstActivationAt: '2023-02-03T08:26:43.139Z',
      id: '3a5c9422-876c-4de8-828a-66586fd68b55',
      riskAnalysisDocument: {
        contentType: 'application/pdf',
        createdAt: '2023-02-03T08:26:43.049Z',
        id: '3562b028-0193-45fa-acf9-4bbe1ced352a',
      },
      state: 'ACTIVE',
    },
  ],
  waitingForApprovalVersion: undefined,
  currentVersion: {
    createdAt: '2023-02-03T07:59:52.458Z',
    dailyCalls: 1,
    firstActivationAt: '2023-02-03T08:26:43.139Z',
    id: '3a5c9422-876c-4de8-828a-66586fd68b55',
    riskAnalysisDocument: {
      contentType: 'application/pdf',
      createdAt: '2023-02-03T08:26:43.049Z',
      id: '3562b028-0193-45fa-acf9-4bbe1ced352a',
    },
    state: 'ACTIVE',
  },
  isFreeOfCharge: false,
  dailyCallsPerConsumer: 1,
  dailyCallsTotal: 10,
})

const createMockRiskAnalysisFormConfig = createMockFactory<RiskAnalysisFormConfig>({
  version: '2.0',
  questions: [
    {
      dataType: 'SINGLE',
      defaultValue: ['INSTITUTIONAL'],
      dependencies: [],
      id: 'purpose',
      label: {
        en: '',
        it: 'Question 1',
      },
      options: [
        {
          label: {
            en: '',
            it: 'option 1',
          },
          value: 'INSTITUTIONAL',
        },
        { label: { en: '', it: 'Other' }, value: 'OTHER' },
      ],
      required: true,
      visualType: 'radio',
    },
    {
      dataType: 'FREETEXT',
      defaultValue: [],
      dependencies: [{ id: 'purpose', value: 'OTHER' }],
      id: 'institutionalPurpose',
      label: {
        en: '',
        it: 'Question 2',
      },
      required: true,
      visualType: 'text',
    },
  ],
})

export { createMockPurpose, createMockRiskAnalysisFormConfig }
