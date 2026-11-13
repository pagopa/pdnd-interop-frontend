import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
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
const mockUpdateKeychain = vi.fn()
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
    useUpdateKeychain: () => ({ mutate: mockUpdateKeychain }),
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

  it.each([
    {
      name: 'Updated keychain',
      description: keychain.description,
      fields: { name: 'Updated keychain' },
    },
    {
      name: keychain.name,
      description: 'Updated keychain description',
      fields: { description: 'Updated keychain description' },
    },
    {
      name: 'Updated keychain',
      description: 'Updated keychain description',
      fields: { name: 'Updated keychain', description: 'Updated keychain description' },
    },
  ])('submits only changed metadata', async ({ name, description, fields }) => {
    const user = userEvent.setup()
    mockUpdateKeychain.mockImplementationOnce(
      (_payload: unknown, options: { onSuccess: () => void }) => options.onSuccess()
    )
    renderPage()
    await screen.findByRole('heading', { name: keychain.name })
    await user.click(screen.getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(screen.getByRole('menuitem', { name: 'updateMetadataDrawer.title' }))
    const nameInput = await screen.findByRole('textbox', {
      name: 'updateMetadataDrawer.nameField.label',
    })
    if (name !== keychain.name) {
      await user.clear(nameInput)
      await user.type(nameInput, name)
    }
    if (description !== keychain.description) {
      const descriptionInput = screen.getByRole('textbox', {
        name: 'updateMetadataDrawer.descriptionField.label',
      })
      await user.clear(descriptionInput)
      await user.type(descriptionInput, description)
    }
    await user.click(screen.getByRole('button', { name: 'actions.saveEdits' }))

    await waitFor(() =>
      expect(mockUpdateKeychain).toHaveBeenCalledWith(
        { producerKeychainId: keychain.id, ...fields },
        { onSuccess: expect.any(Function) }
      )
    )
    await waitForElementToBeRemoved(nameInput)
  })

  it('closes the drawer without submitting unchanged metadata', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: keychain.name })
    await user.click(screen.getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(screen.getByRole('menuitem', { name: 'updateMetadataDrawer.title' }))
    const nameInput = await screen.findByRole('textbox', {
      name: 'updateMetadataDrawer.nameField.label',
    })
    const saveButton = screen.getByRole('button', { name: 'actions.saveEdits' })
    expect(saveButton).toBeEnabled()
    await user.click(saveButton)

    await waitForElementToBeRemoved(nameInput)
    expect(mockUpdateKeychain).not.toHaveBeenCalled()
  })

  it('keeps edited metadata open until the update succeeds', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: keychain.name })
    await user.click(screen.getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(screen.getByRole('menuitem', { name: 'updateMetadataDrawer.title' }))
    const nameInput = await screen.findByRole('textbox', {
      name: 'updateMetadataDrawer.nameField.label',
    })
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated keychain')
    await user.click(screen.getByRole('button', { name: 'actions.saveEdits' }))

    await waitFor(() => expect(mockUpdateKeychain).toHaveBeenCalled())
    expect(nameInput).toBeVisible()
    expect(nameInput).toHaveValue('Updated keychain')
  })

  it('opens and closes the actions menu using the keyboard', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: keychain.name })
    const menuButton = screen.getByRole('button', { name: 'iconButtonAriaLabel' })
    menuButton.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('menuitem', { name: 'actions.delete' })).toBeVisible()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menuitem')).not.toBeInTheDocument())
    expect(menuButton).toHaveFocus()
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
