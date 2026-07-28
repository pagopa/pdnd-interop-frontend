import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { SetClientAdminDrawer } from '../SetClientAdminDrawer'

const { mockedSetClientAdmin, mockedOnClose, state } = vi.hoisted(() => ({
  mockedSetClientAdmin: vi.fn(),
  mockedOnClose: vi.fn(),
  state: {
    users: [
      { userId: 'admin-1', name: 'Mario', familyName: 'Rossi' },
      { userId: 'admin-2', name: 'Luigi', familyName: 'Bianchi' },
    ],
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: (_ns: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => (options?.keyPrefix ? `${options.keyPrefix}.${key}` : key),
  }),
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => ({ jwt: { organizationId: 'org-id' } }),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: () => ({ data: state.users, isLoading: false }),
}))

vi.mock('@/api/client', () => ({
  ClientMutations: {
    useSetClientAdmin: () => ({ mutate: mockedSetClientAdmin }),
  },
}))

vi.mock('@/api/tenant', () => ({
  TenantQueries: {
    getPartyUsersList: () => ({ queryKey: ['TenantGetPartyUsersList'] }),
  },
}))

vi.mock('@/components/shared/Drawer', () => ({
  Drawer: ({
    title,
    subtitle,
    children,
    buttonAction,
    onTransitionExited,
  }: {
    title: string
    subtitle: React.ReactNode
    children: React.ReactNode
    buttonAction: { label: string; action: VoidFunction }
    onTransitionExited?: VoidFunction
  }) => (
    <div>
      <h2>{title}</h2>
      <div>{subtitle}</div>
      {children}
      <button type="button" onClick={buttonAction.action}>
        {buttonAction.label}
      </button>
      <button type="button" onClick={onTransitionExited}>
        transition-exit
      </button>
    </div>
  ),
}))

vi.mock('@/components/shared/react-hook-form-inputs', () => ({
  RHFAutocompleteSingle: ({ name }: { name: string }) => {
    const { setValue } = useFormContext()
    return (
      <button type="button" onClick={() => setValue(name, 'admin-2')}>
        set-admin
      </button>
    )
  },
}))

describe('SetClientAdminDrawer', () => {
  beforeEach(() => {
    mockedSetClientAdmin.mockReset()
    mockedOnClose.mockReset()
  })

  it('renders substitute title when admin exists', () => {
    renderWithApplicationContext(
      <SetClientAdminDrawer
        isOpen
        onClose={mockedOnClose}
        clientId="client-id"
        admin={{ userId: 'admin-1', name: 'Mario', familyName: 'Rossi' }}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(
      screen.getByRole('heading', { name: 'edit.setClientAdminDrawer.title.substitute' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.substituteAdmin' })).toBeInTheDocument()
  })

  it('submits selected admin and closes on success', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <SetClientAdminDrawer
        isOpen
        onClose={mockedOnClose}
        clientId="client-id"
        admin={{ userId: 'admin-1', name: 'Mario', familyName: 'Rossi' }}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'set-admin' }))
    await user.click(screen.getByRole('button', { name: 'actions.substituteAdmin' }))

    expect(mockedSetClientAdmin).toHaveBeenCalledWith(
      {
        clientId: 'client-id',
        payload: { adminId: 'admin-2' },
      },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )

    const onSuccess = mockedSetClientAdmin.mock.calls[0]?.[1]?.onSuccess
    onSuccess?.()
    expect(mockedOnClose).toHaveBeenCalledTimes(1)
  })
})
