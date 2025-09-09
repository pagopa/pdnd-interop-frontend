import type { TenantKind } from '../api.generatedTypes'

export const purposeTemplatesListMock: Array<PurposeTemplate> = [
  {
    description: 'Business representation of a healthcare purpose template',
    id: '11111111-1111-1111-1111-111111111111',
    targetDescription: 'Healthcare data processing',
    targetTenantKind: 'PA',
    creatorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    state: 'ACTIVE',
    createdAt: '2025-08-29T09:01:20.116Z',
    updatedAt: '2025-08-29T09:01:20.116Z',
    purposeTitle: 'Medical Analysis',
    purposeDescription: 'Analyze patient data for diagnostics',
    purposeRiskAnalysisForm: {
      version: '1.0',
      answers: {
        dataSensitivity: {
          value: 'high',
          editable: true,
          annotation: {
            id: 'annotation-001',
            text: 'Highly sensitive medical data',
            docs: [
              {
                id: 'doc-001',
                name: 'PrivacyPolicy.pdf',
                contentType: 'application/pdf',
                prettyName: 'Privacy Policy',
                path: '/docs/privacy-policy.pdf',
                createdAt: '2025-08-29T09:01:20.116Z',
              },
            ],
          },
          suggestedValues: ['high', 'medium', 'low'],
        },
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Public service',
    purposeDailyCalls: 500000,
  },
  {
    description: 'Business representation of an educational purpose template',
    id: '22222222-2222-2222-2222-222222222222',
    targetDescription: 'Student data processing',
    targetTenantKind: 'PA',
    creatorId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    state: 'ACTIVE',
    createdAt: '2025-08-28T10:02:30.116Z',
    updatedAt: '2025-08-28T10:02:30.116Z',
    purposeTitle: 'Student Performance Analysis',
    purposeDescription: 'Analyze student performance data for grading purposes',
    purposeRiskAnalysisForm: {
      version: '1.0',
      answers: {
        dataSensitivity: {
          value: 'medium',
          editable: false,
          annotation: {
            id: 'annotation-002',
            text: 'This data involves educational records',
            docs: [
              {
                id: 'doc-002',
                name: 'DataProtectionPolicy.pdf',
                contentType: 'application/pdf',
                prettyName: 'Data Protection Policy',
                path: '/docs/data-protection-policy.pdf',
                createdAt: '2025-08-28T10:02:30.116Z',
              },
            ],
          },
          suggestedValues: ['high', 'medium', 'low'],
        },
      },
    },
    purposeIsFreeOfCharge: false,
    purposeFreeOfChargeReason: 'Subscription-based',
    purposeDailyCalls: 100000,
  },
  {
    description: 'Business representation of a financial services purpose template',
    id: '33333333-3333-3333-3333-333333333333',
    targetDescription: 'Financial data processing',
    targetTenantKind: 'PA',
    creatorId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    state: 'ACTIVE',
    createdAt: '2025-08-27T08:03:40.116Z',
    updatedAt: '2025-08-27T08:03:40.116Z',
    purposeTitle: 'Credit Scoring Analysis',
    purposeDescription: 'Analyze financial data for credit scoring purposes',
    purposeRiskAnalysisForm: {
      version: '1.0',
      answers: {
        dataSensitivity: {
          value: 'high',
          editable: true,
          annotation: {
            id: 'annotation-003',
            text: 'Sensitive financial data for credit evaluation',
            docs: [
              {
                id: 'doc-003',
                name: 'FinancialDataPolicy.pdf',
                contentType: 'application/pdf',
                prettyName: 'Financial Data Policy',
                path: '/docs/financial-data-policy.pdf',
                createdAt: '2025-08-27T08:03:40.116Z',
              },
            ],
          },
          suggestedValues: ['high', 'medium', 'low'],
        },
      },
    },
    purposeIsFreeOfCharge: false,
    purposeFreeOfChargeReason: 'Paid service',
    purposeDailyCalls: 200000,
  },
  {
    description: 'Business representation of a government services purpose template',
    id: '44444444-4444-4444-4444-444444444444',
    targetDescription: 'Government data processing',
    targetTenantKind: 'PA',
    creatorId: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    state: 'SUSPENDED',
    createdAt: '2025-08-26T07:04:50.116Z',
    updatedAt: '2025-08-26T07:04:50.116Z',
    purposeTitle: 'Public Record Processing',
    purposeDescription: 'Process public records for government purposes',
    purposeRiskAnalysisForm: {
      version: '1.0',
      answers: {
        dataSensitivity: {
          value: 'low',
          editable: false,
          annotation: {
            id: 'annotation-004',
            text: 'Non-sensitive government records',
            docs: [
              {
                id: 'doc-004',
                name: 'GovernmentPolicy.pdf',
                contentType: 'application/pdf',
                prettyName: 'Government Policy',
                path: '/docs/government-policy.pdf',
                createdAt: '2025-08-26T07:04:50.116Z',
              },
            ],
          },
          suggestedValues: ['high', 'medium', 'low'],
        },
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Public service',
    purposeDailyCalls: 750000,
  },
  {
    description: 'Business representation of a research purposes template',
    id: '55555555-5555-5555-5555-555555555555',
    targetDescription: 'Research data processing',
    targetTenantKind: 'GSP',
    creatorId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    state: 'ACTIVE',
    createdAt: '2025-08-25T06:05:00.116Z',
    updatedAt: '2025-08-25T06:05:00.116Z',
    purposeTitle: 'Research Data Analysis',
    purposeDescription: 'Analyze research data for scientific studies',
    purposeRiskAnalysisForm: {
      version: '1.0',
      answers: {
        dataSensitivity: {
          value: 'medium',
          editable: true,
          annotation: {
            id: 'annotation-005',
            text: 'Research data for scientific purposes',
            docs: [
              {
                id: 'doc-005',
                name: 'ResearchPolicy.pdf',
                contentType: 'application/pdf',
                prettyName: 'Research Policy',
                path: '/docs/research-policy.pdf',
                createdAt: '2025-08-25T06:05:00.116Z',
              },
            ],
          },
          suggestedValues: ['high', 'medium', 'low'],
        },
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Government grant',
    purposeDailyCalls: 300000,
  },
]

export const purposeTemplateMock: PurposeTemplate = {
  description: 'Business representation of a research purposes template',
  id: '55555555-5555-5555-5555-555555555555',
  targetDescription: 'Research data processing',
  targetTenantKind: 'GSP',
  creatorId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  state: 'ACTIVE',
  createdAt: '2025-08-25T06:05:00.116Z',
  updatedAt: '2025-08-25T06:05:00.116Z',
  purposeTitle: 'Research Data Analysis',
  purposeDescription: 'Analyze research data for scientific studies',
  purposeRiskAnalysisForm: {
    version: '1.0',
    answers: {
      dataSensitivity: {
        value: 'medium',
        editable: true,
        annotation: {
          id: 'annotation-005',
          text: 'Research data for scientific purposes',
          docs: [
            {
              id: 'doc-005',
              name: 'ResearchPolicy.pdf',
              contentType: 'application/pdf',
              prettyName: 'Research Policy',
              path: '/docs/research-policy.pdf',
              createdAt: '2025-08-25T06:05:00.116Z',
            },
          ],
        },
        suggestedValues: ['high', 'medium', 'low'],
      },
    },
  },
  purposeIsFreeOfCharge: true,
  purposeFreeOfChargeReason: 'Government grant',
  purposeDailyCalls: 300000,
}

export const eservicesLinkedToPurposeTemplatesMock = [
  {
    purposeTemplateId: '11111111-1111-1111-1111-111111111111',
    eserviceId: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    createdAt: '2025-08-29T10:50:57.365Z',
  },
  {
    purposeTemplateId: '22222222-2222-2222-2222-222222222222',
    eserviceId: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    createdAt: '2025-08-28T14:22:45.100Z',
  },
  {
    purposeTemplateId: '33333333-3333-3333-3333-333333333333',
    eserviceId: 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    createdAt: '2025-08-27T08:30:00.000Z',
  },
  {
    purposeTemplateId: '44444444-4444-4444-4444-444444444444',
    eserviceId: 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    createdAt: '2025-08-26T12:15:10.789Z',
  },
  {
    purposeTemplateId: '55555555-5555-5555-5555-555555555555',
    eserviceId: 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb5-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    createdAt: '2025-08-25T09:00:05.432Z',
  },
]

export const purposeTemplateEservicesMock = [
  {
    purposeTemplateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    eserviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    descriptorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    createdAt: '2025-07-19T11:03:53.155Z',
  },
  {
    purposeTemplateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    eserviceId: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    createdAt: '2025-08-29T11:03:53.155Z',
  },
  {
    purposeTemplateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    eserviceId: 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    createdAt: '2025-06-01T11:03:53.155Z',
  },
]

export type PurposeTemplateState = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'

type RiskAnalysisTemplateAnswerAnnotationDocument = {
  id: string // UUID
  name: string // Document name (e.g., 'PrivacyPolicy.pdf')
  contentType: string // MIME type (e.g., 'application/pdf')
  prettyName: string // Display name (e.g., 'Privacy Policy')
  path: string // Path to the document (e.g., '/docs/privacy-policy.pdf')
  createdAt: string // ISO date-time string (e.g., '2025-08-29T09:01:20.116Z')
}

export type RiskAnalysisTemplateAnswerAnnotation = {
  id: string // UUID
  text: string // Annotation text
  docs: RiskAnalysisTemplateAnswerAnnotationDocument[] // List of documents associated with the annotation
}

type RiskAnalysisTemplateAnswer = {
  value: string // The answer value (string)
  editable: boolean // Whether the answer is editable
  annotation: RiskAnalysisTemplateAnswerAnnotation // The annotation associated with the answer
  suggestedValues: string[] // An array of suggested values for the answer
}

type RiskAnalysisFormTemplate = {
  version: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: any
}

export type PurposeTemplate = {
  description: string
  id: string // UUID
  targetDescription: string
  targetTenantKind: TenantKind // TenantKind from the enum
  creatorId: string // UUID
  state: PurposeTemplateState // State from the PurposeTemplateState enum
  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
  purposeTitle: string
  purposeDescription: string
  purposeRiskAnalysisForm: RiskAnalysisFormTemplate
  purposeIsFreeOfCharge: boolean
  purposeFreeOfChargeReason: string
  purposeDailyCalls: number // Must be between 1 and 1,000,000,000
}
export interface RiskAnalysisFormTemplateSeed {
  version: string
  questions: Record<
    string,
    {
      question: string
      suggestedValues?: string[]
      required?: boolean
    }
  >
}

export interface PurposeTemplateSeed {
  targetDescription: string
  targetTenantKind: TenantKind
  purposeTitle: string
  purposeDescription: string
  purposeRiskAnalysisForm?: RiskAnalysisFormTemplateSeed
  purposeIsFreeOfCharge: boolean
  purposeDailyCalls?: number // min: 1, max: 1_000_000_000
}

export interface UpdateEServiceDescriptorPurposeTemplateSeed {
  eserviceId: string // UUID
  descriptorId: string // UUID
}

export interface GetConsumerPurposeTemplatesParams {
  /** Query to filter EServices by name */
  q?: string
  /**
   * comma separated sequence of consumers IDs
   * @default []
   */
  eservicesIds?: string[]
  states?: PurposeTemplateState[]
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface PurposeTemplateUpdateContent {
  title: string
  description: string
  isFreeOfCharge: boolean
  freeOfChargeReason?: string
  riskAnalysisForm?: RiskAnalysisFormTemplateSeed
  /**
   * maximum number of daily calls that this version can perform.
   * @format int32
   */
  dailyCalls?: number
}
