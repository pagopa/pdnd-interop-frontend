import { hasAllDescriptorAttributes, isAttributeGroupFullfilled } from '@/utils/attribute.utils'
import type { DescriptorAttributes } from '@/api/api.generatedTypes'
import { isAttributeOwned, isAttributeRevoked } from '../attribute.utils'
import {
  createCertifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createVerifiedTenantAttribute,
  createMockDescriptorAttribute,
} from '@/../__mocks__/data/attribute.mocks'
import subDays from 'date-fns/subDays'
import { addDays } from 'date-fns'

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

    it('should be considered revoked if the given verifier revoked the attribute (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        revokedBy: [{ id: 'verifier-id' }],
      })
      const result = isAttributeRevoked('verified', attributeMock, 'verifier-id')
      expect(result).toBe(true)
    })

    it('should be considered revoked if the attribute has at least been revoked once if no verifier is passed (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        revokedBy: [
          {
            id: 'verifier-id',
          },
        ],
      })
      const result = isAttributeRevoked('verified', attributeMock)
      expect(result).toBe(true)
    })

    it('should not be considered revoked if the attribute has not been revoked once and if no verifier is passed (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        revokedBy: [],
      })
      const result = isAttributeRevoked('verified', attributeMock)
      expect(result).toBe(false)
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

    it('should not be considered owned if the attribute is in the owned attribute array, it is not revoked (verified) but attribute is expired', () => {
      const now = Date.now()
      const start = subDays(now, 1)

      const attributeMock = createVerifiedTenantAttribute({
        id: 'attribute-id-test',
        verifiedBy: [{ id: 'attribute-id', extensionDate: start.toISOString() }],
      })
      const result = isAttributeOwned(
        'verified',
        'attribute-id-test',
        [attributeMock],
        'attribute-id'
      )
      expect(result).toBe(false)
    })

    it('should be considered owned if the attribute is in the owned attribute array and it is not revoked (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        id: 'attribute-id-test',
        verifiedBy: [{ id: 'attribute-id' }],
      })
      const result = isAttributeOwned(
        'verified',
        'attribute-id-test',
        [attributeMock],
        'attribute-id'
      )
      expect(result).toBe(true)
    })

    it('should not be considered owned if the attribute is not in the owned attribute array (verified)', () => {
      const result = isAttributeOwned('verified', 'attribute-id', [], 'producer-id')
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array but it is revoked (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({ verifiedBy: [] })
      const result = isAttributeOwned('verified', 'attribute-id', [attributeMock], 'producer-id')
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
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-1' })]
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
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-2' })]
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(false)
    })

    it('should be considered fullfilled if at least one attribute is owned (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test' }] }),
        createVerifiedTenantAttribute({ id: 'attribute-id-2', verifiedBy: [] }),
      ]
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-1' })]
      const result = isAttributeGroupFullfilled('verified', ownedAttributes, group, 'test')
      expect(result).toBe(true)
    })

    it('should not be considered fullfilled if no attributes are owned (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test-1' }] }),
      ]
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-2' })]
      const result = isAttributeGroupFullfilled('verified', ownedAttributes, group, 'test')
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
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-1' })]
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
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-2' })]
      const result = isAttributeGroupFullfilled('declared', ownedAttributes, group)
      expect(result).toBe(false)
    })
  })

  describe('hasAllDescriptorAttributes', () => {
    it('should return true if the user has fullfilled all the attribute groups requirements (certified)', () => {
      const ownedAttributes = [
        createCertifiedTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createCertifiedTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
        }),
      ]

      const descriptorAttributes: DescriptorAttributes = {
        certified: [
          [createMockDescriptorAttribute({ id: 'attribute-id-1' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3' }),
          ],
        ],
        verified: [],
        declared: [],
      }
      const result = hasAllDescriptorAttributes(
        'certified',
        ownedAttributes,
        descriptorAttributes.certified
      )
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

      const descriptorAttributes: DescriptorAttributes = {
        certified: [
          [createMockDescriptorAttribute({ id: 'attribute-id-1' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3' }),
          ],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-4' }),
            createMockDescriptorAttribute({ id: 'attribute-id-5' }),
          ],
        ],
        verified: [],
        declared: [],
      }
      const result = hasAllDescriptorAttributes(
        'certified',
        ownedAttributes,
        descriptorAttributes.certified
      )
      expect(result).toBe(false)
    })

    it('should return true if the user has fullfilled all the attribute groups requirements (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test-id' }] }),
        createVerifiedTenantAttribute({
          id: 'attribute-id-2',
          verifiedBy: [{ id: 'test-id' }],
        }),
      ]

      const descriptorAttributes: DescriptorAttributes = {
        certified: [],
        verified: [
          [createMockDescriptorAttribute({ id: 'attribute-id-1' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3' }),
          ],
        ],
        declared: [],
      }
      const result = hasAllDescriptorAttributes(
        'verified',
        ownedAttributes,
        descriptorAttributes.verified,
        'test-id'
      )
      expect(result).toBe(true)
    })

    it('should return false if the user has not fullfilled all the attribute groups requirements (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [] }),
      ]

      const descriptorAttributes: DescriptorAttributes = {
        certified: [],
        verified: [
          [createMockDescriptorAttribute({ id: 'attribute-id-1' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3' }),
          ],
        ],
        declared: [],
      }

      const result = hasAllDescriptorAttributes(
        'verified',
        ownedAttributes,
        descriptorAttributes.verified,
        'test-id-2'
      )
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

      const descriptorAttributes: DescriptorAttributes = {
        certified: [],
        verified: [],
        declared: [
          [createMockDescriptorAttribute({ id: 'attribute-id-1' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3' }),
          ],
        ],
      }
      const result = hasAllDescriptorAttributes(
        'declared',
        ownedAttributes,
        descriptorAttributes.declared
      )
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

      const descriptorAttributes: DescriptorAttributes = {
        certified: [],
        verified: [],
        declared: [
          [createMockDescriptorAttribute({ id: 'attribute-id-1' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3' }),
          ],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-4' }),
            createMockDescriptorAttribute({ id: 'attribute-id-5' }),
          ],
        ],
      }
      const result = hasAllDescriptorAttributes(
        'declared',
        ownedAttributes,
        descriptorAttributes.declared
      )
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

      const descriptorAttributes: DescriptorAttributes = {
        certified: [
          [createMockDescriptorAttribute({ id: 'attribute-id-1' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3' }),
          ],
        ],
        verified: [],
        declared: [],
      }
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        hasAllDescriptorAttributes('unknown-kind', ownedAttributes, descriptorAttributes.certified)
      ).toThrowError('Unknown attribute kind: unknown-kind')
    })
  })
})
