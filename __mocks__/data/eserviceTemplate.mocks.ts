import type { EServiceTemplateVersionDetails } from '@/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockEServiceTemplateVersionDetails =
  createMockFactory<EServiceTemplateVersionDetails>({
    id: 'version-id-001',
    version: 1,
    description: 'Version description',
    voucherLifespan: 60,
    dailyCallsPerConsumer: 1000,
    dailyCallsTotal: 5000,
    interface: {
      id: 'interface-doc-001',
      name: 'openapi.yml',
      prettyName: 'Specifica API',
      contentType: 'application/octet-stream',
      checksum: 'abc123',
    },
    docs: [
      {
        id: 'doc-001',
        name: 'guide.pdf',
        prettyName: 'User Guide',
        contentType: 'application/pdf',
        checksum: 'def456',
      },
    ],
    state: 'DRAFT',
    agreementApprovalPolicy: 'AUTOMATIC',
    attributes: {
      certified: [],
      declared: [],
      verified: [],
    },
    eserviceTemplate: {
      id: 'template-id-001',
      creator: {
        id: 'org-001',
        name: 'Test Organization',
      },
      name: 'Test Template Name',
      intendedTarget: 'Test intended target',
      description: 'Template description',
      technology: 'REST',
      versions: [],
      riskAnalysis: [],
      mode: 'DELIVER',
      isSignalHubEnabled: true,
      personalData: true,
    },
    isAlreadyInstantiated: false,
  })

const createMockEServiceTemplateVersionDetailsReceiveMode =
  createMockFactory<EServiceTemplateVersionDetails>({
    ...createMockEServiceTemplateVersionDetails(),
    eserviceTemplate: {
      ...createMockEServiceTemplateVersionDetails().eserviceTemplate,
      mode: 'RECEIVE',
    },
  })

const createMockEServiceTemplateVersionDetailsNoInterface =
  createMockFactory<EServiceTemplateVersionDetails>({
    ...createMockEServiceTemplateVersionDetails(),
    interface: undefined,
  })

const createMockEServiceTemplateVersionDetailsNoPersonalData =
  createMockFactory<EServiceTemplateVersionDetails>({
    ...createMockEServiceTemplateVersionDetails(),
    eserviceTemplate: {
      ...createMockEServiceTemplateVersionDetails().eserviceTemplate,
      personalData: undefined,
    },
  })

const createMockEServiceTemplateVersionDetailsManualApproval =
  createMockFactory<EServiceTemplateVersionDetails>({
    ...createMockEServiceTemplateVersionDetails(),
    agreementApprovalPolicy: 'MANUAL',
  })

const createMockEServiceTemplateVersionDetailsWithAttributes =
  createMockFactory<EServiceTemplateVersionDetails>({
    ...createMockEServiceTemplateVersionDetails(),
    attributes: {
      certified: [
        [
          {
            id: 'attr-cert-001',
            name: 'Certified Attribute 1',
            description: 'A certified attribute',
            explicitAttributeVerification: false,
          },
        ],
      ],
      verified: [
        [
          {
            id: 'attr-ver-001',
            name: 'Verified Attribute 1',
            description: 'A verified attribute',
            explicitAttributeVerification: true,
          },
        ],
      ],
      declared: [],
    },
  })

export {
  createMockEServiceTemplateVersionDetails,
  createMockEServiceTemplateVersionDetailsReceiveMode,
  createMockEServiceTemplateVersionDetailsNoInterface,
  createMockEServiceTemplateVersionDetailsNoPersonalData,
  createMockEServiceTemplateVersionDetailsManualApproval,
  createMockEServiceTemplateVersionDetailsWithAttributes,
}
