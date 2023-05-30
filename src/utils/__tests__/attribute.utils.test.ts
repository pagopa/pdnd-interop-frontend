import {
  hasAllEServiceAttributes,
  isAttributeGroupFullfilled,
  remapEServiceAttributes,
} from '@/utils/attribute.utils'
import type { EServiceAttributes } from '@/api/api.generatedTypes'
import { isAttributeOwned, isAttributeRevoked } from '../attribute.utils'
import {
  createCertifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createMockRemappedEServiceAttribute,
  createMockGroupBackendAttribute,
  createMockSingleBackendAttribute,
  createVerifiedTenantAttribute,
} from '__mocks__/data/attribute.mocks'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'

describe('attribute utils', () => {
  describe('isAttributeRevoked', () => {
    it('should be considered revoked (certified)', () => {
      const attributeMock = createCertifiedTenantAttribute({
        revocationTimestamp: '2021-09-01T12:00:00.000Z',
      })
      const result = isAttributeRevoked('certified', attributeMock)
      expect(result).toBe(true)
    })

    it('should be not considered revoked (certified)', () => {
      const attributeMock = createCertifiedTenantAttribute({
        revocationTimestamp: undefined,
      })
      const result = isAttributeRevoked('certified', attributeMock)
      expect(result).toBe(false)
    })

    it('should not be considered revoked if the attribute has been verified at least once by the given verifier id (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        verifiedBy: [{ id: 'verifier-id' }],
      })
      const result = isAttributeRevoked('verified', attributeMock, 'verifier-id')
      expect(result).toBe(false)
    })

    it('should be considered revoked if the given verifier did not verify the attribute (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        verifiedBy: [{ id: 'verifier-id-another' }],
      })
      const result = isAttributeRevoked('verified', attributeMock, 'verifier-id')
      expect(result).toBe(true)
    })

    it('should not be considered revoked if the attribute has at least been verified once if no verifier is passed (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        verifiedBy: [{ id: 'verifier-id' }],
      })
      const result = isAttributeRevoked('verified', attributeMock)
      expect(result).toBe(false)
    })

    it('should be considered revoked if the attribute has not been verified once and if no verifier is passed (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        verifiedBy: [],
      })
      const result = isAttributeRevoked('verified', attributeMock)
      expect(result).toBe(true)
    })

    it('should be considered revoked (declared)', () => {
      const attributeMock = createDeclaredTenantAttribute({
        revocationTimestamp: '2021-09-01T12:00:00.000Z',
      })
      const result = isAttributeRevoked('declared', attributeMock)
      expect(result).toBe(true)
    })

    it('should be not considered revoked (declared)', () => {
      const attributeMock = createDeclaredTenantAttribute({
        revocationTimestamp: undefined,
      })
      const result = isAttributeRevoked('declared', attributeMock)
      expect(result).toBe(false)
    })

    it('should throw an error if an unknown kind is passed', () => {
      const attributeMock = createCertifiedTenantAttribute({
        revocationTimestamp: '2021-09-01T12:00:00.000Z',
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      expect(() => isAttributeRevoked('unknown-kind', attributeMock)).toThrowError(
        'Unknown attribute kind: unknown-kind'
      )
    })
  })

  describe('isAttributeOwned', () => {
    it('should be considered owned if the attribute is in the owned attribute array and it is not revoked (certified)', () => {
      const attributeMock = createCertifiedTenantAttribute({
        id: 'attribute-id',
        revocationTimestamp: undefined,
      })
      const result = isAttributeOwned('certified', 'attribute-id', [attributeMock])
      expect(result).toBe(true)
    })

    it('should not be considered owned if the attribute is not in the owned attribute array (certified)', () => {
      const result = isAttributeOwned('certified', 'attribute-id', [])
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array but it is revoked (certified)', () => {
      const attributeMock = createCertifiedTenantAttribute({ revocationTimestamp: 'timestamp' })
      const result = isAttributeOwned('certified', 'attribute-id', [attributeMock])
      expect(result).toBe(false)
    })

    it('should be considered owned if the attribute is in the owned attribute array and it is not revoked (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        id: 'attribute-id-test',
        verifiedBy: [{ id: 'attribute-id' }],
      })
      const result = isAttributeOwned('verified', 'attribute-id-test', [attributeMock])
      expect(result).toBe(true)
    })

    it('should not be considered owned if the attribute is not in the owned attribute array (verified)', () => {
      const result = isAttributeOwned('verified', 'attribute-id', [])
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array but it is revoked (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({ verifiedBy: [] })
      const result = isAttributeOwned('verified', 'attribute-id', [attributeMock])
      expect(result).toBe(false)
    })

    it('should be considered owned if the attribute is in the owned attribute array and it is not revoked (declared)', () => {
      const attributeMock = createDeclaredTenantAttribute({
        id: 'attribute-id',
        revocationTimestamp: undefined,
      })
      const result = isAttributeOwned('declared', 'attribute-id', [attributeMock])
      expect(result).toBe(true)
    })

    it('should not be considered owned if the attribute is not in the owned attribute array (declared)', () => {
      const result = isAttributeOwned('declared', 'attribute-id', [])
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array but it is revoked (declared)', () => {
      const attributeMock = createDeclaredTenantAttribute({ revocationTimestamp: 'timestamp' })
      const result = isAttributeOwned('declared', 'attribute-id', [attributeMock])
      expect(result).toBe(false)
    })

    it('should throw an error if an unknown kind is passed', () => {
      const attributeMock = createCertifiedTenantAttribute({
        id: 'attribute-id',
        revocationTimestamp: '2021-09-01T12:00:00.000Z',
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      expect(() => isAttributeOwned('unknown-kind', 'attribute-id', [attributeMock])).toThrowError(
        'Unknown attribute kind: unknown-kind'
      )
    })
  })

  describe('isAttributeGroupFullfilled', () => {
    it('should be considered fullfilled if at least one attribute is owned (certified)', () => {
      const ownedAttributes = [
        createCertifiedTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createCertifiedTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: '2021-09-01T12:00:00.000Z',
        }),
      ]
      const group = createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] })
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(true)
    })

    it('should be considered fullfilled if no attributes are owned (certified)', () => {
      const ownedAttributes = [
        createCertifiedTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createCertifiedTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: '2021-09-01T12:00:00.000Z',
        }),
      ]
      const group = createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-2' }] })
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(false)
    })

    it('should be considered fullfilled if at least one attribute is owned (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test' }] }),
        createVerifiedTenantAttribute({ id: 'attribute-id-2', verifiedBy: [] }),
      ]
      const group = createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] })
      const result = isAttributeGroupFullfilled('verified', ownedAttributes, group)
      expect(result).toBe(true)
    })

    it('should be considered fullfilled if no attributes are owned (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test' }] }),
        createVerifiedTenantAttribute({ id: 'attribute-id-2', verifiedBy: [] }),
      ]
      const group = createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-2' }] })
      const result = isAttributeGroupFullfilled('verified', ownedAttributes, group)
      expect(result).toBe(false)
    })

    it('should be considered fullfilled if at least one attribute is owned (declared)', () => {
      const ownedAttributes = [
        createDeclaredTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createDeclaredTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: '2021-09-01T12:00:00.000Z',
        }),
      ]
      const group = createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] })
      const result = isAttributeGroupFullfilled('declared', ownedAttributes, group)
      expect(result).toBe(true)
    })

    it('should be considered fullfilled if no attributes are owned (declared)', () => {
      const ownedAttributes = [
        createDeclaredTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createDeclaredTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: '2021-09-01T12:00:00.000Z',
        }),
      ]
      const group = createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-2' }] })
      const result = isAttributeGroupFullfilled('declared', ownedAttributes, group)
      expect(result).toBe(false)
    })
  })

  describe('hasAllEServiceAttributes', () => {
    it('should return true if the user has fullfilled all the attribute groups requirements (certified)', () => {
      const ownedAttributes = [
        createCertifiedTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createCertifiedTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
        }),
      ]

      const eserviceAttributes: Array<RemappedEServiceAttribute> = [
        createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-2' }, { id: 'attribute-id-3' }],
        }),
      ]
      const result = hasAllEServiceAttributes('certified', ownedAttributes, eserviceAttributes)
      expect(result).toBe(true)
    })

    it('should return false if the user has not fullfilled all the attribute groups requirements (certified)', () => {
      const ownedAttributes = [
        createCertifiedTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createCertifiedTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
        }),
      ]

      const eserviceAttributes: Array<RemappedEServiceAttribute> = [
        createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-2' }, { id: 'attribute-id-3' }],
        }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-4' }, { id: 'attribute-id-5' }],
        }),
      ]
      const result = hasAllEServiceAttributes('certified', ownedAttributes, eserviceAttributes)
      expect(result).toBe(false)
    })

    it('should return true if the user has fullfilled all the attribute groups requirements (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test-id' }] }),
        createVerifiedTenantAttribute({
          id: 'attribute-id-2',
          verifiedBy: [{ id: 'test-id-2' }],
        }),
      ]

      const eserviceAttributes: Array<RemappedEServiceAttribute> = [
        createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-2' }, { id: 'attribute-id-3' }],
        }),
      ]
      const result = hasAllEServiceAttributes('verified', ownedAttributes, eserviceAttributes)
      expect(result).toBe(true)
    })

    it('should return false if the user has not fullfilled all the attribute groups requirements (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test-id' }] }),
        createVerifiedTenantAttribute({
          id: 'attribute-id-2',
          verifiedBy: [],
        }),
      ]

      const eserviceAttributes: Array<RemappedEServiceAttribute> = [
        createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-2' }, { id: 'attribute-id-3' }],
        }),
      ]

      const result = hasAllEServiceAttributes('verified', ownedAttributes, eserviceAttributes)
      expect(result).toBe(false)
    })

    it('should return true if the user has fullfilled all the attribute groups requirements (declared)', () => {
      const ownedAttributes = [
        createDeclaredTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createDeclaredTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
        }),
      ]

      const eserviceAttributes: Array<RemappedEServiceAttribute> = [
        createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-2' }, { id: 'attribute-id-3' }],
        }),
      ]
      const result = hasAllEServiceAttributes('declared', ownedAttributes, eserviceAttributes)
      expect(result).toBe(true)
    })

    it('should return false if the user has not fullfilled all the attribute groups requirements (declared)', () => {
      const ownedAttributes = [
        createDeclaredTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createDeclaredTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
        }),
      ]

      const eserviceAttributes: Array<RemappedEServiceAttribute> = [
        createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-2' }, { id: 'attribute-id-3' }],
        }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-4' }, { id: 'attribute-id-5' }],
        }),
      ]
      const result = hasAllEServiceAttributes('declared', ownedAttributes, eserviceAttributes)
      expect(result).toBe(false)
    })

    it('should throw an error if an unknown kind is passed', () => {
      const ownedAttributes = [
        createCertifiedTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createCertifiedTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
        }),
      ]

      const eserviceAttributes: Array<RemappedEServiceAttribute> = [
        createMockRemappedEServiceAttribute({ attributes: [{ id: 'attribute-id-1' }] }),
        createMockRemappedEServiceAttribute({
          attributes: [{ id: 'attribute-id-2' }, { id: 'attribute-id-3' }],
        }),
      ]
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        hasAllEServiceAttributes('unknown-kind', ownedAttributes, eserviceAttributes)
      ).toThrowError('Unknown attribute kind: unknown-kind')
    })
  })

  describe('remapEServiceAttributes', () => {
    it('should match the inline snapshot', () => {
      const backendAttributesMock: EServiceAttributes = {
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
                  "id": "attribute-id-single-certified",
                  "name": "Attribute Name",
                },
              ],
              "explicitAttributeVerification": true,
            },
            {
              "attributes": [
                {
                  "id": "attribute-id-group-certified",
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
                  "id": "attribute-id-single-declared",
                  "name": "Attribute Name",
                },
              ],
              "explicitAttributeVerification": true,
            },
            {
              "attributes": [
                {
                  "id": "attribute-id-group-declared",
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
                  "id": "attribute-id-single-verified",
                  "name": "Attribute Name",
                },
              ],
              "explicitAttributeVerification": true,
            },
            {
              "attributes": [
                {
                  "id": "attribute-id-group-verified",
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
})
