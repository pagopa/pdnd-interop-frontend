import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import {
  canAgreementBeUpgraded,
  checkIfAlreadySubscribed,
  checkIfcanCreateAgreementDraft,
  checkIfhasAlreadyAgreementDraft,
  isNewEServiceVersionAvailable,
} from '../agreement.utils'
import {
  createMockCatalogDescriptorEService,
  createMockEServiceCatalog,
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

describe('checkIfAlreadySubscribed', () => {
  it('should return false if the eservice is undefined', () => {
    const result = checkIfAlreadySubscribed(undefined)
    expect(result).toBe(false)
  })

  it('should return false if the eservice has no agreement', () => {
    const result = checkIfAlreadySubscribed(createMockEServiceCatalog({ agreement: undefined }))
    expect(result).toBe(false)
  })

  it('should return false if the eservice with agreement state as DRAFT ', () => {
    const result = checkIfAlreadySubscribed(
      createMockEServiceCatalog({ agreement: { state: 'DRAFT' } })
    )
    expect(result).toBe(false)
  })

  it('should return false if the eservice with agreement state as REJECTED ', () => {
    const result = checkIfAlreadySubscribed(
      createMockEServiceCatalog({ agreement: { state: 'REJECTED' } })
    )
    expect(result).toBe(false)
  })

  it('should return false if the eservice with agreement state as ARCHIVED ', () => {
    const result = checkIfAlreadySubscribed(
      createMockEServiceCatalog({ agreement: { state: 'ARCHIVED' } })
    )
    expect(result).toBe(false)
  })

  it('should return true if the eservice has an agreement with state different from DRAFT or REJECTED', () => {
    const result = checkIfAlreadySubscribed(
      createMockEServiceCatalog({ agreement: { state: 'ACTIVE' } })
    )
    expect(result).toBe(true)
  })
})

describe('checkIfhasAlreadyAgreementDraft', () => {
  it('should return false if the eservice is undefined', () => {
    const result = checkIfhasAlreadyAgreementDraft(undefined)
    expect(result).toBe(false)
  })

  it('should return false if the eservice has no agreement', () => {
    const result = checkIfhasAlreadyAgreementDraft(
      createMockEServiceCatalog({ agreement: undefined })
    )
    expect(result).toBe(false)
  })

  it('should return false if the eservice with agreement state different from DRAFT ', () => {
    const result = checkIfhasAlreadyAgreementDraft(
      createMockEServiceCatalog({ agreement: { state: 'ACTIVE' } })
    )
    expect(result).toBe(false)
  })

  it('should return true if the eservice with agreement state as DRAFT ', () => {
    const result = checkIfhasAlreadyAgreementDraft(
      createMockEServiceCatalog({ agreement: { state: 'DRAFT' } })
    )
    expect(result).toBe(true)
  })
})

describe('checkIfcanCreateAgreementDraft', () => {
  it('should return false if the eservice is undefined', () => {
    const result = checkIfcanCreateAgreementDraft(
      undefined,
      createMockEServiceDescriptorCatalog({ state: 'PUBLISHED' })
    )
    expect(result).toBe(false)
  })

  it('should return false if descriptor state is undefined', () => {
    const result = checkIfcanCreateAgreementDraft(
      createMockEServiceCatalog({
        agreement: undefined,
      }),
      undefined
    )
    expect(result).toBe(false)
  })

  it('should return false if the subscriber is already subscribed', () => {
    const result = checkIfcanCreateAgreementDraft(
      createMockEServiceCatalog({
        agreement: {
          state: 'ACTIVE',
        },
      }),
      createMockEServiceDescriptorCatalog({ state: 'PUBLISHED' })
    )
    expect(result).toBe(false)
  })

  it('should return false if the subscriber has already an agreement DRAFT', () => {
    const result = checkIfcanCreateAgreementDraft(
      createMockEServiceCatalog({
        agreement: {
          state: 'DRAFT',
        },
      }),
      createMockEServiceDescriptorCatalog({ state: 'PUBLISHED' })
    )
    expect(result).toBe(false)
  })

  it('should return false if the descriptor state is different from PUBLISHED/SUSPENDED', () => {
    const result = checkIfcanCreateAgreementDraft(
      createMockEServiceCatalog({
        agreement: undefined,
      }),
      createMockEServiceDescriptorCatalog({ state: 'DEPRECATED' })
    )
    expect(result).toBe(false)
  })

  it('should return false if the eservice has no certified attributes and is not owned by the user', () => {
    const result = checkIfcanCreateAgreementDraft(
      createMockEServiceCatalog({
        isMine: false,
        agreement: undefined,
      }),
      createMockEServiceDescriptorCatalog({
        state: 'PUBLISHED',
        eservice: createMockCatalogDescriptorEService({ hasCertifiedAttributes: false }),
      })
    )
    expect(result).toBe(false)
  })

  it('should return true if the eservice has certified attributes', () => {
    const result = checkIfcanCreateAgreementDraft(
      createMockEServiceCatalog({
        isMine: false,
        agreement: undefined,
      }),
      createMockEServiceDescriptorCatalog({
        state: 'PUBLISHED',
        eservice: createMockCatalogDescriptorEService({ hasCertifiedAttributes: true }),
      })
    )
    expect(result).toBe(true)
  })

  it('should return true if the eservice is owned by the subscriber', () => {
    const result = checkIfcanCreateAgreementDraft(
      createMockEServiceCatalog({
        isMine: true,
        agreement: undefined,
      }),
      createMockEServiceDescriptorCatalog({
        state: 'PUBLISHED',
        eservice: createMockCatalogDescriptorEService({ hasCertifiedAttributes: false }),
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
