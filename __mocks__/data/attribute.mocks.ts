import type {
  Attribute,
  CertifiedDiscreteTenantAttribute,
  CompactAttribute,
  DeclaredTenantAttribute,
  DescriptorAttribute,
  StandardCertifiedTenantAttribute,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'
import type { FormDescriptorAttribute } from '@/types/attribute.types'

const createMockAttribute = createMockFactory<Attribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  kind: 'CERTIFIED',
  creationTime: '2021-09-01T12:00:00.000Z',
})

const createStandardCertifiedTenantAttribute = createMockFactory<StandardCertifiedTenantAttribute>({
  id: 'id-certified-tenant-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  assignmentTimestamp: '2021-09-01T12:00:00.000Z',
  revocationTimestamp: '2021-09-01T12:00:00.000Z',
  kind: 'CERTIFIED',
})

const createVerifiedTenantAttribute = createMockFactory<VerifiedTenantAttribute>({
  id: 'id-verified-tenant-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  assignmentTimestamp: '2021-09-01T12:00:00.000Z',
  verifiedBy: [],
  revokedBy: [],
  kind: 'VERIFIED',
})

const createDeclaredTenantAttribute = createMockFactory<DeclaredTenantAttribute>({
  id: 'id-declared-tenant-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  assignmentTimestamp: '2021-09-01T12:00:00.000Z',
  revocationTimestamp: '2021-09-01T12:00:00.000Z',
  kind: 'DECLARED',
})

const createCertifiedDiscreteTenantAttribute = createMockFactory<CertifiedDiscreteTenantAttribute>({
  id: 'id-certified-discrete-tenant-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  assignmentTimestamp: '2021-09-01T12:00:00.000Z',
  revocationTimestamp: '2021-09-01T12:00:00.000Z',
  kind: 'CERTIFIED_DISCRETE',
  discreteValue: 100,
})

const createMockCompactAttribute = createMockFactory<CompactAttribute>({
  id: 'id-compact-attribute',
  name: 'Attribute Name',
  kind: 'CERTIFIED',
})

const createMockDescriptorAttribute = createMockFactory<DescriptorAttribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  explicitAttributeVerification: true,
  kind: 'CERTIFIED',
})

const createMockFormDescriptorAttribute = createMockFactory<FormDescriptorAttribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  kind: 'CERTIFIED',
  dailyCallsPerConsumer: undefined,
  discreteConfig: undefined,
})

export {
  createMockAttribute,
  createStandardCertifiedTenantAttribute,
  createVerifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createCertifiedDiscreteTenantAttribute,
  createMockCompactAttribute,
  createMockDescriptorAttribute,
  createMockFormDescriptorAttribute,
}
