import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { AxiosError } from 'axios'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { DelegationCreateForm } from '../DelegationCreateForm'
import * as DelegationModule from '@/api/delegation'

vi.mock('../DelegationCreateEServiceFromTemplateAutocomplete', () => ({
  DelegationCreateEServiceFromTemplateAutocomplete: () => (
    <div data-testid="mock-template-autocomplete" />
  ),
}))

vi.mock('../DelegationCreateEServiceAutocomplete', () => ({
  DelegationCreateEServiceAutocomplete: () => <div data-testid="mock-eservice-autocomplete" />,
}))

vi.mock('../DelegationCreateTenantAutocomplete', () => ({
  DelegationCreateTenantAutocomplete: () => <div data-testid="mock-tenant-autocomplete" />,
}))

vi.mock('@/api/eserviceTemplate/eserviceTemplate.mutations', () => ({
  DUPLICATE_INSTANCE_LABEL_ERROR_CODE: '001-007',
}))

let mockCreateAndEservice: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockUseJwt()
  mockCreateAndEservice = vi.fn()

  vi.spyOn(DelegationModule.DelegationMutations, 'useCreateProducerDelegation').mockReturnValue({
    mutate: vi.fn(),
  } as never)

  vi.spyOn(DelegationModule.DelegationMutations, 'useCreateConsumerDelegation').mockReturnValue({
    mutate: vi.fn(),
  } as never)

  vi.spyOn(
    DelegationModule.DelegationMutations,
    'useCreateProducerDelegationAndEservice'
  ).mockReturnValue({ mutate: mockCreateAndEservice } as never)

  vi.spyOn(
    DelegationModule.DelegationMutations,
    'useCreateProducerDelegationAndEserviceFromTemplate'
  ).mockReturnValue({ mutate: vi.fn() } as never)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('DelegationCreateForm - duplicate eservice name', () => {
  it('shows inline error on eserviceName field when mutation fails with 001-007', async () => {
    mockCreateAndEservice.mockImplementation(
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

    // Toggle "create eservice" switch
    await user.click(
      screen.getByRole('checkbox', {
        name: /delegateField.provider.switch$/i,
      })
    )

    // Fill eservice name (min 5 chars)
    const nameInput = screen.getByRole('textbox', { name: /eserviceField.label/i })
    await user.type(nameInput, 'Test Eservice Name')

    // Fill description (min 10 chars)
    const descriptionInput = screen.getByRole('textbox', {
      name: /eserviceField.descriptionLabel/i,
    })
    await user.type(descriptionInput, 'A description for the eservice')

    // Submit form
    await user.click(screen.getByRole('button', { name: /submitBtn/i }))

    // Confirm dialog
    const checkbox = screen.getByRole('checkbox', { name: /checkboxLabel/i })
    await user.click(checkbox)
    await user.click(screen.getByRole('button', { name: /proceedLabel/i }))

    await waitFor(() => {
      expect(mockCreateAndEservice).toHaveBeenCalled()
    })

    // The inline error message should be shown
    await waitFor(() => {
      expect(
        screen.getByText('delegations.create.eserviceField.validation.duplicateName')
      ).toBeInTheDocument()
    })
  })

  it('does not show inline error for non-duplicate errors', async () => {
    mockCreateAndEservice.mockImplementation(
      (_params: unknown, { onError }: { onError: (error: unknown) => void }) => {
        onError(new Error('generic error'))
      }
    )

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

    // Fill eservice name
    const nameInput = screen.getByRole('textbox', { name: /eserviceField.label/i })
    await user.type(nameInput, 'Test Eservice Name')

    // Fill description
    const descriptionInput = screen.getByRole('textbox', {
      name: /eserviceField.descriptionLabel/i,
    })
    await user.type(descriptionInput, 'A description for the eservice')

    // Submit form
    await user.click(screen.getByRole('button', { name: /submitBtn/i }))

    // Confirm dialog
    const checkbox = screen.getByRole('checkbox', { name: /checkboxLabel/i })
    await user.click(checkbox)
    await user.click(screen.getByRole('button', { name: /proceedLabel/i }))

    await waitFor(() => {
      expect(mockCreateAndEservice).toHaveBeenCalled()
    })

    // The inline error message should NOT be shown
    expect(
      screen.queryByText('delegations.create.eserviceField.validation.duplicateName')
    ).not.toBeInTheDocument()
  })
})
