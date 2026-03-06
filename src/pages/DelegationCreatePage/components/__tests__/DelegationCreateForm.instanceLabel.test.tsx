import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { AxiosError } from 'axios'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { DelegationCreateForm } from '../DelegationCreateForm'
import * as DelegationModule from '@/api/delegation'

const MOCK_TEMPLATE_NAME = 'Credenziale IT-Wallet'

vi.mock('../DelegationCreateEServiceFromTemplateAutocomplete', () => ({
  DelegationCreateEServiceFromTemplateAutocomplete: ({
    handleTemplateNameAutocompleteChange,
  }: {
    handleTemplateNameAutocompleteChange: (name: string) => void
  }) => (
    <button
      type="button"
      data-testid="mock-template-autocomplete"
      onClick={() => handleTemplateNameAutocompleteChange(MOCK_TEMPLATE_NAME)}
    >
      Select template
    </button>
  ),
}))

vi.mock('../DelegationCreateEServiceAutocomplete', () => ({
  DelegationCreateEServiceAutocomplete: () => <div data-testid="mock-eservice-autocomplete" />,
}))

vi.mock('../DelegationCreateTenantAutocomplete', () => ({
  DelegationCreateTenantAutocomplete: () => <div data-testid="mock-tenant-autocomplete" />,
}))

const mockCreateFromTemplate = vi.fn()

beforeEach(() => {
  mockUseJwt()

  vi.spyOn(DelegationModule.DelegationMutations, 'useCreateProducerDelegation').mockReturnValue({
    mutate: vi.fn(),
  } as never)

  vi.spyOn(DelegationModule.DelegationMutations, 'useCreateConsumerDelegation').mockReturnValue({
    mutate: vi.fn(),
  } as never)

  vi.spyOn(
    DelegationModule.DelegationMutations,
    'useCreateProducerDelegationAndEservice'
  ).mockReturnValue({ mutate: vi.fn() } as never)

  vi.spyOn(
    DelegationModule.DelegationMutations,
    'useCreateProducerDelegationAndEserviceFromTemplate'
  ).mockReturnValue({ mutate: mockCreateFromTemplate } as never)
})

afterEach(() => {
  vi.restoreAllMocks()
})

vi.mock('@/api/eserviceTemplate/eserviceTemplate.mutations', () => ({
  DUPLICATE_ESERVICENAME_ERROR_CODE: '001-007',
}))

