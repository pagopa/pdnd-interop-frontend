import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import {
  EServiceTemplateCreateStepDocuments,
  EServiceTemplateCreateStepDocumentsSkeleton,
} from '../EServiceTemplateCreateStepDocuments'
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

describe('EServiceTemplateCreateStepDocuments', () => {
  it('renders the Interface section title', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('create.stepTechnicalSpecs.interface.title')).toBeInTheDocument()
  })

  it('renders the info alert', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('create.stepTechnicalSpecs.interface.alert')).toBeInTheDocument()
  })

  it('renders the Voucher section title', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('create.stepTechnicalSpecs.voucher.title')).toBeInTheDocument()
  })

  it('renders the voucherLifespan field', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(
      screen.getByLabelText(/create.stepTechnicalSpecs.voucher.voucherLifespanField.label/)
    ).toBeInTheDocument()
  })

  it('renders the forward button with save label and submit type', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    const forwardButton = screen.getByRole('button', { name: /create.forwardWithSaveBtn/ })
    expect(forwardButton).toBeInTheDocument()
    expect(forwardButton).toHaveAttribute('type', 'submit')
  })

  it('renders the back button', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByRole('button', { name: /create.backWithoutSaveBtn/ })).toBeInTheDocument()
  })

  it('renders REST description by default', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(
      screen.getByText('create.stepTechnicalSpecs.interface.description.rest')
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
        dailyCallsTotal: 1,
        agreementApprovalPolicy: 'AUTOMATIC',
        attributes: { certified: [], declared: [], verified: [] },
        docs: [],
        isAlreadyInstantiated: false,
      },
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(
      screen.getByText('create.stepTechnicalSpecs.interface.description.soap')
    ).toBeInTheDocument()
  })

  it('does not render the Documentation section', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepDocuments {...stepProps} />, {
      withReactQueryContext: true,
    })
    expect(screen.queryByText('create.step4.documentation.title')).not.toBeInTheDocument()
  })
})

describe('EServiceTemplateCreateStepDocumentsSkeleton', () => {
  it('correctly renders the skeleton', () => {
    render(<EServiceTemplateCreateStepDocumentsSkeleton />)
  })
})
