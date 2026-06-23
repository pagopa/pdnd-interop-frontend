import type { TFunction } from 'i18next'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import {
  canAgreementBeUpgraded,
  checkIfcanCreateAgreementDraft,
  checkIfhasAlreadyAgreementDraft,
  getConsumerAgreementVersionAlertSpec,
  isNewEServiceVersionAvailable,
} from '../agreement.utils'
import {
  createMockCatalogDescriptorEService,
  createMockEServiceDescriptorCatalog,
} from '@/../__mocks__/data/eservice.mocks'

describe('canAgreementBeUpgraded', () => {
  it('shoud always return false when the active descriptor of the eservice agreement is undefined', () => {
    const agreementMock = createMockAgreement({ eservice: { activeDescriptor: undefined } })
    const result = canAgreementBeUpgraded(agreementMock)
    expect(result).toBe(false)
  })

  it('shoud not be possible to upgrade an ARCHIVED agreement', () => {
    const agreementMock = createMockAgreement({
      state: 'ARCHIVED',
      eservice: { activeDescriptor: { state: 'PUBLISHED', version: '4' }, version: '3' },
    })
    const result = canAgreementBeUpgraded(agreementMock)

    expect(result).toBe(false)
  })

  it('shoud not be possible to upgrade an agreement to an e-service with an active version with a state different from SUSPENDED or PUBLISHED', () => {
    const agreementMock = createMockAgreement({
      state: 'ACTIVE',
      eservice: { activeDescriptor: { state: 'ARCHIVED', version: '4' }, version: '3' },
    })
    const result = canAgreementBeUpgraded(agreementMock)

    expect(result).toBe(false)
  })

  it('shoud not be possible to upgrade an agreement if the active descriptor version is equal to the actual version the user is subscribed to', () => {
    const agreementMock = createMockAgreement({
      state: 'ACTIVE',
      eservice: { activeDescriptor: { state: 'PUBLISHED', version: '4' }, version: '4' },
    })
    const result = canAgreementBeUpgraded(agreementMock)

    expect(result).toBe(false)
  })

  it('shoud be possible to upgrade an agreement if the requirements are met', () => {
    const agreementMock = createMockAgreement({
      state: 'ACTIVE',
      eservice: { activeDescriptor: { state: 'PUBLISHED', version: '4' }, version: '2' },
    })
    const result = canAgreementBeUpgraded(agreementMock)

    expect(result).toBe(true)
  })

  it('shoud not be possible to upgrade an agreement if the agreement state is REJECTED', () => {
    const agreementMock = createMockAgreement({
      state: 'REJECTED',
      eservice: { activeDescriptor: { state: 'PUBLISHED', version: '4' }, version: '2' },
    })
    const result = canAgreementBeUpgraded(agreementMock)

    expect(result).toBe(false)
  })
})

describe('checkIfhasAlreadyAgreementDraft', () => {
  it('should return false if the eservice is undefined', () => {
    const result = checkIfhasAlreadyAgreementDraft(undefined)
    expect(result).toBe(false)
  })

  it('should return false if the eservice has no agreement', () => {
    const result = checkIfhasAlreadyAgreementDraft(
      createMockCatalogDescriptorEService({ agreements: [] })
    )
    expect(result).toBe(false)
  })

  it('should return false if the eservice with agreement state different from DRAFT ', () => {
    const result = checkIfhasAlreadyAgreementDraft(
      createMockCatalogDescriptorEService({
        agreements: [{ id: 'agreement-id', state: 'ACTIVE', consumerId: 'consumer-id' }],
      })
    )
    expect(result).toBe(false)
  })

  it('should return true if the eservice with agreement state as DRAFT ', () => {
    const result = checkIfhasAlreadyAgreementDraft(
      createMockCatalogDescriptorEService({
        agreements: [{ id: 'agreement-id', state: 'DRAFT', consumerId: 'consumer-id' }],
      })
    )
    expect(result).toBe(true)
  })
})

