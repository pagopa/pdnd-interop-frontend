import {
  hasAllDescriptorAttributes,
  isAttributeCompliantWithDiscreteConfig,
  isAttributeGroupFullfilled,
} from '@/utils/attribute.utils'
import type {
  DescriptorAttributes,
  EServiceAttributeCertifiedDiscreteConfig,
} from '@/api/api.generatedTypes'
import { isAttributeOwned, isAttributeRevoked } from '../attribute.utils'
import {
  createStandardCertifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createVerifiedTenantAttribute,
  createMockDescriptorAttribute,
  createCertifiedDiscreteTenantAttribute,
} from '@/../__mocks__/data/attribute.mocks'
import subDays from 'date-fns/subDays'

describe('attribute utils', () => {
  describe('isAttributeRevoked', () => {
    it('should be considered revoked (certified)', () => {
      const attributeMock = createStandardCertifiedTenantAttribute({
        revocationTimestamp: '2021-09-01T12:00:00.000Z',
      })
      const result = isAttributeRevoked('certified', attributeMock)
      expect(result).toBe(true)
    })

    it('should be not considered revoked (certified)', () => {
      const attributeMock = createStandardCertifiedTenantAttribute({
        revocationTimestamp: undefined,
      })
      const result = isAttributeRevoked('certified', attributeMock)
      expect(result).toBe(false)
    })

    it('should be considered revoked (CERTIFIED_DISCRETE)', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        revocationTimestamp: '2021-09-01T12:00:00.000Z',
      })
      const result = isAttributeRevoked('certified', attributeMock)
      expect(result).toBe(true)
    })

    it('should be not considered revoked (CERTIFIED_DISCRETE)', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
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
      const attributeMock = createStandardCertifiedTenantAttribute({
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
      const attributeMock = createStandardCertifiedTenantAttribute({
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
      const attributeMock = createStandardCertifiedTenantAttribute({
        revocationTimestamp: 'timestamp',
      })
      const result = isAttributeOwned('certified', 'attribute-id', [attributeMock])
      expect(result).toBe(false)
    })

    it('should be considered owned if the attribute is in the owned attribute array, it is not revoked and it is compliant to discrete config (CERTIFIED_DISCRETE)', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        id: 'attribute-id',
        revocationTimestamp: undefined,
        discreteValue: 100,
      })
      const result = isAttributeOwned('certified', 'attribute-id', [attributeMock], {
        discreteConfig: { comparator: 'GT', threshold: 50 },
      })
      expect(result).toBe(true)
    })

    it('should not be considered owned if the attribute is not in the owned attribute array (CRETIFIED_DISCRETE)', () => {
      const result = isAttributeOwned('certified', 'attribute-id', [], {
        discreteConfig: { comparator: 'GT', threshold: 50 },
      })
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array but it is revoked (CERTIFIED_DISCRETE)', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        revocationTimestamp: 'timestamp',
        discreteValue: 100,
      })
      const result = isAttributeOwned('certified', 'attribute-id', [attributeMock], {
        discreteConfig: { comparator: 'GT', threshold: 50 },
      })
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array but it is not compliant to discrete config (CERTIFIED_DISCRETE)', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        revocationTimestamp: undefined,
        discreteValue: 10,
      })
      const result = isAttributeOwned('certified', 'attribute-id', [attributeMock], {
        discreteConfig: { comparator: 'GT', threshold: 50 },
      })
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array but discrete config is not defined (CERTIFIED_DISCRETE)', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        revocationTimestamp: undefined,
        discreteValue: 10,
      })
      const result = isAttributeOwned('certified', 'attribute-id', [attributeMock])
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array, it is not revoked (verified) but attribute is expired', () => {
      const now = Date.now()
      const yesterday = subDays(now, 1)

      const attributeMock = createVerifiedTenantAttribute({
        id: 'attribute-id-test',
        verifiedBy: [{ id: 'attribute-id', extensionDate: yesterday.toISOString() }],
      })
      const result = isAttributeOwned('verified', 'attribute-id-test', [attributeMock], {
        verifierId: 'attribute-id',
      })
      expect(result).toBe(false)
    })

    it('should be considered owned if the attribute is in the owned attribute array and it is not revoked (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({
        id: 'attribute-id-test',
        verifiedBy: [{ id: 'attribute-id' }],
      })
      const result = isAttributeOwned('verified', 'attribute-id-test', [attributeMock], {
        verifierId: 'attribute-id',
      })
      expect(result).toBe(true)
    })

    it('should not be considered owned if the attribute is not in the owned attribute array (verified)', () => {
      const result = isAttributeOwned('verified', 'attribute-id', [], { verifierId: 'producer-id' })
      expect(result).toBe(false)
    })

    it('should not be considered owned if the attribute is in the owned attribute array but it is revoked (verified)', () => {
      const attributeMock = createVerifiedTenantAttribute({ verifiedBy: [] })
      const result = isAttributeOwned('verified', 'attribute-id', [attributeMock], {
        verifierId: 'producer-id',
      })
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
      const attributeMock = createStandardCertifiedTenantAttribute({
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
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
        }),
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: '2021-09-01T12:00:00.000Z',
        }),
      ]
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-1' })]
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(true)
    })

    it('should not be considered fullfilled if no attributes are owned (certified)', () => {
      const ownedAttributes = [
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
        }),
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: '2021-09-01T12:00:00.000Z',
        }),
      ]
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-2' })]
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(false)
    })

    it('should be considered fullfilled if at least one attribute is owned (CRETIFIED_DISCRETE)', () => {
      const ownedAttributes = [
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
          discreteValue: 100,
        }),
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
          discreteValue: 35,
        }),
      ]
      const group = [
        createMockDescriptorAttribute({
          id: 'attribute-id-1',
          kind: 'CERTIFIED_DISCRETE',
          discreteConfig: { comparator: 'GT', threshold: 50 },
        }),
      ]
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(true)
    })

    it('should not be considered fullfilled if no attributes are owned (CRETIFIED_DISCRETE)', () => {
      const ownedAttributes = [
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
          discreteValue: 35,
        }),
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
          discreteValue: 44,
        }),
      ]
      const group = [
        createMockDescriptorAttribute({
          id: 'attribute-id-1',
          kind: 'CERTIFIED_DISCRETE',
          discreteConfig: { comparator: 'GT', threshold: 50 },
        }),
      ]
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(false)
    })

    it('should be considered fullfilled if at least one attribute is owned (CRETIFIED_DISCRETE and CERTIFIED)', () => {
      const ownedAttributes = [
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
        }),
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
          discreteValue: 1000,
        }),
      ]
      const group = [
        createMockDescriptorAttribute({
          id: 'attribute-id-2',
          kind: 'CERTIFIED_DISCRETE',
          discreteConfig: { comparator: 'GT', threshold: 50 },
        }),
      ]
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(true)
    })

    it('should not be considered fullfilled if no attributes are owned (CERTIFIED_DISCRETE and CERTIFIED)', () => {
      const ownedAttributes = [
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
        }),
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: '2021-09-01T12:00:00.000Z',
          discreteValue: 1000,
        }),
      ]
      const group = [
        createMockDescriptorAttribute({
          id: 'attribute-id-2',
          kind: 'CERTIFIED_DISCRETE',
          discreteConfig: { comparator: 'GT', threshold: 50 },
        }),
      ]
      const result = isAttributeGroupFullfilled('certified', ownedAttributes, group)
      expect(result).toBe(false)
    })

    it('should be considered fullfilled if at least one attribute is owned (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test' }] }),
        createVerifiedTenantAttribute({ id: 'attribute-id-2', verifiedBy: [] }),
      ]
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-1', kind: 'VERIFIED' })]
      const result = isAttributeGroupFullfilled('verified', ownedAttributes, group, 'test')
      expect(result).toBe(true)
    })

    it('should not be considered fullfilled if no attributes are owned (verified)', () => {
      const ownedAttributes = [
        createVerifiedTenantAttribute({ id: 'attribute-id-1', verifiedBy: [{ id: 'test-1' }] }),
      ]
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-2', kind: 'VERIFIED' })]
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
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-1', kind: 'DECLARED' })]
      const result = isAttributeGroupFullfilled('declared', ownedAttributes, group)
      expect(result).toBe(true)
    })

    it('should not be considered fullfilled if no attributes are owned (declared)', () => {
      const ownedAttributes = [
        createDeclaredTenantAttribute({ id: 'attribute-id-1', revocationTimestamp: undefined }),
        createDeclaredTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: '2021-09-01T12:00:00.000Z',
        }),
      ]
      const group = [createMockDescriptorAttribute({ id: 'attribute-id-2', kind: 'DECLARED' })]
      const result = isAttributeGroupFullfilled('declared', ownedAttributes, group)
      expect(result).toBe(false)
    })
  })

  describe('hasAllDescriptorAttributes', () => {
    it('should return true if the user has fullfilled all the attribute groups requirements (certified)', () => {
      const ownedAttributes = [
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
        }),
        createStandardCertifiedTenantAttribute({
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
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
        }),
        createStandardCertifiedTenantAttribute({
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

    it('should return true if the user has fullfilled all the attribute groups requirements (CERTIFIED_DISCRETE)', () => {
      const ownedAttributes = [
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
          discreteValue: 100,
        }),
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
          discreteValue: 35,
        }),
      ]

      const descriptorAttributes: DescriptorAttributes = {
        certified: [
          [
            createMockDescriptorAttribute({
              id: 'attribute-id-1',
              kind: 'CERTIFIED_DISCRETE',
              discreteConfig: { comparator: 'GT', threshold: 50 },
            }),
          ],
          [
            createMockDescriptorAttribute({
              id: 'attribute-id-2',
              kind: 'CERTIFIED_DISCRETE',
              discreteConfig: { comparator: 'LT', threshold: 50 },
            }),
            createMockDescriptorAttribute({
              id: 'attribute-id-3',
              kind: 'CERTIFIED_DISCRETE',
              discreteConfig: { comparator: 'GT', threshold: 500 },
            }),
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

    it('should return false if the user has not fullfilled all the attribute groups requirements (CERTIFIED_DISCRETE)', () => {
      const ownedAttributes = [
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
          discreteValue: 100,
        }),
        createCertifiedDiscreteTenantAttribute({
          id: 'attribute-id-2',
          revocationTimestamp: undefined,
          discreteValue: 35,
        }),
      ]

      const descriptorAttributes: DescriptorAttributes = {
        certified: [
          [
            createMockDescriptorAttribute({
              id: 'attribute-id-1',
              kind: 'CERTIFIED_DISCRETE',
              discreteConfig: { comparator: 'GT', threshold: 50 },
            }),
          ],
          [
            createMockDescriptorAttribute({
              id: 'attribute-id-2',
              kind: 'CERTIFIED_DISCRETE',
              discreteConfig: { comparator: 'LT', threshold: 50 },
            }),
            createMockDescriptorAttribute({
              id: 'attribute-id-3',
              kind: 'CERTIFIED_DISCRETE',
              discreteConfig: { comparator: 'GT', threshold: 500 },
            }),
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
          [createMockDescriptorAttribute({ id: 'attribute-id-1', kind: 'VERIFIED' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2', kind: 'VERIFIED' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3', kind: 'VERIFIED' }),
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
          [createMockDescriptorAttribute({ id: 'attribute-id-1', kind: 'VERIFIED' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2', kind: 'VERIFIED' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3', kind: 'VERIFIED' }),
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
          [createMockDescriptorAttribute({ id: 'attribute-id-1', kind: 'DECLARED' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2', kind: 'DECLARED' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3', kind: 'DECLARED' }),
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
          [createMockDescriptorAttribute({ id: 'attribute-id-1', kind: 'DECLARED' })],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-2', kind: 'DECLARED' }),
            createMockDescriptorAttribute({ id: 'attribute-id-3', kind: 'DECLARED' }),
          ],
          [
            createMockDescriptorAttribute({ id: 'attribute-id-4', kind: 'DECLARED' }),
            createMockDescriptorAttribute({ id: 'attribute-id-5', kind: 'DECLARED' }),
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
        createStandardCertifiedTenantAttribute({
          id: 'attribute-id-1',
          revocationTimestamp: undefined,
        }),
        createStandardCertifiedTenantAttribute({
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

  describe('isAttributeCompliantWithDiscreteConfig', () => {
    it('should be compliant if the attribute CERTIFIED_dISCRETE discrete value is compliant with the discrete config GT', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'GT',
        threshold: 50,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(true)
    })

    it('should be compliant if the attribute CERTIFIED_dISCRETE discrete value is compliant with the discrete config LT', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'LT',
        threshold: 1000,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(true)
    })

    it('should be compliant if the attribute CERTIFIED_dISCRETE discrete value is compliant with the discrete config GTE', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'GTE',
        threshold: 50,
      }

      const discreteConfig2: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'GTE',
        threshold: 100,
      }

      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(true)

      const result2 = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig2)
      expect(result2).toBe(true)
    })

    it('should be compliant if the attribute CERTIFIED_dISCRETE discrete value is compliant with the discrete config LTE', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'LTE',
        threshold: 1000,
      }

      const discreteConfig2: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'LTE',
        threshold: 100,
      }

      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(true)

      const result2 = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig2)
      expect(result2).toBe(true)
    })

    it('should be compliant if the attribute CERTIFIED_dISCRETE discrete value is compliant with the discrete config EQ', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'EQ',
        threshold: 100,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(true)
    })

    it('should be compliant if the attribute CERTIFIED_dISCRETE discrete value is compliant with the discrete config NE', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'NE',
        threshold: 50,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(true)
    })

    it('should not be compliant if the attribute CERTIFIED_dISCRETE discrete value is not compliant with the discrete config GT', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'GT',
        threshold: 500,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(false)
    })

    it('should not be compliant if the attribute CERTIFIED_dISCRETE discrete value is not compliant with the discrete config LT', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'LT',
        threshold: 50,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(false)
    })

    it('should not be compliant if the attribute CERTIFIED_dISCRETE discrete value is not compliant with the discrete config GTE', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'GTE',
        threshold: 500,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(false)
    })

    it('should not be compliant if the attribute CERTIFIED_dISCRETE discrete value is not compliant with the discrete config LTE', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'LTE',
        threshold: 50,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(false)
    })

    it('should not be compliant if the attribute CERTIFIED_dISCRETE discrete value is not compliant with the discrete config EQ', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'EQ',
        threshold: 50,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(false)
    })

    it('should not be compliant if the attribute CERTIFIED_dISCRETE discrete value is not compliant with the discrete config NE', () => {
      const attributeMock = createCertifiedDiscreteTenantAttribute({
        discreteValue: 100,
      })
      const discreteConfig: EServiceAttributeCertifiedDiscreteConfig = {
        comparator: 'NE',
        threshold: 100,
      }
      const result = isAttributeCompliantWithDiscreteConfig(attributeMock, discreteConfig)
      expect(result).toBe(false)
    })
  })
})
