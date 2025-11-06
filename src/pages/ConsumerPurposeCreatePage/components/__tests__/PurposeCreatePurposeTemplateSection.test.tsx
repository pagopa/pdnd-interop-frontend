import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form'
import { vi } from 'vitest'
import React from 'react'
import { PurposeCreatePurposeTemplateSection } from '../PurposeCreatePurposeTemplateSection/PurposeCreatePurposeTemplateSection'
import userEvent from '@testing-library/user-event'

vi.mock('@/components/shared/react-hook-form-inputs', () => ({
  RHFSwitch: ({ name, label }: { name: string; label: string }) => {
    const { control, setValue } = useFormContext()
    const value = useWatch({ control, name, defaultValue: false })
    return (
      <label>
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={() => setValue(name, !value)}
        />{' '}
        {label}
      </label>
    )
  },
}))

vi.mock('../PurposeCreatePurposeTemplateSection/PurposeCreatePurposeTemplateAutocomplete', () => ({
  PurposeCreatePurposeTemplateAutocomplete: (props: { eserviceId: string }) => (
    <div>Autocomplete {props.eserviceId}</div>
  ),
}))

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({ defaultValues: { usePurposeTemplate: false } })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('PurposeCreatePurposeTemplateSection', () => {
  it('renders the top-level switch', () => {
    render(
      <BrowserRouter>
        <FormWrapper>
          <PurposeCreatePurposeTemplateSection eserviceId="123" />
        </FormWrapper>
      </BrowserRouter>
    )

    expect(screen.getByLabelText('usePurposeTemplateSwitch.label')).toBeInTheDocument()
  })

  it('renders inner section when usePurposeTemplate is checked', async () => {
    render(
      <BrowserRouter>
        <FormWrapper>
          <PurposeCreatePurposeTemplateSection eserviceId="123" />
        </FormWrapper>
      </BrowserRouter>
    )

    const outerSwitch = screen.getByLabelText('usePurposeTemplateSwitch.label')
    await userEvent.click(outerSwitch)

    const innerSwitch = await screen.findByLabelText(
      /usePurposeTemplateSwitch\.selectPurposeTemplate\.showOnlyLinkedPurposeTemplates/i
    )
    expect(innerSwitch).toBeInTheDocument()
  })
})
