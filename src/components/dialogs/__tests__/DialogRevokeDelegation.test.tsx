import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogRevokeDelegation } from '../DialogRevokeDelegation'
import type { DialogRevokeDelegationProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockCloseDialog = vi.fn()

vi.mock('react-i18next', () => ({
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTranslation: (_namespace: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => `${options?.keyPrefix ? `${options.keyPrefix}.` : ''}${key}`,
  }),
}))

vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: vi.fn() }),
  }
})

const mockRevokeProducerDelegation = vi.fn()
const mockRevokeConsumerDelegation = vi.fn()

vi.mock('@/api/delegation', () => ({
  DelegationMutations: {
    useRevokeProducerDelegation: () => ({ mutate: mockRevokeProducerDelegation }),
    useRevokeConsumerDelegation: () => ({ mutate: mockRevokeConsumerDelegation }),
  },
}))

const renderDialog = (overrides: Partial<DialogRevokeDelegationProps> = {}) => {
  const props: DialogRevokeDelegationProps = {
    type: 'revokeDelegation',
    delegationId: 'delegation-1',
    eserviceName: 'My e-service',
    delegateName: 'Comune di Roma',
    delegationKind: 'DELEGATED_PRODUCER',
    ...overrides,
  }

  return renderWithApplicationContext(<DialogRevokeDelegation {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogRevokeDelegation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders producer delegation copy and keeps revoke disabled until confirmation is checked', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogRevokeDelegation.producer.title')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.cancel' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogRevokeDelegation.producer.actions.revoke' })
    ).toBeDisabled()
    expect(
      screen.getByText('dialogRevokeDelegation.producer.content.description')
    ).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('revokes a producer delegation only after confirmation and closes the dialog', async () => {
    renderDialog()

    const revokeButton = screen.getByRole('button', {
      name: 'dialogRevokeDelegation.producer.actions.revoke',
    })
    expect(revokeButton).toBeDisabled()
    expect(mockRevokeProducerDelegation).not.toHaveBeenCalled()
    expect(mockCloseDialog).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('checkbox'))
    expect(revokeButton).toBeEnabled()

    await userEvent.click(revokeButton)

    expect(mockRevokeProducerDelegation).toHaveBeenCalledTimes(1)
    expect(mockRevokeProducerDelegation).toHaveBeenCalledWith({ delegationId: 'delegation-1' })
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(mockRevokeConsumerDelegation).not.toHaveBeenCalled()
  })

  it('uses the consumer revoke mutation when delegationKind is DELEGATED_CONSUMER', async () => {
    renderDialog({ delegationKind: 'DELEGATED_CONSUMER', delegateName: 'Comune di Roma' })

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(
      screen.getByRole('button', { name: 'dialogRevokeDelegation.consumer.actions.revoke' })
    )

    expect(mockRevokeConsumerDelegation).toHaveBeenCalledTimes(1)
    expect(mockRevokeConsumerDelegation).toHaveBeenCalledWith({ delegationId: 'delegation-1' })
    expect(mockRevokeProducerDelegation).not.toHaveBeenCalled()
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })

  it('closes the dialog when the cancel button is clicked', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'actions.cancel' }))

    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(mockRevokeProducerDelegation).not.toHaveBeenCalled()
    expect(mockRevokeConsumerDelegation).not.toHaveBeenCalled()
  })
})
