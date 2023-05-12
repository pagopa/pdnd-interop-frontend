import type {
  Attribute,
  CompactAttribute,
  EServiceAttribute,
  EServiceAttributeValue,
} from '@/api/api.generatedTypes'
import type { FrontendAttribute, PartyAttribute } from '../../src/types/attribute.types'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockPartyAttribute = createMockFactory<PartyAttribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  state: 'ACTIVE',
})

const createMockAttribute = createMockFactory<Attribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  kind: 'CERTIFIED',
  creationTime: '2021-09-01T12:00:00.000Z',
})

const createMockCompactAttribute = createMockFactory<CompactAttribute>({
  id: 'id-compact-attribute',
  name: 'Attribute Name',
})

const createMockFrontendAttribute = createMockFactory<FrontendAttribute>({
  attributes: [createMockCompactAttribute()],
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
  createMockPartyAttribute,
  createMockAttribute,
  createMockCompactAttribute,
  createMockFrontendAttribute,
  createMockSingleBackendAttribute,
  createMockGroupBackendAttribute,
}
