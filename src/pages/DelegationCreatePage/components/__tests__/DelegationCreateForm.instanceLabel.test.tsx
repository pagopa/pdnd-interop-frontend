import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { DelegationCreateForm } from '../DelegationCreateForm'
import * as DelegationModule from '@/api/delegation'
import type { UserEvent } from '@testing-library/user-event'

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

async function toggleTemplateFlow(user: UserEvent) {
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
