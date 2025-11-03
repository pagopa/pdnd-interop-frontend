import type {
  CatalogEService,
  CatalogPurposeTemplates,
  TenantKind,
  EServiceDescriptorState,
} from '../api.generatedTypes'

const createDocument = (
  id: string,
  name: string,
  prettyName: string,
  path: string,
  createdAt: string
): RiskAnalysisTemplateAnswerAnnotationDocument => ({
  id,
  name,
  contentType: 'application/pdf',
  prettyName,
  path,
  createdAt,
})

const createAnnotation = (
  id: string,
  text: string,
  docId: string,
  docName: string,
  docPrettyName: string,
  docPath: string,
  createdAt: string
): RiskAnalysisTemplateAnswerAnnotation => ({
  id,
  text,
  docs: [createDocument(docId, docName, docPrettyName, docPath, createdAt)],
})

const createRiskAnalysisAnswer = (
  value: string,
  editable: boolean,
  annotation: RiskAnalysisTemplateAnswerAnnotation
): RiskAnalysisTemplateAnswer => ({
  value,
  editable,
  annotation,
  suggestedValues: ['high', 'medium', 'low'],
})

const createRiskAnalysisForm = (answer: RiskAnalysisTemplateAnswer): RiskAnalysisFormTemplate => ({
  version: '1.0',
  answers: { dataSensitivity: answer },
})

const createPurposeTemplate = (
  id: string,
  description: string,
  targetDescription: string,
  targetTenantKind: TenantKind,
  creatorId: string,
  state: PurposeTemplateState,
  createdAt: string,
  updatedAt: string,
  purposeTitle: string,
  purposeDescription: string,
  riskAnalysisAnswer: RiskAnalysisTemplateAnswer,
  purposeIsFreeOfCharge: boolean,
  purposeFreeOfChargeReason: string,
  purposeDailyCalls: number
): PurposeTemplate => ({
  description,
  id,
  targetDescription,
  targetTenantKind,
  creatorId,
  state,
  createdAt,
  updatedAt,
  purposeTitle,
  purposeDescription,
  purposeRiskAnalysisForm: createRiskAnalysisForm(riskAnalysisAnswer),
  purposeIsFreeOfCharge,
  purposeFreeOfChargeReason,
  purposeDailyCalls,
})

