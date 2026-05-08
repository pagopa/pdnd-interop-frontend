import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import {
  EServiceTemplateCreateStepGeneral,
  EServiceTemplateCreateStepGeneralSkeleton,
} from '../EServiceTemplateCreateStepGeneral'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { mockUseEServiceTemplateCreateContext } from '@/../__mocks__/data/eserviceTemplate.mocks'
import userEvent from '@testing-library/user-event'

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    useUpdateDraft: () => ({ mutate: vi.fn() }),
    useCreateDraft: () => ({ mutate: vi.fn() }),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceTemplateCreateStepGeneral', () => {
  it('renders the three section titles', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('create.step1.templateInfoTitle')).toBeInTheDocument()
    expect(screen.getByText('create.step1.instanceDetailsTitle')).toBeInTheDocument()
    expect(screen.getByText('create.step1.signalHubTitle')).toBeInTheDocument()
  })

  it('renders the template name field', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(
      screen.getByLabelText(/create.step1.eserviceTemplateNameField.label/)
    ).toBeInTheDocument()
  })

  it('renders the intended target field', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByLabelText(/create.step1.intendedTargetField.label/)).toBeInTheDocument()
  })

  it('renders the description field', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByLabelText(/create.step1.eserviceDescriptionField.label/)).toBeInTheDocument()
  })

  it('renders technology radio group with REST and SOAP options', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByLabelText('REST')).toBeInTheDocument()
    expect(screen.getByLabelText('SOAP')).toBeInTheDocument()
  })

  it('renders mode radio group with Eroga and Riceve options', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(
      screen.getByLabelText('create.step1.eserviceTemplateModeField.options.DELIVER')
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText('create.step1.eserviceTemplateModeField.options.RECEIVE')
    ).toBeInTheDocument()
  })

  it('renders the Signal Hub switch', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders the submit button with save label when editable', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ })).toBeInTheDocument()
  })

  it('renders the forward button with save also when not editable', () => {
    mockUseEServiceTemplateCreateContext({
      areEServiceTemplateGeneralInfoEditable: false,
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ })).toBeInTheDocument()
  })

  it('maxLength of 400 characters on description field', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const descriptionInput = screen.getByLabelText(/create.step1.eserviceDescriptionField.label/)

    expect(descriptionInput).toHaveAttribute('maxLength', '400')
  })

  it('rejects description longer than 400 characters', async () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const user = userEvent.setup()

    const descriptionInput = screen.getByLabelText(
      /create.step1.eserviceDescriptionField.label/
    ) as HTMLTextAreaElement

    // Try to enter text longer than 400 characters
    const longText = 'a'.repeat(401)
    await user.clear(descriptionInput)
    await user.type(descriptionInput, longText)

    // The actual input value should be capped at 400 due to maxLength attribute
    expect(descriptionInput.value).toHaveLength(400)
  })
})

describe('EServiceTemplateCreateStepGeneralSkeleton', () => {
  it('correctly renders the skeleton', () => {
    render(<EServiceTemplateCreateStepGeneralSkeleton />)
  })
})
