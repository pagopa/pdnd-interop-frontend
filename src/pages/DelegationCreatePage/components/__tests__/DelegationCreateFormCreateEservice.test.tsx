import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { DelegationCreateFormCreateEservice } from '../DelegationCreateFormCreateEservice'
import type { DelegationCreateFormValues } from '../DelegationCreateForm'
import { vi } from 'vitest'

vi.mock('../DelegationCreateEServiceFromTemplateAutocomplete', () => ({
  DelegationCreateEServiceFromTemplateAutocomplete: () => (
    <div data-testid="template-autocomplete" />
  ),
}))

const Wrapper: React.FC<{
  defaultValues?: Partial<DelegationCreateFormValues>
  children: React.ReactNode
}> = ({ defaultValues, children }) => {
  const methods = useForm<DelegationCreateFormValues>({
    defaultValues: {
      eserviceId: '',
      eserviceName: '',
      eserviceDescription: '',
      delegateId: '',
      isEserviceToBeCreated: false,
      isEserviceFromTemplate: false,
      instanceLabel: '',
      ...defaultValues,
    },
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('DelegationCreateFormCreateEservice', () => {
  it('should show name and description fields when isEserviceFromTemplate is off', () => {
    renderWithApplicationContext(
      <Wrapper>
        <DelegationCreateFormCreateEservice
          delegationKind="DELEGATED_PRODUCER"
          handleTemplateNameAutocompleteChange={vi.fn()}
        />
      </Wrapper>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(screen.getByRole('textbox', { name: /eserviceField.label/i })).toBeInTheDocument()
    expect(screen.queryByTestId('template-autocomplete')).not.toBeInTheDocument()
  })

  it('should show template autocomplete when isEserviceFromTemplate is toggled on', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <Wrapper>
        <DelegationCreateFormCreateEservice
          delegationKind="DELEGATED_PRODUCER"
          handleTemplateNameAutocompleteChange={vi.fn()}
        />
      </Wrapper>,
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
      <Wrapper>
        <DelegationCreateFormCreateEservice
          delegationKind="DELEGATED_PRODUCER"
          handleTemplateNameAutocompleteChange={vi.fn()}
        />
      </Wrapper>,
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
