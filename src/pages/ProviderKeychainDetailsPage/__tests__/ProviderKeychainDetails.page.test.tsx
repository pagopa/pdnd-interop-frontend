import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ProducerKeychain } from '@/api/api.generatedTypes'
import * as router from '@/router'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  mockUseParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import ProviderKeychainDetailsPage from '../ProviderKeychainDetails.page'

const keychain: ProducerKeychain = {
  id: 'keychain-id',
  name: 'Example keychain',
  description: 'Example keychain description',
  createdAt: '2026-01-01T00:00:00Z',
  producer: { id: 'producer-id', name: 'Example producer' },
  eservices: [],
}
const mockGetSingle = vi.fn<() => Promise<ProducerKeychain>>()
const mockDeleteKeychain =
  vi.fn<(payload: { producerKeychainId: string }, options: { onSuccess: () => void }) => void>()
const mockNavigate = vi.fn()
const mockMarkNotifications = vi.fn()

vi.mock('@/api/keychain/keychain.services', () => ({
  KeychainServices: {
    getSingle: () => mockGetSingle(),
    getProducerKeychainUsersList: async () => [],
  },
}))

vi.mock('@/api/keychain/keychain.mutations', () => ({
  KeychainMutations: {
    useDeleteKeychain: () => ({ mutate: mockDeleteKeychain }),
    useAddProducerKeychainUsers: () => ({ mutateAsync: vi.fn() }),
  },
}))

vi.mock('@/api/notification', () => ({
  NotificationMutations: {
    useMarkNotificationsAsReadByEntityId: () => ({ mutate: mockMarkNotifications }),
  },
}))

vi.mock('@/api/tenant', () => ({
  TenantQueries: {
    getPartyUsersList: () => ({ queryKey: ['keychain-test-party-users'], queryFn: async () => [] }),
  },
}))

const renderPage = () =>
  renderWithApplicationContext(<ProviderKeychainDetailsPage />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })

describe('ProviderKeychainDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt()
    mockUseParams({ keychainId: keychain.id })
    mockUseCurrentRoute({ routeKey: 'PROVIDE_KEYCHAIN_DETAILS', mode: 'provider' })
    vi.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate)
    mockGetSingle.mockResolvedValue(keychain)
  })

  it('displays the keychain metadata and exposes delete and edit through a menu', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByRole('heading', { name: keychain.name })).toBeVisible()
    expect(screen.getByText(keychain.description)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'actions.delete' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'iconButtonAriaLabel' }))

    expect(screen.getByRole('menuitem', { name: 'actions.delete' })).toBeVisible()
    expect(screen.getByRole('menuitem', { name: 'updateMetadataDrawer.title' })).toBeVisible()
  })

  it('preserves delete payload and navigation on success', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: keychain.name })
    await user.click(screen.getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(screen.getByRole('menuitem', { name: 'actions.delete' }))

    expect(mockDeleteKeychain).toHaveBeenCalledWith(
      { producerKeychainId: keychain.id },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(mockNavigate).not.toHaveBeenCalled()
    mockDeleteKeychain.mock.calls[0][1].onSuccess()
    expect(mockNavigate).toHaveBeenCalledWith('PROVIDE_KEYCHAINS_LIST')
  })

  it('opens the metadata drawer with current values and closes with Escape', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: keychain.name })
    await user.click(screen.getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(screen.getByRole('menuitem', { name: 'updateMetadataDrawer.title' }))

    const nameInput = await screen.findByRole('textbox', {
      name: 'updateMetadataDrawer.nameField.label',
    })
    expect(nameInput).toHaveValue(keychain.name)
    expect(nameInput).toHaveAttribute('maxlength', '60')
    const descriptionInput = screen.getByRole('textbox', {
      name: 'updateMetadataDrawer.descriptionField.label',
    })
    expect(descriptionInput).toHaveValue(keychain.description)
    expect(descriptionInput).toHaveAttribute('maxlength', '250')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument())
  })

  it('keeps metadata readable without administrative actions for non-admins', async () => {
    mockUseJwt({ isAdmin: false, isViewer: true })
    renderPage()

    expect(await screen.findByRole('heading', { name: keychain.name })).toBeVisible()
    expect(screen.getByText(keychain.description)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'iconButtonAriaLabel' })).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
