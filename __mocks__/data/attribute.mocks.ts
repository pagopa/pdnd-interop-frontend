import type {
  GroupBackendAttribute,
  SingleBackendAttribute,
  BackendAttributeContent,
  PartyAttribute,
} from '../../src/types/attribute.types'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockPartyAttribute = createMockFactory<PartyAttribute>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  state: 'ACTIVE',
})

const createMockBackendAttributeContent = createMockFactory<BackendAttributeContent>({
  id: 'id-party-attribute',
  name: 'Attribute Name',
  description: 'Attribute description',
  explicitAttributeVerification: true,
  verified: true,
  verificationDate: '2023-02-03T07:59:52.458Z',
})

const createMockSingleBackendAttribute = createMockFactory<SingleBackendAttribute>({
  single: createMockBackendAttributeContent(),
})

const createMockGroupBackendAttribute = createMockFactory<GroupBackendAttribute>({
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
