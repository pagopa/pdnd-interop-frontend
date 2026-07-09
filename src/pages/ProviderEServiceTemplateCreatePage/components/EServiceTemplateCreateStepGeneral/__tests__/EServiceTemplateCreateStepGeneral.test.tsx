import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import {
  EServiceTemplateCreateStepGeneral,
  EServiceTemplateCreateStepGeneralSkeleton,
} from '../EServiceTemplateCreateStepGeneral'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceTemplateVersionDetails,
  mockUseEServiceTemplateCreateContext,
} from '@/../__mocks__/data/eserviceTemplate.mocks'

const { updateDraftMock, createDraftMock } = vi.hoisted(() => ({
  updateDraftMock: vi.fn(),
  createDraftMock: vi.fn(),
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    useUpdateDraft: () => ({ mutate: updateDraftMock }),
    useCreateDraft: () => ({ mutate: createDraftMock }),
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
    expect(screen.getByText('title')).toBeInTheDocument()
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

  it('renders async exchange radio group', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('asyncExchangeField.label')).toBeInTheDocument()
    expect(screen.getByLabelText('asyncExchangeField.options.false')).toBeInTheDocument()
    expect(screen.getByLabelText('asyncExchangeField.options.true')).toBeInTheDocument()
  })

  it('forces DELIVER mode when async exchange is selected', async () => {
    const user = userEvent.setup()
    mockUseEServiceTemplateCreateContext({ eserviceTemplateMode: 'RECEIVE' })
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByLabelText('asyncExchangeField.options.true'))

    const deliverRadio = screen.getByRole('radio', {
      name: 'modeField.options.DELIVER',
    })
    const receiveRadio = screen.getByRole('radio', {
      name: 'modeField.options.RECEIVE',
    })

    expect(deliverRadio).toBeChecked()
    expect(deliverRadio).toBeDisabled()
    expect(receiveRadio).toBeDisabled()
  })

  it('renders mode radio group with Eroga and Riceve options', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByLabelText('modeField.options.DELIVER')).toBeInTheDocument()
    expect(screen.getByLabelText('modeField.options.RECEIVE')).toBeInTheDocument()
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

  it('submits without update when existing first draft is unchanged', async () => {
    const user = userEvent.setup()
    const forwardMock = vi.fn()

    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
      forward: forwardMock,
    })

    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ }))

    expect(updateDraftMock).not.toHaveBeenCalled()
    expect(forwardMock).toHaveBeenCalledTimes(1)
  })

  it('updates draft when existing first draft data changes', async () => {
    const user = userEvent.setup()

    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
    })

    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.clear(screen.getByLabelText(/create.step1.eserviceTemplateNameField.label/))
    await user.type(
      screen.getByLabelText(/create.step1.eserviceTemplateNameField.label/),
      'Updated Template Name'
    )
    await user.click(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ }))

    expect(updateDraftMock).toHaveBeenCalledTimes(1)
    expect(updateDraftMock).toHaveBeenCalledWith(
      expect.objectContaining({
        eServiceTemplateId: 'template-id-001',
        name: 'Updated Template Name',
      }),
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
  })
})

describe('EServiceTemplateCreateStepGeneralSkeleton', () => {
  it('correctly renders the skeleton', () => {
    render(<EServiceTemplateCreateStepGeneralSkeleton />)
  })
})