// Mock data templates
const purposeTemplateData = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    description: 'Business representation of a healthcare purpose template',
    targetDescription: 'Healthcare data processing',
    targetTenantKind: 'PA' as TenantKind,
    creatorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    state: 'DRAFT' as PurposeTemplateState,
    createdAt: '2025-08-29T09:01:20.116Z',
    updatedAt: '2025-08-29T09:01:20.116Z',
    purposeTitle: 'Medical Analysis',
    purposeDescription: 'Analyze patient data for diagnostics',
    riskAnalysis: {
      value: 'high',
      editable: true,
      annotation: {
        id: 'annotation-001',
        text: 'Highly sensitive medical data',
        docId: 'doc-001',
        docName: 'PrivacyPolicy.pdf',
        docPrettyName: 'Privacy Policy',
        docPath: '/docs/privacy-policy.pdf',
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Public service',
    purposeDailyCalls: 500000,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    description: 'Business representation of an educational purpose template',
    targetDescription: 'Student data processing',
    targetTenantKind: 'PA' as TenantKind,
    creatorId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    state: 'PUBLISHED' as PurposeTemplateState,
    createdAt: '2025-08-28T10:02:30.116Z',
    updatedAt: '2025-08-28T10:02:30.116Z',
    purposeTitle: 'Student Performance Analysis',
    purposeDescription: 'Analyze student performance data for grading purposes',
    riskAnalysis: {
      value: 'medium',
      editable: false,
      annotation: {
        id: 'annotation-002',
        text: 'This data involves educational records',
        docId: 'doc-002',
        docName: 'DataProtectionPolicy.pdf',
        docPrettyName: 'Data Protection Policy',
        docPath: '/docs/data-protection-policy.pdf',
      },
    },
    purposeIsFreeOfCharge: false,
    purposeFreeOfChargeReason: 'Subscription-based',
    purposeDailyCalls: 100000,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    description: 'Business representation of a financial services purpose template',
    targetDescription: 'Financial data processing',
    targetTenantKind: 'PA' as TenantKind,
    creatorId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    state: 'PUBLISHED' as PurposeTemplateState,
    createdAt: '2025-08-27T08:03:40.116Z',
    updatedAt: '2025-08-27T08:03:40.116Z',
    purposeTitle: 'Credit Scoring Analysis',
    purposeDescription: 'Analyze financial data for credit scoring purposes',
    riskAnalysis: {
      value: 'high',
      editable: true,
      annotation: {
        id: 'annotation-003',
        text: 'Sensitive financial data for credit evaluation',
        docId: 'doc-003',
        docName: 'FinancialDataPolicy.pdf',
        docPrettyName: 'Financial Data Policy',
        docPath: '/docs/financial-data-policy.pdf',
      },
    },
    purposeIsFreeOfCharge: false,
    purposeFreeOfChargeReason: 'Paid service',
    purposeDailyCalls: 200000,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    description: 'Business representation of a government services purpose template',
    targetDescription: 'Government data processing',
    targetTenantKind: 'PA' as TenantKind,
    creatorId: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    state: 'SUSPENDED' as PurposeTemplateState,
    createdAt: '2025-08-26T07:04:50.116Z',
    updatedAt: '2025-08-26T07:04:50.116Z',
    purposeTitle: 'Public Record Processing',
    purposeDescription: 'Process public records for government purposes',
    riskAnalysis: {
      value: 'low',
      editable: false,
      annotation: {
        id: 'annotation-004',
        text: 'Non-sensitive government records',
        docId: 'doc-004',
        docName: 'GovernmentPolicy.pdf',
        docPrettyName: 'Government Policy',
        docPath: '/docs/government-policy.pdf',
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Public service',
    purposeDailyCalls: 750000,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    description: 'Business representation of a research purposes template',
    targetDescription: 'Research data processing',
    targetTenantKind: 'GSP' as TenantKind,
    creatorId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    state: 'PUBLISHED' as PurposeTemplateState,
    createdAt: '2025-08-25T06:05:00.116Z',
    updatedAt: '2025-08-25T06:05:00.116Z',
    purposeTitle: 'Research Data Analysis',
    purposeDescription: 'Analyze research data for scientific studies',
    riskAnalysis: {
      value: 'medium',
      editable: true,
      annotation: {
        id: 'annotation-005',
        text: 'Research data for scientific purposes',
        docId: 'doc-005',
        docName: 'ResearchPolicy.pdf',
        docPrettyName: 'Research Policy',
        docPath: '/docs/research-policy.pdf',
      },
    },
    purposeIsFreeOfCharge: true,
    purposeFreeOfChargeReason: 'Government grant',
    purposeDailyCalls: 300000,
  },
]

export const purposeTemplatesListMock: Array<PurposeTemplate> = purposeTemplateData.map((data) => {
  const annotation = createAnnotation(
    data.riskAnalysis.annotation.id,
    data.riskAnalysis.annotation.text,
    data.riskAnalysis.annotation.docId,
    data.riskAnalysis.annotation.docName,
    data.riskAnalysis.annotation.docPrettyName,
    data.riskAnalysis.annotation.docPath,
    data.createdAt
  )

  const riskAnalysisAnswer = createRiskAnalysisAnswer(
    data.riskAnalysis.value,
    data.riskAnalysis.editable,
    annotation
  )

  return createPurposeTemplate(
    data.id,
    data.description,
    data.targetDescription,
    data.targetTenantKind,
    data.creatorId,
    data.state,
    data.createdAt,
    data.updatedAt,
    data.purposeTitle,
    data.purposeDescription,
    riskAnalysisAnswer,
    data.purposeIsFreeOfCharge,
    data.purposeFreeOfChargeReason,
    data.purposeDailyCalls
  )
})

// Reuse the last template from the list for purposeTemplateMock
export const purposeTemplateMock: PurposeTemplate = purposeTemplatesListMock[4]

// Helper function for EService linking data
const createEServiceLink = (
  purposeTemplateId: string,
  eserviceId: string,
  descriptorId: string,
  eserviceName: string,
  producerName: string,
  createdAt: string
): PurposeTemplateEService => ({
  purposeTemplateId,
  eserviceId,
  descriptorId,
  eserviceName,
  producerName,
  createdAt,
})

const eserviceLinkData = [
  {
    purposeTemplateId: '11111111-1111-1111-1111-111111111111',
    eserviceId: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    eserviceName: 'Eservice nome 7',
    producerName: 'Ente X',
    createdAt: '2025-08-29T10:50:57.365Z',
  },
  {
    purposeTemplateId: '22222222-2222-2222-2222-222222222222',
    eserviceId: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    eserviceName: 'Eservice nome 0',
    producerName: 'Ente X',
    createdAt: '2025-08-28T14:22:45.100Z',
  },
  {
    purposeTemplateId: '33333333-3333-3333-3333-333333333333',
    eserviceId: 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    eserviceName: 'Eservice nome 3',
    producerName: 'Ente X',
    createdAt: '2025-08-27T08:30:00.000Z',
  },
  {
    purposeTemplateId: '44444444-4444-4444-4444-444444444444',
    eserviceId: 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    eserviceName: 'Eservice nome 2',
    producerName: 'Ente D',
    createdAt: '2025-08-26T12:15:10.789Z',
  },
  {
    purposeTemplateId: '55555555-5555-5555-5555-555555555555',
    eserviceId: 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    descriptorId: 'bbbbbbb5-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    eserviceName: 'Eservice nome 1',
    producerName: 'Ente A',
    createdAt: '2025-08-25T09:00:05.432Z',
  },
]

export const eservicesLinkedToPurposeTemplatesMock = eserviceLinkData.map((data) =>
  createEServiceLink(
    data.purposeTemplateId,
    data.eserviceId,
    data.descriptorId,
    data.eserviceName,
    data.producerName,
    data.createdAt
  )
)

const purposeTemplateEServiceData = [
  {
    purposeTemplateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    eserviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    eserviceName: 'Eservice nome 1',
    producerName: 'Ente A',
    descriptorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    createdAt: '2025-07-19T11:03:53.155Z',
  },
  {
    purposeTemplateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    eserviceId: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    eserviceName: 'Eservice nome 2',
    producerName: 'Ente D',
    descriptorId: 'bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    createdAt: '2025-08-29T11:03:53.155Z',
  },
  {
    purposeTemplateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    eserviceId: 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    eserviceName: 'Eservice nome 3',
    producerName: 'Ente X',
    descriptorId: 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    createdAt: '2025-06-01T11:03:53.155Z',
  },
]

export const purposeTemplateEservicesMock = purposeTemplateEServiceData.map((data) =>
  createEServiceLink(
    data.purposeTemplateId,
    data.eserviceId,
    data.descriptorId,
    data.eserviceName,
    data.producerName,
    data.createdAt
  )
)

export type PurposeTemplateState = 'DRAFT' | 'PUBLISHED' | 'SUSPENDED' | 'ARCHIVED'

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

export interface GetConsumerPurposeTemplatesParams {
  /** Query to filter EServices by name */
  q?: string
  /**
   * comma separated sequence of consumers IDs
   * @default []
   */
  creatorIds?: string[]
  targetTenantKind?: TenantKind
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

export interface PurposeTemplateEService {
  purposeTemplateId: string
  eserviceId: string
  eserviceName: string
  producerName: string
  descriptorId: string
  createdAt: string
}

// Helper functions for catalog services
const createProducer = (id: string, name: string, kind: TenantKind) => ({
  id,
  name,
  kind,
})

const createActiveDescriptor = (
  id: string,
  state: EServiceDescriptorState,
  version: string,
  audience: string[]
) => ({
  id,
  state,
  version,
  audience,
})

const createCatalogService = (
  id: string,
  name: string,
  description: string,
  producer: ReturnType<typeof createProducer>,
  isMine: boolean,
  activeDescriptor: ReturnType<typeof createActiveDescriptor>
): CatalogEService => ({
  id,
  name,
  description,
  producer,
  isMine,
  activeDescriptor,
})

const catalogServiceData = [
  {
    id: 'b4fbb90c-7b7b-44c2-883b-16d44c5e5e02',
    name: 'Service One',
    description: 'A comprehensive e-service that manages user data and processes.',
    producer: {
      id: 'e58e54c3-9012-4b9a-8b73-aba9a8c0d643',
      name: 'TechCorp',
      kind: 'PA' as TenantKind,
    },
    isMine: true,
    activeDescriptor: {
      id: '9c4d63d2-cdc9-4737-b7b8-5f255e59a929',
      state: 'SUSPENDED' as EServiceDescriptorState,
      version: '1.2.0',
      audience: ['admin', 'user'],
    },
  },
  {
    id: 'd1f59c3f-c2ea-4775-bd0b-c63bc05a04d9',
    name: 'Service Two',
    description: 'An AI-driven service for real-time analytics and predictions.',
    producer: {
      id: '4d03a1e1-b0c6-4e92-84ac-7556e1f9e58f',
      name: 'DataMind Solutions',
      kind: 'PRIVATE' as TenantKind,
    },
    isMine: false,
    activeDescriptor: {
      id: 'c92f9da4-17fa-46be-818e-f2c021ffed79',
      state: 'ARCHIVED' as EServiceDescriptorState,
      version: '2.3.1',
      audience: ['data-scientist', 'analyst'],
    },
  },
  {
    id: 'c2d389c1-47a6-4b38-8b92-713a2f0c8ea3',
    name: 'Service Three',
    description: 'A payment processing service for businesses and merchants.',
    producer: {
      id: 'ada7fcd1-b7b3-4e2f-b6c7-0566c82b79ac',
      name: 'PayGlobal',
      kind: 'GSP' as TenantKind,
    },
    isMine: true,
    activeDescriptor: {
      id: 'f3c2b119-e695-4b47-81c4-42e42f7e3779',
      state: 'PUBLISHED' as EServiceDescriptorState,
      version: '3.0.0',
      audience: ['merchant', 'admin'],
    },
  },
]

export const catalogServicesMock: CatalogEService[] = catalogServiceData.map((data) =>
  createCatalogService(
    data.id,
    data.name,
    data.description,
    createProducer(data.producer.id, data.producer.name, data.producer.kind),
    data.isMine,
    createActiveDescriptor(
      data.activeDescriptor.id,
      data.activeDescriptor.state,
      data.activeDescriptor.version,
      data.activeDescriptor.audience
    )
  )
)

// Helper function for catalog purpose templates
const createCatalogPurposeTemplate = (
  id: string,
  targetTenantKind: TenantKind,
  purposeTitle: string,
  purposeDescription: string,
  creator: ReturnType<typeof createProducer>
) => ({
  id,
  targetTenantKind,
  purposeTitle,
  purposeDescription,
  creator,
})

const catalogPurposeTemplateData = [
  {
    id: 'c1f6e2a8-48ef-4f4d-b028-7b781c5c7e4a',
    targetTenantKind: 'PA' as TenantKind,
    purposeTitle: 'Data Analytics for Public Services',
    purposeDescription: 'Use public data to improve urban infrastructure planning.',
    creator: {
      id: '88e8b9c5-81c2-4e49-ae88-b1d1d6b848c3',
      name: 'SmartCity Org',
      kind: 'PA' as TenantKind,
    },
  },
  {
    id: 'b7b4fc79-4ef9-41e2-b87b-73f539fb9a4e',
    targetTenantKind: 'PRIVATE' as TenantKind,
    purposeTitle: 'Market Research with Anonymized Data',
    purposeDescription: 'Leverage anonymized consumer behavior data for product development.',
    creator: {
      id: 'a6f34c1e-f3bc-4ff1-bc3e-6a9435d06d28',
      name: 'DataCorp Ltd.',
      kind: 'PRIVATE' as TenantKind,
    },
  },
  {
    id: 'e36b71b1-f497-4df7-9d84-14420335c528',
    targetTenantKind: 'GSP' as TenantKind,
    purposeTitle: 'Healthcare Optimization Research',
    purposeDescription: 'Analyze patient flow data to optimize healthcare services.',
    creator: {
      id: '59bcb92e-6f99-449a-9110-110af3b4bcee',
      name: 'HealthTech GSP',
      kind: 'GSP' as TenantKind,
    },
  },
]

export const mockCatalogPurposeTemplates: CatalogPurposeTemplates = {
  results: catalogPurposeTemplateData.map((data) =>
    createCatalogPurposeTemplate(
      data.id,
      data.targetTenantKind,
      data.purposeTitle,
      data.purposeDescription,
      createProducer(data.creator.id, data.creator.name, data.creator.kind)
    )
  ),
  pagination: {
    totalCount: 3,
    limit: 10,
    offset: 0,
  },
}