describe('checkIfcanCreateAgreementDraft', () => {
  it('should return false if descriptor is undefined', () => {
    const result = checkIfcanCreateAgreementDraft('organizationId', undefined)
    expect(result).toBe(false)
  })

  it('should return false if the subscriber is already subscribed', () => {
    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [{ id: 'agreement-id', state: 'ACTIVE', consumerId: 'organizationId' }],
    })

    const result = checkIfcanCreateAgreementDraft(
      'organizationId',
      createMockEServiceDescriptorCatalog({ state: 'PUBLISHED', eservice: eserviceMock })
    )
    expect(result).toBe(false)
  })

  it('should return false if the subscriber has already an agreement DRAFT', () => {
    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [{ id: 'agreement-id', state: 'DRAFT', consumerId: 'organizationId' }],
    })

    const result = checkIfcanCreateAgreementDraft(
      'organizationId',
      createMockEServiceDescriptorCatalog({ state: 'PUBLISHED', eservice: eserviceMock })
    )
    expect(result).toBe(false)
  })

  it('should return false if the descriptor state is different from PUBLISHED/SUSPENDED', () => {
    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
    })

    const result = checkIfcanCreateAgreementDraft(
      'organizationId',
      createMockEServiceDescriptorCatalog({ state: 'DEPRECATED', eservice: eserviceMock })
    )
    expect(result).toBe(false)
  })

  it('should return false if the eservice has no certified attributes and is not owned by the user', () => {
    const eserviceMock = createMockCatalogDescriptorEService({
      isMine: false,
      agreements: [],
      hasCertifiedAttributes: false,
    })

    const result = checkIfcanCreateAgreementDraft(
      'organizationId',
      createMockEServiceDescriptorCatalog({
        state: 'PUBLISHED',
        eservice: eserviceMock,
      })
    )
    expect(result).toBe(false)
  })

  it('should return true if the eservice has certified attributes', () => {
    const eserviceMock = createMockCatalogDescriptorEService({
      isMine: false,
      agreements: [],
      hasCertifiedAttributes: true,
    })

    const result = checkIfcanCreateAgreementDraft(
      'organizationId',
      createMockEServiceDescriptorCatalog({
        state: 'PUBLISHED',
        eservice: eserviceMock,
      })
    )
    expect(result).toBe(true)
  })

  it('should return true if the eservice is owned by the subscriber', () => {
    const eserviceMock = createMockCatalogDescriptorEService({
      isMine: true,
      agreements: [],
      hasCertifiedAttributes: false,
    })

    const result = checkIfcanCreateAgreementDraft(
      'organizationId',
      createMockEServiceDescriptorCatalog({
        state: 'PUBLISHED',
        eservice: eserviceMock,
      })
    )
    expect(result).toBe(true)
  })
})

describe('isNewEServiceVersionAvailable', () => {
  it('should return true if the eservice has an active descriptor and it has a version greater than the actual agreement eservice version', () => {
    const agreement = createMockAgreement({
      eservice: { activeDescriptor: { version: '4' }, version: '3' },
    })
    const result = isNewEServiceVersionAvailable(agreement)
    expect(result).toBe(true)
  })

  it('should return false if the eservice has not an active descriptor', () => {
    const agreement = createMockAgreement({
      eservice: { activeDescriptor: undefined, version: '3' },
    })
    const result = isNewEServiceVersionAvailable(agreement)
    expect(result).toBe(false)
  })

  it('should return false if the eservice has an active descriptor but it has not a version greater than the actual agreement eservice version', () => {
    const agreement = createMockAgreement({
      eservice: { activeDescriptor: { version: '3' }, version: '3' },
    })
    const result = isNewEServiceVersionAvailable(agreement)
    expect(result).toBe(false)
  })
})

