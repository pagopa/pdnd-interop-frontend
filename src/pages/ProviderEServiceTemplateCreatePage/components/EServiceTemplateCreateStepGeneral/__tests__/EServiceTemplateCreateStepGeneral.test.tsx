import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
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

const createDraftMutateMock = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    useCreateDraft: () => ({ mutate: createDraftMutateMock }),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
  createDraftMutateMock.mockReset()
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

  it('on submit in edit flow forwards without creating a draft', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()

    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
      areEServiceTemplateGeneralInfoEditable: false,
      forward,
    })

    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ }))

    expect(forward).toHaveBeenCalledTimes(1)
    expect(createDraftMutateMock).not.toHaveBeenCalled()
  })

  it('on submit in create flow creates draft and forwards only after success', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()

    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: undefined,
      forward,
    })

    renderWithApplicationContext(<EServiceTemplateCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.type(
      screen.getByLabelText(/create.step1.eserviceTemplateNameField.label/),
      'Valid template name'
    )
    await user.type(
      screen.getByLabelText(/create.step1.intendedTargetField.label/),
      'Valid intended target value'
    )
    await user.type(
      screen.getByLabelText(/create.step1.eserviceDescriptionField.label/),
      'Valid template description'
    )
    await user.click(screen.getByLabelText('personalDataField.DELIVER.options.false'))

    expect(screen.getByLabelText(/create.step1.eserviceTemplateNameField.label/)).toHaveValue(
      'Valid template name'
    )
    expect(screen.getByLabelText(/create.step1.intendedTargetField.label/)).toHaveValue(
      'Valid intended target value'
    )
    expect(screen.getByLabelText(/create.step1.eserviceDescriptionField.label/)).toHaveValue(
      'Valid template description'
    )

    await user.click(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ }))

    await waitFor(() => {
      expect(createDraftMutateMock).toHaveBeenCalledTimes(1)
    })
    expect(forward).not.toHaveBeenCalled()

    const createDraftOptions = createDraftMutateMock.mock.calls[0][1]
    createDraftOptions.onSuccess({ id: 'template-id', versionId: 'version-id' })

    expect(forward).toHaveBeenCalledTimes(1)
  })
})

describe('EServiceTemplateCreateStepGeneralSkeleton', () => {
  it('correctly renders the skeleton', () => {
    render(<EServiceTemplateCreateStepGeneralSkeleton />)
  })
})
