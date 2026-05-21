import {
  ReactHookFormWrapper,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { EServiceProducerKeychainSection } from '../EServiceProducerKeychainSection'
import { mockUseEServiceCreateContext } from '@/../__mocks__/data/eservice.mocks'

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

beforeEach(() => {
  mockUseEServiceCreateContext({ areEServiceGeneralInfoEditable: true })
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceProducerKeychainSection', () => {
  it('renders title and subtitle', () => {
    mockUseJwt()
    ;(useQuery as Mock).mockReturnValue({
      data: [makeKeychain('k1', 'Keychain 1')],
      isPending: false,
    })

    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('shows only the API role alert when user is isOperatorAPI', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    ;(useQuery as Mock).mockReturnValue({ data: [], isPending: false })

    renderComponent()
    expect(screen.getByText('apiRoleAlert')).toBeInTheDocument()
    expect(screen.queryByText('addKeychainBtn')).not.toBeInTheDocument()
    expect(screen.queryByText('keychainField.label')).not.toBeInTheDocument()
  })

  it('shows empty-list alert when no keychains exist for the organization', () => {
    mockUseJwt()
    ;(useQuery as Mock).mockReturnValue({ data: [], isPending: false })

    renderComponent()
    expect(screen.getByText('noKeychainAlert')).toBeInTheDocument()
    expect(screen.queryByText('addKeychainBtn')).not.toBeInTheDocument()
  })

  it('renders autocomplete row and add button when keychains exist', () => {
    mockUseJwt()
    ;(useQuery as Mock).mockReturnValue({
      data: [makeKeychain('k1', 'Keychain 1')],
      isPending: false,
    })

    renderComponent()
    expect(screen.getAllByText('keychainField.label').length).toBeGreaterThan(0)
    expect(screen.getByText('addKeychainBtn')).toBeInTheDocument()
  })

  it('appends a new row when "+ Aggiungi portachiavi" is clicked', async () => {
    mockUseJwt()
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
    mockUseJwt()
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

  it('renders the read-only list of associated keychains when not editable', () => {
    mockUseEServiceCreateContext({ areEServiceGeneralInfoEditable: false })
    mockUseJwt()
    ;(useQuery as Mock).mockReturnValue({ data: [], isPending: false })

    renderComponent({
      keychains: [
        { value: makeKeychain('k1', 'Keychain 1') },
        { value: makeKeychain('k2', 'Keychain 2') },
      ],
    })

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
    expect(screen.getByText('readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('Keychain 1')).toBeInTheDocument()
    expect(screen.getByText('Keychain 2')).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.queryByText('addKeychainBtn')).not.toBeInTheDocument()
  })

  it('renders "-" in read-only mode when no keychains are associated', () => {
    mockUseEServiceCreateContext({ areEServiceGeneralInfoEditable: false })
    mockUseJwt()
    ;(useQuery as Mock).mockReturnValue({ data: [], isPending: false })

    renderComponent({ keychains: [{ value: null }] })

    expect(screen.getByText('readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.queryByText('addKeychainBtn')).not.toBeInTheDocument()
  })

  it('excludes keychains already selected in other rows and restores them on change/removal', async () => {
    mockUseJwt()
    ;(useQuery as Mock).mockReturnValue({
      data: [
        makeKeychain('k1', 'Keychain 1'),
        makeKeychain('k2', 'Keychain 2'),
        makeKeychain('k3', 'Keychain 3'),
      ],
      isPending: false,
    })

    renderComponent({ keychains: [{ value: null }, { value: null }] })

    const getOptionLabels = async (combobox: HTMLElement) => {
      await userEvent.click(combobox)
      const listbox = await screen.findByRole('listbox')
      const labels = within(listbox)
        .getAllByRole('option')
        .map((o) => o.textContent ?? '')
      // close the popper before the next interaction
      await userEvent.keyboard('{Escape}')
      return labels
    }

    let comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBe(2)

    // Select Keychain 1 in the first row.
    await userEvent.click(comboboxes[0])
    let listbox = await screen.findByRole('listbox')
    await userEvent.click(within(listbox).getByRole('option', { name: 'Keychain 1' }))

    // Second row should now only offer Keychain 2 and Keychain 3.
    comboboxes = screen.getAllByRole('combobox')
    let row2Options = await getOptionLabels(comboboxes[1])
    expect(row2Options).toEqual(['Keychain 2', 'Keychain 3'])

    // Change the first row's selection to Keychain 3.
    await userEvent.click(comboboxes[0])
    listbox = await screen.findByRole('listbox')
    await userEvent.click(within(listbox).getByRole('option', { name: 'Keychain 3' }))

    // Keychain 1 should be available again in the second row, Keychain 3 excluded.
    comboboxes = screen.getAllByRole('combobox')
    row2Options = await getOptionLabels(comboboxes[1])
    expect(row2Options).toEqual(['Keychain 1', 'Keychain 2'])

    // Select Keychain 2 in the second row, then add a third row.
    await userEvent.click(comboboxes[1])
    listbox = await screen.findByRole('listbox')
    await userEvent.click(within(listbox).getByRole('option', { name: 'Keychain 2' }))

    await userEvent.click(screen.getByText('addKeychainBtn'))
    comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBe(3)

    // Third row sees only Keychain 1 (k2 and k3 are taken).
    let row3Options = await getOptionLabels(comboboxes[2])
    expect(row3Options).toEqual(['Keychain 1'])

    // Remove the second row → Keychain 2 must be restored as an option for the new last row.
    const removeButtons = screen.getAllByRole('button', { name: 'removeRowTooltip' })
    await userEvent.click(removeButtons[0])

    comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBe(2)
    row3Options = await getOptionLabels(comboboxes[1])
    expect(row3Options).toEqual(['Keychain 1', 'Keychain 2'])
  })

  it('shows the read-only list to isOperatorAPI when not editable (no api role alert)', () => {
    mockUseEServiceCreateContext({ areEServiceGeneralInfoEditable: false })
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    ;(useQuery as Mock).mockReturnValue({ data: [], isPending: false })

    renderComponent({
      keychains: [{ value: makeKeychain('k1', 'Keychain 1') }],
    })

    expect(screen.getByText('readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('Keychain 1')).toBeInTheDocument()
    expect(screen.queryByText('apiRoleAlert')).not.toBeInTheDocument()
  })
})
