import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext, ReactHookFormWrapper } from '@/utils/testing.utils'
import { DelegationCreateFormCreateEservice } from '../DelegationCreateFormCreateEservice'
import { vi } from 'vitest'

vi.mock('../DelegationCreateEServiceFromTemplateAutocomplete', () => ({
  DelegationCreateEServiceFromTemplateAutocomplete: () => (
    <div data-testid="template-autocomplete" />
  ),
}))

const defaultValues = {
  eserviceId: '',
  eserviceName: '',
  eserviceDescription: '',
  delegateId: '',
  isEserviceToBeCreated: false,
  isEserviceFromTemplate: false,
  instanceLabel: '',
}

describe('DelegationCreateFormCreateEservice', () => {
  it('should show name and description fields when isEserviceFromTemplate is off', () => {
    renderWithApplicationContext(
      <ReactHookFormWrapper defaultValues={defaultValues}>
        <DelegationCreateFormCreateEservice
          delegationKind="DELEGATED_PRODUCER"
          handleTemplateNameAutocompleteChange={vi.fn()}
        />
      </ReactHookFormWrapper>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(screen.getByRole('textbox', { name: /eserviceField.label/i })).toBeInTheDocument()
    expect(screen.queryByTestId('template-autocomplete')).not.toBeInTheDocument()
  })

  it('should show template autocomplete when isEserviceFromTemplate is toggled on', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <ReactHookFormWrapper defaultValues={defaultValues}>
        <DelegationCreateFormCreateEservice
          delegationKind="DELEGATED_PRODUCER"
          handleTemplateNameAutocompleteChange={vi.fn()}
        />
      </ReactHookFormWrapper>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    await user.click(
      screen.getByRole('checkbox', {
        name: /delegateField.provider.switchEserviceFromTemplate/i,
      })
    )

    expect(screen.getByTestId('template-autocomplete')).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /eserviceField.label/i })).not.toBeInTheDocument()
  })

  it('should not render the InstanceLabelSection inside this component', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <ReactHookFormWrapper defaultValues={defaultValues}>
        <DelegationCreateFormCreateEservice
          delegationKind="DELEGATED_PRODUCER"
          handleTemplateNameAutocompleteChange={vi.fn()}
        />
      </ReactHookFormWrapper>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    await user.click(
      screen.getByRole('checkbox', {
        name: /delegateField.provider.switchEserviceFromTemplate/i,
      })
    )

    expect(screen.queryByText('create.step1.instanceLabelField.title')).not.toBeInTheDocument()
  })
})
