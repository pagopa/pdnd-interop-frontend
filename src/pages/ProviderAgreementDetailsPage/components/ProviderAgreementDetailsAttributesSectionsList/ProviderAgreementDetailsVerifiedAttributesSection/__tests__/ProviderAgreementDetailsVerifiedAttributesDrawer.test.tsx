import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ProviderAgreementDetailsVerifiedAttributesDrawer } from '../ProviderAgreementDetailsVerifiedAttributesDrawer'

const { contextMock, verifyAttributeMock, revokeAttributeMock } = vi.hoisted(() => ({
  contextMock: vi.fn(),
  verifyAttributeMock: vi.fn(),
  revokeAttributeMock: vi.fn(),
}))

vi.mock('@/api/attribute', () => ({
  AttributeMutations: {
    useVerifyPartyAttribute: () => ({ mutate: verifyAttributeMock }),
    useRevokeVerifiedPartyAttribute: () => ({ mutate: revokeAttributeMock }),
    useUpdateVerifiedPartyAttribute: () => ({ mutate: vi.fn() }),
  },
}))

vi.mock('@/pages/ProviderAgreementDetailsPage/components/ProviderAgreementDetailsContext', () => ({
  useProviderAgreementDetailsContext: contextMock,
}))

vi.mock('../ProviderAgreementDetailsVerifiedAttributesDrawerForm', () => ({
  ProviderAgreementDetailsVerifiedAttributesDrawerForm: () => null,
}))

const agreement = createMockAgreement({
  delegation: {
    id: 'delegation-id',
    delegate: { id: 'delegate-id', name: 'Delegate tenant' },
  },
})

function renderDrawer(type: 'verify' | 'revoke') {
  return renderWithApplicationContext(
    <ProviderAgreementDetailsVerifiedAttributesDrawer
      providerAgreementVerifiedAttributesDrawerState={{
        isOpen: true,
        attributeId: 'attribute-id',
        type,
      }}
      onClose={vi.fn()}
    />,
    {}
  )
}

describe('ProviderAgreementDetailsVerifiedAttributesDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    contextMock.mockReturnValue({ agreement })
  })

  it('should pass the producer delegation when verifying an attribute', async () => {
    const user = userEvent.setup()
    renderDrawer('verify')

    await user.click(screen.getByRole('button', { name: 'actions.verify' }))

    expect(verifyAttributeMock).toHaveBeenCalledWith(
      {
        partyId: agreement.consumer.id,
        id: 'attribute-id',
        expirationDate: undefined,
        agreementId: agreement.id,
        delegationId: agreement.delegation?.id,
      },
      expect.any(Object)
    )
  })

  it('should pass the producer delegation when revoking an attribute', async () => {
    const user = userEvent.setup()
    renderDrawer('revoke')

    await user.click(screen.getByRole('button', { name: 'actions.revoke' }))

    expect(revokeAttributeMock).toHaveBeenCalledWith(
      {
        partyId: agreement.consumer.id,
        attributeId: 'attribute-id',
        agreementId: agreement.id,
        delegationId: agreement.delegation?.id,
      },
      expect.any(Object)
    )
  })
})