describe('DelegationCreateForm - instanceLabel', () => {
  it('shows InstanceLabelSection when template is selected', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <DelegationCreateForm delegationKind="DELEGATED_PRODUCER" setActiveStep={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    await toggleTemplateFlow(user)

    expect(screen.getByText('create.step1.instanceLabelField.title')).toBeInTheDocument()
  })

  it('passes instanceLabel to the mutation when submitting from template', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <DelegationCreateForm delegationKind="DELEGATED_PRODUCER" setActiveStep={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    await toggleTemplateFlow(user)

    // Type instanceLabel
    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.type(instanceLabelInput, 'Patente')

    // Submit form
    await user.click(screen.getByRole('button', { name: /submitBtn/i }))

    // Confirm dialog: check checkbox, then proceed
    const checkbox = screen.getByRole('checkbox', { name: /checkboxLabel/i })
    await user.click(checkbox)
    await user.click(screen.getByRole('button', { name: /proceedLabel/i }))

    await waitFor(() => {
      expect(mockCreateFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ instanceLabel: 'Patente' }),
        expect.anything()
      )
    })
  })

  it('passes undefined instanceLabel when the field is empty', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <DelegationCreateForm delegationKind="DELEGATED_PRODUCER" setActiveStep={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    await toggleTemplateFlow(user)

    // Submit without typing instanceLabel
    await user.click(screen.getByRole('button', { name: /submitBtn/i }))

    const checkbox = screen.getByRole('checkbox', { name: /checkboxLabel/i })
    await user.click(checkbox)
    await user.click(screen.getByRole('button', { name: /proceedLabel/i }))

    await waitFor(() => {
      expect(mockCreateFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ instanceLabel: undefined }),
        expect.anything()
      )
    })
  })

  it('hides InstanceLabelSection when "create eservice" toggle is turned off', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <DelegationCreateForm delegationKind="DELEGATED_PRODUCER" setActiveStep={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    await toggleTemplateFlow(user)
    expect(screen.getByText('create.step1.instanceLabelField.title')).toBeInTheDocument()

    // Turn off "create eservice" toggle
    await user.click(
      screen.getByRole('checkbox', {
        name: /delegateField.provider.switch$/i,
      })
    )

    expect(screen.queryByText('create.step1.instanceLabelField.title')).not.toBeInTheDocument()
  })

  it('shows duplicateName error when template mutation fails with non-empty instanceLabel', async () => {
    mockCreateFromTemplate.mockImplementation(
      (_params: unknown, { onError }: { onError: (error: unknown) => void }) => {
        onError(
          new AxiosError('test', undefined, undefined, undefined, {
            status: 409,
            statusText: 'Conflict',
            data: { errors: [{ code: '001-007' }] },
            headers: {},
            config: {} as never,
          })
        )
      }
    )

    const user = userEvent.setup()

    renderWithApplicationContext(
      <DelegationCreateForm delegationKind="DELEGATED_PRODUCER" setActiveStep={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    await toggleTemplateFlow(user)

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.type(instanceLabelInput, 'Patente')

    await user.click(screen.getByRole('button', { name: /submitBtn/i }))
    const checkbox = screen.getByRole('checkbox', { name: /checkboxLabel/i })
    await user.click(checkbox)
    await user.click(screen.getByRole('button', { name: /proceedLabel/i }))

    await waitFor(() => {
      expect(
        screen.getByText('delegations.create.eserviceField.validation.duplicateName')
      ).toBeInTheDocument()
    })
  })

  it('shows emptyNotAvailable error when template mutation fails with empty instanceLabel', async () => {
    mockCreateFromTemplate.mockImplementation(
      (_params: unknown, { onError }: { onError: (error: unknown) => void }) => {
        onError(
          new AxiosError('test', undefined, undefined, undefined, {
            status: 409,
            statusText: 'Conflict',
            data: { errors: [{ code: '001-007' }] },
            headers: {},
            config: {} as never,
          })
        )
      }
    )

    const user = userEvent.setup()

    renderWithApplicationContext(
      <DelegationCreateForm delegationKind="DELEGATED_PRODUCER" setActiveStep={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    await toggleTemplateFlow(user)

    // Submit without typing instanceLabel
    await user.click(screen.getByRole('button', { name: /submitBtn/i }))
    const checkbox = screen.getByRole('checkbox', { name: /checkboxLabel/i })
    await user.click(checkbox)
    await user.click(screen.getByRole('button', { name: /proceedLabel/i }))

    await waitFor(() => {
      expect(
        screen.getByText('delegations.create.eserviceField.validation.emptyNotAvailable')
      ).toBeInTheDocument()
    })
  })

  it('does not show InstanceLabelSection when no template is selected', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <DelegationCreateForm delegationKind="DELEGATED_PRODUCER" setActiveStep={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    // Toggle "create eservice" switch
    await user.click(
      screen.getByRole('checkbox', {
        name: /delegateField.provider.switch$/i,
      })
    )

    // Toggle "from template" switch but don't select a template
    await user.click(
      screen.getByRole('checkbox', {
        name: /switchEserviceFromTemplate/i,
      })
    )

    expect(screen.queryByText('create.step1.instanceLabelField.title')).not.toBeInTheDocument()
  })
})

async function toggleTemplateFlow(user: ReturnType<typeof userEvent.setup>) {
  // Toggle "create eservice" switch
  await user.click(
    screen.getByRole('checkbox', {
      name: /delegateField.provider.switch$/i,
    })
  )

  // Toggle "from template" switch
  await user.click(
    screen.getByRole('checkbox', {
      name: /switchEserviceFromTemplate/i,
    })
  )

  // Select a template (triggers handleTemplateNameAutocompleteChange)
  await user.click(screen.getByTestId('mock-template-autocomplete'))
}
