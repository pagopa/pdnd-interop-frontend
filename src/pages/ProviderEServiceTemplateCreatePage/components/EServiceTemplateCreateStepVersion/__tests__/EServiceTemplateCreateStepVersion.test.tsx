import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import {
  EServiceTemplateCreateStepVersion,
  EServiceTemplateCreateStepVersionSkeleton,
} from '../EServiceTemplateCreateStepVersion'
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

vi.mock('@/router', () => ({
  useNavigate: () => vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

const stepProps = { back: vi.fn(), forward: vi.fn(), activeStep: 3 }

describe('EServiceTemplateCreateStepVersion', () => {
  it('renders the three section titles', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepVersion {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('step4.versionDescriptionTitle')).toBeInTheDocument()
    expect(screen.getByText('step4.documentationSection.title')).toBeInTheDocument()
    expect(screen.getByText('step4.requestManagementSection.title')).toBeInTheDocument()
  })

  it('renders the documentation section description', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepVersion {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('step4.documentationSection.description')).toBeInTheDocument()
  })

  it('renders the description text field', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepVersion {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByLabelText(/step4.versionDescriptionField.label/)).toBeInTheDocument()
  })

  it('renders the agreement approval switch', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepVersion {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders the forward button with goToSummary label and submit type', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepVersion {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    const forwardButton = screen.getByRole('button', { name: /goToSummary/ })
    expect(forwardButton).toBeInTheDocument()
    expect(forwardButton).toHaveAttribute('type', 'submit')
  })

  it('renders the back button', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepVersion {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByRole('button', { name: /backWithoutSaveBtn/ })).toBeInTheDocument()
  })
})

describe('EServiceTemplateCreateStepVersionSkeleton', () => {
  it('correctly renders the skeleton', () => {
    render(<EServiceTemplateCreateStepVersionSkeleton />)
  })
})
