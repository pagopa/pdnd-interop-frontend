import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { EServiceProducerKeychainSection } from '../EServiceProducerKeychainSection'

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return { ...actual, useQuery: vi.fn() }
})

vi.mock('@/api/keychain', () => ({
  KeychainQueries: {
    getKeychainsList: vi.fn(() => ({ queryKey: ['KeychainGetList'], queryFn: vi.fn() })),
  },
}))

const useJwtSpy = vi.spyOn(AuthHooks, 'useJwt')

const makeJwt = (overrides: Partial<ReturnType<typeof AuthHooks.useJwt>> = {}) =>
  ({
    isAdmin: true,
    isOperatorAPI: false,
    isOperatorSecurity: false,
    isSupport: false,
    ...overrides,
  }) as ReturnType<typeof AuthHooks.useJwt>

const makeKeychain = (id: string, name: string) => ({ id, name, hasKeys: false })

const renderComponent = (
  defaultValues: Record<string, unknown> = { keychains: [{ value: null }] }
) =>
  renderWithApplicationContext(
    <ReactHookFormWrapper defaultValues={defaultValues}>
      <EServiceProducerKeychainSection />
    </ReactHookFormWrapper>,
    { withReactQueryContext: false, withRouterContext: false }
  )

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceProducerKeychainSection', () => {
  it('renders title and subtitle', () => {
    useJwtSpy.mockReturnValue(makeJwt())
    ;(useQuery as Mock).mockReturnValue({
      data: [makeKeychain('k1', 'Keychain 1')],
      isPending: false,
    })

    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('shows only the API role alert when user is isOperatorAPI', () => {
    useJwtSpy.mockReturnValue(makeJwt({ isAdmin: false, isOperatorAPI: true }))
    ;(useQuery as Mock).mockReturnValue({ data: [], isPending: false })

    renderComponent()
    expect(screen.getByText('apiRoleAlert')).toBeInTheDocument()
    expect(screen.queryByText('addKeychainBtn')).not.toBeInTheDocument()
    expect(screen.queryByText('keychainField.label')).not.toBeInTheDocument()
  })

  it('shows empty-list alert when no keychains exist for the organization', () => {
    useJwtSpy.mockReturnValue(makeJwt())
    ;(useQuery as Mock).mockReturnValue({ data: [], isPending: false })

    renderComponent()
    expect(screen.getByText('noKeychainAlert')).toBeInTheDocument()
    expect(screen.queryByText('addKeychainBtn')).not.toBeInTheDocument()
  })

  it('renders autocomplete row and add button when keychains exist', () => {
    useJwtSpy.mockReturnValue(makeJwt())
    ;(useQuery as Mock).mockReturnValue({
      data: [makeKeychain('k1', 'Keychain 1')],
      isPending: false,
    })

    renderComponent()
    expect(screen.getAllByText('keychainField.label').length).toBeGreaterThan(0)
    expect(screen.getByText('addKeychainBtn')).toBeInTheDocument()
  })

  it('appends a new row when "+ Aggiungi portachiavi" is clicked', async () => {
    useJwtSpy.mockReturnValue(makeJwt())
    ;(useQuery as Mock).mockReturnValue({
      data: [makeKeychain('k1', 'Keychain 1'), makeKeychain('k2', 'Keychain 2')],
      isPending: false,
    })

    renderComponent()
    expect(screen.getAllByRole('combobox').length).toBe(1)
    await userEvent.click(screen.getByText('addKeychainBtn'))
    expect(screen.getAllByRole('combobox').length).toBe(2)
  })

  it('removes a row when the remove icon is clicked', async () => {
    useJwtSpy.mockReturnValue(makeJwt())
    ;(useQuery as Mock).mockReturnValue({
      data: [makeKeychain('k1', 'Keychain 1')],
      isPending: false,
    })

    renderComponent({
      keychains: [{ value: null }, { value: null }],
    })

    expect(screen.getAllByRole('combobox').length).toBe(2)
    const removeButtons = screen.getAllByRole('button', { name: 'removeRowTooltip' })
    expect(removeButtons.length).toBe(1)
    await userEvent.click(removeButtons[0])
    expect(screen.getAllByRole('combobox').length).toBe(1)
  })
})
