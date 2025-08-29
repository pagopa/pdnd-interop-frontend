export const purposeTemplatesListMock = [
  {
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
            id: 'doc-001',
            text: 'Highly sensitive medical data',
            docs: [
              {
                id: 'doc-a',
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
    id: '22222222-2222-2222-2222-222222222222',
    targetDescription: 'Municipal service data',
    targetTenantKind: 'PA',
    creatorId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    state: 'ACTIVE',
    createdAt: '2025-08-28T14:22:10.000Z',
    updatedAt: '2025-08-28T14:22:10.000Z',
    purposeTitle: 'Smart City Management',
    purposeDescription: 'Optimize traffic and energy use',
    purposeRiskAnalysisForm: {
      version: '1.0',
      answers: {
        dataSensitivity: {
          value: 'medium',
          editable: true,
          annotation: {
            id: 'doc-002',
            text: 'Moderately sensitive infrastructure data',
            docs: [
              {
                id: 'doc-b',
                name: 'InfraDataGuide.pdf',
                contentType: 'application/pdf',
                prettyName: 'Infrastructure Data Guide',
                path: '/docs/infra-guide.pdf',
                createdAt: '2025-08-28T14:22:10.000Z',
              },
            ],
          },
          suggestedValues: ['medium'],
        },
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Governmental initiative',
    purposeDailyCalls: 2000000,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    targetDescription: 'Educational data sharing',
    targetTenantKind: 'PA',
    creatorId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    state: 'ACTIVE',
    createdAt: '2025-08-27T11:15:30.999Z',
    updatedAt: '2025-08-27T11:15:30.999Z',
    purposeTitle: 'School Performance Dashboard',
    purposeDescription: 'Track and analyze student performance',
    purposeRiskAnalysisForm: {
      version: '1.1',
      answers: {
        dataSensitivity: {
          value: 'high',
          editable: true,
          annotation: {
            id: 'doc-003',
            text: 'Student performance data',
            docs: [
              {
                id: 'doc-c',
                name: 'EducationPolicy.pdf',
                contentType: 'application/pdf',
                prettyName: 'Education Policy',
                path: '/docs/education-policy.pdf',
                createdAt: '2025-08-27T11:15:30.999Z',
              },
            ],
          },
          suggestedValues: ['high'],
        },
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Educational reform support',
    purposeDailyCalls: 100000,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    targetDescription: 'Transport ticketing',
    targetTenantKind: 'PA',
    creatorId: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    state: 'ACTIVE',
    createdAt: '2025-08-26T16:45:10.123Z',
    updatedAt: '2025-08-26T16:45:10.123Z',
    purposeTitle: 'Transit Payment Integration',
    purposeDescription: 'Unify payment systems across transit',
    purposeRiskAnalysisForm: {
      version: '1.0',
      answers: {
        dataSensitivity: {
          value: 'low',
          editable: true,
          annotation: {
            id: 'doc-004',
            text: 'Ticket purchase data only',
            docs: [
              {
                id: 'doc-d',
                name: 'TransitDataInfo.pdf',
                contentType: 'application/pdf',
                prettyName: 'Transit Data Info',
                path: '/docs/transit-data-info.pdf',
                createdAt: '2025-08-26T16:45:10.123Z',
              },
            ],
          },
          suggestedValues: ['low'],
        },
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Public transport optimization',
    purposeDailyCalls: 3000000,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    targetDescription: 'Environmental monitoring',
    targetTenantKind: 'PA',
    creatorId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    state: 'ACTIVE',
    createdAt: '2025-08-25T08:00:00.000Z',
    updatedAt: '2025-08-25T08:00:00.000Z',
    purposeTitle: 'Air Quality Tracker',
    purposeDescription: 'Collect and publish air quality data',
    purposeRiskAnalysisForm: {
      version: '1.2',
      answers: {
        dataSensitivity: {
          value: 'low',
          editable: true,
          annotation: {
            id: 'doc-005',
            text: 'No personal data involved',
            docs: [
              {
                id: 'doc-e',
                name: 'AirQualityMethodology.pdf',
                contentType: 'application/pdf',
                prettyName: 'Air Quality Methodology',
                path: '/docs/air-quality-methodology.pdf',
                createdAt: '2025-08-25T08:00:00.000Z',
              },
            ],
          },
          suggestedValues: ['low'],
        },
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Environmental transparency',
    purposeDailyCalls: 750000,
  },
]

export const purposeTemplateMock = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  targetDescription: 'string',
  targetTenantKind: 'PA',
  creatorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  state: 'ACTIVE',
  createdAt: '2025-08-29T09:12:31.854Z',
  updatedAt: '2025-08-29T09:12:31.854Z',
  purposeTitle: 'string',
  purposeDescription: 'string',
  purposeRiskAnalysisForm: {
    version: 'string',
    answers: {
      additionalProp1: {
        value: 'string',
        editable: true,
        annotation: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          text: 'string',
          docs: [
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: 'string',
              contentType: 'string',
              prettyName: 'string',
              path: 'string',
              createdAt: '2025-08-29T09:12:31.854Z',
            },
          ],
        },
        suggestedValues: ['string'],
      },
      additionalProp2: {
        value: 'string',
        editable: true,
        annotation: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          text: 'string',
          docs: [
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: 'string',
              contentType: 'string',
              prettyName: 'string',
              path: 'string',
              createdAt: '2025-08-29T09:12:31.854Z',
            },
          ],
        },
        suggestedValues: ['string'],
      },
      additionalProp3: {
        value: 'string',
        editable: true,
        annotation: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          text: 'string',
          docs: [
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: 'string',
              contentType: 'string',
              prettyName: 'string',
              path: 'string',
              createdAt: '2025-08-29T09:12:31.854Z',
            },
          ],
        },
        suggestedValues: ['string'],
      },
    },
  },
  purposeIsFreeOfCharge: true,
  purposeFreeOfChargeReason: 'string',
  purposeDailyCalls: 1000000000,
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

// Enums for Tenant Kind and State
export enum TenantKind {
  PA = 'PA',
  PRIVATE = 'PRIVATE',
  GSP = 'GSP',
  SCP = 'SCP',
}

export enum PurposeTemplateState {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  // Add other states if needed
}

// Supporting Types
export interface RiskAnalysisFormTemplate {
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

// Main PurposeTemplate type
export interface PurposeTemplate {
  /**
   * Business representation of a purpose template
   */

  id: string // UUID
  targetDescription: string
  targetTenantKind: TenantKind
  creatorId: string // UUID
  state: PurposeTemplateState
  createdAt: string // ISO 8601 datetime string
  updatedAt?: string // Optional ISO datetime
  purposeTitle: string
  purposeDescription: string
  purposeRiskAnalysisForm?: RiskAnalysisFormTemplate
  purposeIsFreeOfCharge: boolean
  purposeFreeOfChargeReason?: string
  purposeDailyCalls?: number // between 1 and 1_000_000_000
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

export interface RiskAnalysisTemplateAnswerAnnotationDocument {
  id: string // UUID
  name: string
  contentType: string
  prettyName: string
  path: string
  createdAt: string // ISO 8601 datetime string
}

// RiskAnalysisTemplateAnswerAnnotation Type
export interface RiskAnalysisTemplateAnswerAnnotation {
  id: string // UUID
  text: string
  docs: RiskAnalysisTemplateAnswerAnnotationDocument[] // Array of documents
}
