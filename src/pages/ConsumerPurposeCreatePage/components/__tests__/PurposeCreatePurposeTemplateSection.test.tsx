import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form'
import { vi } from 'vitest'
import React from 'react'
import { PurposeCreatePurposeTemplateSection } from '../PurposeCreatePurposeTemplateSection/PurposeCreatePurposeTemplateSection'
import userEvent from '@testing-library/user-event'
import type { CatalogDescriptorEService } from '@/api/api.generatedTypes'

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

const selectedEserviceMock: CatalogDescriptorEService = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Mock eService',
  producer: {
    id: 'org-123',
    name: 'Mock Organization',
  },
  description: 'This is a mock eService used for testing.',
  technology: 'REST', // example enum value
  mode: 'DELIVER', // example enum value
  riskAnalysis: [
    {
      id: 'ra-001',
      name: 'Risk Analysis 1',
      createdAt: '2023-01-01T00:00:00Z',
      riskAnalysisForm: {
        version: '3.0',
        answers: {
          question1: ['answer1'],
        },
      },
    },
  ],
  descriptors: [
    {
      id: 'desc-001',
      version: '1.0',
      state: 'PUBLISHED',
      audience: ['PUBLIC'],
    },
  ],
  isMine: true,
  hasCertifiedAttributes: true,
  isSubscribed: true,
  agreements: [],
  activeDescriptor: {
    id: 'desc-001',
    version: '1.0',
    state: 'PUBLISHED',
    audience: ['PUBLIC'],
  },
  personalData: false,
}

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({ defaultValues: { usePurposeTemplate: false } })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('PurposeCreatePurposeTemplateSection', () => {
  it('renders the top-level switch', () => {
    render(
      <BrowserRouter>
        <FormWrapper>
          <PurposeCreatePurposeTemplateSection selectedEService={selectedEserviceMock} />
        </FormWrapper>
      </BrowserRouter>
    )

    expect(screen.getByLabelText('usePurposeTemplateSwitch.label')).toBeInTheDocument()
  })

  it('renders inner section when usePurposeTemplate is checked', async () => {
    render(
      <BrowserRouter>
        <FormWrapper>
          <PurposeCreatePurposeTemplateSection selectedEService={selectedEserviceMock} />
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
