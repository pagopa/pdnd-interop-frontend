import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import {
  EServiceTemplateCreateStepGeneral,
  EServiceTemplateCreateStepGeneralSkeleton,
} from '../EServiceTemplateCreateStepGeneral'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as ContextModule from '../../ProviderEServiceTemplateContext'

function mockUseEServiceTemplateCreateContext(
  overwrites: Partial<ReturnType<typeof ContextModule.useEServiceTemplateCreateContext>> = {}
) {
  vi.spyOn(ContextModule, 'useEServiceTemplateCreateContext').mockReturnValue({
    eserviceTemplateVersion: undefined,
    areEServiceTemplateGeneralInfoEditable: true,
    forward: vi.fn(),
    back: vi.fn(),
    eserviceTemplateMode: 'DELIVER',
    onEserviceTemplateModeChange: vi.fn(),
    ...overwrites,
  })
}

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
})

describe('EServiceTemplateCreateStepGeneralSkeleton', () => {
  it('correctly renders the skeleton', () => {
    render(<EServiceTemplateCreateStepGeneralSkeleton />)
  })
})
