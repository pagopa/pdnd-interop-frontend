import type { EServiceAttribute, EServiceAttributeValue } from '@/api/api.generatedTypes'
import type { PartyAttribute } from '../../src/types/attribute.types'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockPartyAttribute = createMockFactory<PartyAttribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  state: 'ACTIVE',
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
  createMockSingleBackendAttribute,
  createMockGroupBackendAttribute,
}
