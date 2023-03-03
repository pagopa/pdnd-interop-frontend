import type { BackendAttributes } from '@/types/attribute.types'
import {
  createMockPartyAttribute,
  createMockSingleBackendAttribute,
  createMockGroupBackendAttribute,
} from '__mocks__/data/attribute.mocks'
import { checkEServiceAttributesOwnership, remapEServiceAttributes } from '../attribute.utils'

describe('testing checkEServiceAttributesOwnership', () => {
  it('should return true if the party owns all the backend attributes (SingleBackendAttribute)', () => {
    const partyAttributesMock = [createMockPartyAttribute({ id: 'attribute-id' })]
    const eserviceAttributesMock = [
      createMockSingleBackendAttribute({ single: { id: 'attribute-id' } }),
    ]

    const result = checkEServiceAttributesOwnership(partyAttributesMock, eserviceAttributesMock)

    expect(result).toBe(true)
  })

  it('should return true if the party owns all the backend attributes (GroupBackendAttribute)', () => {
    const partyAttributesMock = [createMockPartyAttribute({ id: 'attribute-id' })]
    const eserviceAttributesMock = [
      createMockGroupBackendAttribute({
        group: [{ id: 'attribute-id' }, { id: 'attribute-id-2' }],
      }),
    ]

    const result = checkEServiceAttributesOwnership(partyAttributesMock, eserviceAttributesMock)

    expect(result).toBe(true)
  })

  it('should return false if the party does not own all the backend attributes (SingleBackendAttribute)', () => {
    const partyAttributesMock = [createMockPartyAttribute({ id: 'attribute-id-fail' })]
    const eserviceAttributesMock = [
      createMockSingleBackendAttribute({ single: { id: 'attribute-id' } }),
    ]

    const result = checkEServiceAttributesOwnership(partyAttributesMock, eserviceAttributesMock)

    expect(result).toBe(false)
  })

  it('should return false if the party does not own all the backend attributes (GroupBackendAttribute)', () => {
    const partyAttributesMock = [createMockPartyAttribute({ id: 'attribute-id-fail' })]
    const eserviceAttributesMock = [
      createMockGroupBackendAttribute({
        group: [{ id: 'attribute-id' }, { id: 'attribute-id-2' }],
      }),
    ]

    const result = checkEServiceAttributesOwnership(partyAttributesMock, eserviceAttributesMock)

    expect(result).toBe(false)
  })

  it('should return false if the party does not own all the backend attributes (SingleBackendAttribute and GroupBackendAttribute)', () => {
    const partyAttributesMock = [
      createMockPartyAttribute({ id: 'attribute-id-single' }),
      createMockPartyAttribute({ id: 'attribute-id-group' }),
    ]
    const eserviceAttributesMock = [
      createMockSingleBackendAttribute({ single: { id: 'attribute-id-single' } }),
      createMockGroupBackendAttribute({ group: [{ id: 'attribute-id-group' }] }),
    ]

    const result = checkEServiceAttributesOwnership(partyAttributesMock, eserviceAttributesMock)

    expect(result).toBe(true)
  })

  it('should return false if the party does not own all the backend attributes (SingleBackendAttribute and GroupBackendAttribute)', () => {
    const partyAttributesMock = [
      createMockPartyAttribute({ id: 'attribute-id-single' }),
      createMockPartyAttribute({ id: 'attribute-id-group-fail' }),
    ]
    const eserviceAttributesMock = [
      createMockSingleBackendAttribute({ single: { id: 'attribute-id-single' } }),
      createMockGroupBackendAttribute({ group: [{ id: 'attribute-id-group' }] }),
    ]

    const result = checkEServiceAttributesOwnership(partyAttributesMock, eserviceAttributesMock)

    expect(result).toBe(false)
  })
})

describe('testing remapEServiceAttributes', () => {
  it('should match the inline snapshot', () => {
    const backendAttributesMock: BackendAttributes = {
      verified: [
        createMockSingleBackendAttribute({ single: { id: 'attribute-id-single-verified' } }),
        createMockGroupBackendAttribute({ group: [{ id: 'attribute-id-group-verified' }] }),
      ],
      certified: [
        createMockSingleBackendAttribute({ single: { id: 'attribute-id-single-certified' } }),
        createMockGroupBackendAttribute({ group: [{ id: 'attribute-id-group-certified' }] }),
      ],
      declared: [
        createMockSingleBackendAttribute({ single: { id: 'attribute-id-single-declared' } }),
        createMockGroupBackendAttribute({ group: [{ id: 'attribute-id-group-declared' }] }),
      ],
    }

    expect(remapEServiceAttributes(backendAttributesMock)).toMatchInlineSnapshot(`
      {
        "certified": [
          {
            "attributes": [
              {
                "description": "Attribute description",
                "id": "attribute-id-single-certified",
                "kind": "CERTIFIED",
                "name": "Attribute Name",
              },
            ],
            "explicitAttributeVerification": true,
          },
          {
            "attributes": [
              {
                "description": undefined,
                "id": "attribute-id-group-certified",
                "kind": "CERTIFIED",
                "name": undefined,
              },
            ],
            "explicitAttributeVerification": undefined,
          },
        ],
        "declared": [
          {
            "attributes": [
              {
                "description": "Attribute description",
                "id": "attribute-id-single-declared",
                "kind": "DECLARED",
                "name": "Attribute Name",
              },
            ],
            "explicitAttributeVerification": true,
          },
          {
            "attributes": [
              {
                "description": undefined,
                "id": "attribute-id-group-declared",
                "kind": "DECLARED",
                "name": undefined,
              },
            ],
            "explicitAttributeVerification": undefined,
          },
        ],
        "verified": [
          {
            "attributes": [
              {
                "description": "Attribute description",
                "id": "attribute-id-single-verified",
                "kind": "VERIFIED",
                "name": "Attribute Name",
              },
            ],
            "explicitAttributeVerification": true,
          },
          {
            "attributes": [
              {
                "description": undefined,
                "id": "attribute-id-group-verified",
                "kind": "VERIFIED",
                "name": undefined,
              },
            ],
            "explicitAttributeVerification": undefined,
          },
        ],
      }
    `)
  })
})
