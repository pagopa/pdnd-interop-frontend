import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import {
  EServiceTemplateCreateStepTechnicalSpecs,
  EServiceTemplateCreateStepTechnicalSpecsSkeleton,
} from '../EServiceTemplateCreateStepTechnicalSpecs'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceTemplateVersionDetailsAsync,
  mockUseEServiceTemplateCreateContext,
} from '@/../__mocks__/data/eserviceTemplate.mocks'

const mockUpdateVersionDraft = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    useUpdateVersionDraft: () => ({ mutate: mockUpdateVersionDraft }),
    useDeleteVersionDraftDocument: () => ({ mutate: vi.fn() }),
    usePostVersionDraftDocument: () => ({ mutate: vi.fn() }),
  },
}))

vi.mock('@/api/eserviceTemplate/eserviceTemplate.downloads', () => ({
  EServiceTemplateDownloads: {
    useDownloadVersionDocument: () => vi.fn(),
  },
}))

const stepProps = { back: vi.fn(), forward: vi.fn(), activeStep: 2 }

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceTemplateCreateStepTechnicalSpecs', () => {
  it('renders the Interface section title', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('create.step3.technicalSpecs.interface.title')).toBeInTheDocument()
  })

  it('renders the info alert', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('create.step3.technicalSpecs.interface.alert')).toBeInTheDocument()
  })

  it('renders the Voucher section title', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('create.step3.technicalSpecs.voucher.title')).toBeInTheDocument()
  })

  it('renders the voucherLifespan field', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(
      screen.getByLabelText(/create.step3.technicalSpecs.voucher.voucherLifespanField.label/)
    ).toBeInTheDocument()
  })

  it('renders the forward button with save label and submit type', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    const forwardButton = screen.getByRole('button', { name: /create.forwardWithSaveBtn/ })
    expect(forwardButton).toBeInTheDocument()
    expect(forwardButton).toHaveAttribute('type', 'submit')
  })

  it('renders the back button', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByRole('button', { name: /create.backWithoutSaveBtn/ })).toBeInTheDocument()
  })

  it('renders REST description by default', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(
      screen.getByText('create.step3.technicalSpecs.interface.description.rest')
    ).toBeInTheDocument()
  })

  it('renders SOAP description when technology is SOAP', () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: {
        eserviceTemplate: {
          id: 'template-id',
          technology: 'SOAP',
          creator: { id: 'org-id', name: 'Org' },
          name: 'Template',
          intendedTarget: 'Target',
          description: 'Description',
          versions: [],
          riskAnalysis: [],
          mode: 'DELIVER',
        },
        id: 'version-id',
        version: 1,
        description: '',
        state: 'DRAFT',
        voucherLifespan: 60,
        dailyCallsPerConsumer: 1,
        dailyCallsTotal: 2,
        agreementApprovalPolicy: 'AUTOMATIC',
        attributes: { certified: [], declared: [], verified: [] },
        docs: [],
      },
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(
      screen.getByText('create.step3.technicalSpecs.interface.description.soap')
    ).toBeInTheDocument()
  })

  it('does not render the Documentation section', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.queryByText('create.step4.documentation.title')).not.toBeInTheDocument()
  })

  it('renders the async exchange section when the template is async', () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetailsAsync(),
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('editableInfoAlert')).toBeInTheDocument()
    expect(screen.queryByText('callbackInterface.readOnlyLabel')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('Specifica callback')).toBeInTheDocument()
    expect(screen.getByText('configSubsection.title')).toBeInTheDocument()
    expect(screen.getByLabelText(/responseTimeField.label/)).toHaveValue(1000)
    expect(screen.getByLabelText(/resourceAvailableTimeField.label/)).toHaveValue(2000)
    expect(screen.getByLabelText(/maxResultSetField.label/)).toHaveValue(100)
    expect(screen.getByRole('checkbox', { name: /confirmationField.label/ })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /bulkField.label/ })).toBeChecked()
  })

  it('does not render the async exchange section when the template is synchronous', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })

    expect(screen.queryByText('title')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/responseTimeField.label/)).not.toBeInTheDocument()
  })

  it('includes default asyncExchangeProperties in payload when async template properties are missing', async () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetailsAsync({
        asyncExchangeProperties: undefined,
      }),
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })

    await userEvent.click(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ }))

    expect(mockUpdateVersionDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        asyncExchangeProperties: {
          responseTime: 60,
          resourceAvailableTime: 60,
          maxResultSet: 1,
          confirmation: false,
          bulk: true,
        },
      }),
      expect.any(Object)
    )
  })

  it('includes form asyncExchangeProperties in payload when the async template is submitted', async () => {
    const user = userEvent.setup()
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetailsAsync(),
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })

    await user.clear(screen.getByLabelText(/responseTimeField.label/))
    await user.type(screen.getByLabelText(/responseTimeField.label/), '123')
    await user.clear(screen.getByLabelText(/resourceAvailableTimeField.label/))
    await user.type(screen.getByLabelText(/resourceAvailableTimeField.label/), '456')
    await user.clear(screen.getByLabelText(/maxResultSetField.label/))
    await user.type(screen.getByLabelText(/maxResultSetField.label/), '7')
    await user.click(screen.getByRole('checkbox', { name: /confirmationField.label/ }))
    await user.click(screen.getByRole('checkbox', { name: /bulkField.label/ }))

    await user.click(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ }))

    expect(mockUpdateVersionDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        asyncExchangeProperties: {
          responseTime: 123,
          resourceAvailableTime: 456,
          maxResultSet: 7,
          confirmation: false,
          bulk: false,
        },
      }),
      expect.any(Object)
    )
  })

  it('forces bulk to false when the async template technology is SOAP', async () => {
    const user = userEvent.setup()
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetailsAsync({
        eserviceTemplate: {
          ...createMockEServiceTemplateVersionDetailsAsync().eserviceTemplate,
          technology: 'SOAP',
        },
        asyncExchangeProperties: {
          responseTime: 1,
          resourceAvailableTime: 1,
          maxResultSet: 1,
          confirmation: false,
          bulk: true,
        },
      }),
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepTechnicalSpecs {...stepProps} />, {
      withReactQueryContext: true,
    })

    const bulkCheckbox = screen.getByRole('checkbox', { name: /bulkField.label/ })
    expect(bulkCheckbox).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /create.forwardWithSaveBtn/ }))

    expect(mockUpdateVersionDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        asyncExchangeProperties: expect.objectContaining({ bulk: false }),
      }),
      expect.any(Object)
    )
  })
})

describe('EServiceTemplateCreateStepTechnicalSpecsSkeleton', () => {
  it('correctly renders the skeleton', () => {
    render(<EServiceTemplateCreateStepTechnicalSpecsSkeleton />)
  })
})
