import type {
  Attribute,
  CertifiedTenantAttribute,
  CompactAttribute,
  DeclaredTenantAttribute,
  DescriptorAttribute,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockAttribute = createMockFactory<Attribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  kind: 'CERTIFIED',
  creationTime: '2021-09-01T12:00:00.000Z',
})

const createCertifiedTenantAttribute = createMockFactory<CertifiedTenantAttribute>({
  id: 'id-certified-tenant-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  assignmentTimestamp: '2021-09-01T12:00:00.000Z',
  revocationTimestamp: '2021-09-01T12:00:00.000Z',
})

const createVerifiedTenantAttribute = createMockFactory<VerifiedTenantAttribute>({
  id: 'id-verified-tenant-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  assignmentTimestamp: '2021-09-01T12:00:00.000Z',
  verifiedBy: [],
  revokedBy: [],
})

const createDeclaredTenantAttribute = createMockFactory<DeclaredTenantAttribute>({
  id: 'id-declared-tenant-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  assignmentTimestamp: '2021-09-01T12:00:00.000Z',
  revocationTimestamp: '2021-09-01T12:00:00.000Z',
})

const createMockCompactAttribute = createMockFactory<CompactAttribute>({
  id: 'id-compact-attribute',
  name: 'Attribute Name',
})

const createMockDescriptorAttribute = createMockFactory<DescriptorAttribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  explicitAttributeVerification: true,
})

export {
  createMockAttribute,
  createCertifiedTenantAttribute,
  createVerifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createMockCompactAttribute,
  createMockDescriptorAttribute,
}
