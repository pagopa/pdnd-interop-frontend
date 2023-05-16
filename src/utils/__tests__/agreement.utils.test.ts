import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { canAgreementBeUpgraded } from '../agreement.utils'

describe('testing canAgreementBeUpgraded utility function', () => {
  it('shoud always return false when the mode is different from the consumer', () => {
    const agreementMock = createMockAgreement()
    const result = canAgreementBeUpgraded(agreementMock, 'provider')

    expect(result).toBe(false)
  })

  it('shoud not be possible to upgrade an ARCHIVED agreement', () => {
    const agreementMock = createMockAgreement({
      state: 'ARCHIVED',
      eservice: { activeDescriptor: { state: 'PUBLISHED', version: '4' }, version: '3' },
    })
    const result = canAgreementBeUpgraded(agreementMock, 'consumer')

    expect(result).toBe(false)
  })

  it('shoud not be possible to upgrade an agreement to an e-service with an active version with a state different from SUSPENDED or PUBLISHED', () => {
    const agreementMock = createMockAgreement({
      state: 'ACTIVE',
      eservice: { activeDescriptor: { state: 'ARCHIVED', version: '4' }, version: '3' },
    })
    const result = canAgreementBeUpgraded(agreementMock, 'consumer')

    expect(result).toBe(false)
  })

  it('shoud not be possible to upgrade an agreement if the active descriptor version is equal to the actual version the user is subscribed to', () => {
    const agreementMock = createMockAgreement({
      state: 'ACTIVE',
      eservice: { activeDescriptor: { state: 'PUBLISHED', version: '4' }, version: '4' },
    })
    const result = canAgreementBeUpgraded(agreementMock, 'consumer')

    expect(result).toBe(false)
  })

  it('shoud be possible to upgrade an agreement if the requirements are met', () => {
    const agreementMock = createMockAgreement({
      state: 'ACTIVE',
      eservice: { activeDescriptor: { state: 'PUBLISHED', version: '4' }, version: '2' },
    })
    const result = canAgreementBeUpgraded(agreementMock, 'consumer')

    expect(result).toBe(true)
  })

  it('shoud not be possible to upgrade an agreement if the agreement state is REJECTED', () => {
    const agreementMock = createMockAgreement({
      state: 'REJECTED',
      eservice: { activeDescriptor: { state: 'PUBLISHED', version: '4' }, version: '2' },
    })
    const result = canAgreementBeUpgraded(agreementMock, 'consumer')

    expect(result).toBe(false)
  })
})
