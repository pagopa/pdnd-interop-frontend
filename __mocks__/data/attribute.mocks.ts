import type {
  Attribute,
  CertifiedTenantAttribute,
  CompactAttribute,
  DeclaredTenantAttribute,
  EServiceAttribute,
  EServiceAttributeValue,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'
import type { RemappedEServiceAttribute } from '../../src/types/attribute.types'
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

const createMockRemappedEServiceAttribute = createMockFactory<RemappedEServiceAttribute>({
  attributes: [{ ...createMockCompactAttribute() }],
  explicitAttributeVerification: true,
})

const createMockBackendAttributeContent = createMockFactory<EServiceAttributeValue>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  explicitAttributeVerification: true,
})

const createMockSingleBackendAttribute = createMockFactory<EServiceAttribute>({
  single: createMockBackendAttributeContent(),
})

const createMockGroupBackendAttribute = createMockFactory<EServiceAttribute>({
  group: [
    createMockBackendAttributeContent(),
    createMockBackendAttributeContent({ id: 'id-party-attribute-2' }),
  ],
})

export {
  createMockAttribute,
  createCertifiedTenantAttribute,
  createVerifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createMockCompactAttribute,
  createMockRemappedEServiceAttribute,
  createMockSingleBackendAttribute,
  createMockGroupBackendAttribute,
}