describe('getConsumerAgreementVersionAlertSpec utility function testing', () => {
  const t = ((key: string, opts?: { date?: string }) =>
    opts && 'date' in opts ? `${key}:${opts.date}` : key) as unknown as TFunction<
    'agreement',
    'consumerRead.versionAlert'
  >

  const baseArgs = {
    scope: undefined,
    archivableOn: undefined,
    archivedAt: undefined,
    t,
  } as const

  it('returns empty array for states with no matching pattern (PUBLISHED)', () => {
    expect(getConsumerAgreementVersionAlertSpec({ ...baseArgs, state: 'PUBLISHED' })).toEqual([])
  })

  it('returns single info alert for DEPRECATED', () => {
    expect(getConsumerAgreementVersionAlertSpec({ ...baseArgs, state: 'DEPRECATED' })).toEqual([
      { severity: 'info', content: 'deprecatedActive' },
    ])
  })

  it('returns single warning alert with date for ARCHIVING + scope DESCRIPTOR (no see-details)', () => {
    const result = getConsumerAgreementVersionAlertSpec({
      ...baseArgs,
      state: 'ARCHIVING',
      scope: 'DESCRIPTOR',
      archivableOn: '2026-12-01T00:00:00.000Z',
    })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ severity: 'warning' })
    expect(result[0].content).toMatch(/^archivingDescriptor:/)
    expect(result[0].showSeeDetailsAction).toBeUndefined()
  })

  it('returns a single warning alert with see-details for ARCHIVING + scope ESERVICE', () => {
    const result = getConsumerAgreementVersionAlertSpec({
      ...baseArgs,
      state: 'ARCHIVING',
      scope: 'ESERVICE',
      archivableOn: '2026-12-01T00:00:00.000Z',
    })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ severity: 'warning', showSeeDetailsAction: true })
    expect(result[0].content).toMatch(/^archivingEService:/)
  })

  it('returns single error alert for ARCHIVING_SUSPENDED + scope DESCRIPTOR', () => {
    const result = getConsumerAgreementVersionAlertSpec({
      ...baseArgs,
      state: 'ARCHIVING_SUSPENDED',
      scope: 'DESCRIPTOR',
      archivableOn: '2026-12-01T00:00:00.000Z',
    })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ severity: 'error' })
    expect(result[0].content).toMatch(/^archivingSuspendedDescriptor:/)
  })

  it('returns error + warning with see-details for ARCHIVING_SUSPENDED + scope ESERVICE', () => {
    const result = getConsumerAgreementVersionAlertSpec({
      ...baseArgs,
      state: 'ARCHIVING_SUSPENDED',
      scope: 'ESERVICE',
      archivableOn: '2026-12-01T00:00:00.000Z',
    })
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ severity: 'error', content: 'suspendedLastNoNewVersion' })
    expect(result[1]).toMatchObject({ severity: 'warning', showSeeDetailsAction: true })
    expect(result[1].content).toMatch(/^archivingEService:/)
  })

  it('returns single error alert for SUSPENDED', () => {
    expect(getConsumerAgreementVersionAlertSpec({ ...baseArgs, state: 'SUSPENDED' })).toEqual([
      { severity: 'error', content: 'suspendedLast' },
    ])
  })

  it('returns archivedEService for ARCHIVED + scope ESERVICE', () => {
    const result = getConsumerAgreementVersionAlertSpec({
      ...baseArgs,
      state: 'ARCHIVED',
      scope: 'ESERVICE',
      archivedAt: '2026-12-01T00:00:00.000Z',
    })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ severity: 'error' })
    expect(result[0].content).toMatch(/^archivedEService:/)
  })

  it('returns archivedDescriptor for ARCHIVED + scope DESCRIPTOR (default branch)', () => {
    const result = getConsumerAgreementVersionAlertSpec({
      ...baseArgs,
      state: 'ARCHIVED',
      scope: 'DESCRIPTOR',
      archivedAt: '2026-12-01T00:00:00.000Z',
    })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ severity: 'error' })
    expect(result[0].content).toMatch(/^archivedDescriptor:/)
  })

  it('returns empty array for ARCHIVING without a scope (no matching branch)', () => {
    expect(getConsumerAgreementVersionAlertSpec({ ...baseArgs, state: 'ARCHIVING' })).toEqual([])
  })
})
