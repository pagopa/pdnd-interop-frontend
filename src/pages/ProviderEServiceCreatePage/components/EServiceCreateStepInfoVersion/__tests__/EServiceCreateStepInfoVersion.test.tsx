import {
  createMockEServiceDescriptorProviderWithTemplateRef,
  createMockEServiceDescriptorProvider,
} from '@/../__mocks__/data/eservice.mocks'
import { mockUseEServiceCreateContext, renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { EServiceCreateStepInfoVersion } from '../EServiceCreateStepInfoVersion'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'

vi.mock('@/components/shared/react-hook-form-inputs', async () => {
  const actual = await vi.importActual<typeof import('@/components/shared/react-hook-form-inputs')>(
    '@/components/shared/react-hook-form-inputs'
  )
  return {
    ...actual,
    RHFTextField: () => {
      const { register } = useFormContext()
      return (
        <div>
          <label>step4.descriptionSection.field.label</label>
          <input data-testid="description" {...register('description')} />
        </div>
      )
    },
    RHFSwitch: () => {
      const { setValue } = useFormContext()
      return (
        <div>
          <label>step4.requestManagementSection.field.label</label>
          <button
            data-testid="agreement-approval-policy"
            onClick={() => {
              setValue('agreementApprovalPolicy', false)
            }}
          >
            Switch
          </button>
        </div>
      )
    },
  }
})

vi.mock('../components/UploadDocumentsSection', () => ({
  UploadDocumentsSection: () => {
    return <div>UploadDocumentsSection</div>
  },
}))

const updateVersionDraft = vi.fn()
const updateInstanceVersionDraft = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateVersionDraft: () => ({ mutate: updateVersionDraft }),
    useUpdateInstanceVersionDraft: () => ({ mutate: updateInstanceVersionDraft }),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceCreateStepInfoVersion', () => {
  it('should render three sections', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('step4.descriptionSection.title')).toBeInTheDocument()
    expect(screen.getByText('step4.documentationSection.title')).toBeInTheDocument()
    expect(screen.getByText('step4.requestManagementSection.title')).toBeInTheDocument()
  })

  it('should render description section input field', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getAllByText('step4.descriptionSection.field.label').length).toBeGreaterThan(0)
  })

  it('should render read-only description when creating instance', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('step4.descriptionSection.readOnlyLabel')).toBeInTheDocument()
  })

  it('should render UploadDocumentsSection', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('UploadDocumentsSection')).toBeInTheDocument()
  })

  it('should render request management switch', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(
      screen.getAllByText('step4.requestManagementSection.field.label').length
    ).toBeGreaterThan(0)
  })

  it('should render step actions', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('backWithoutSaveBtn')).toBeInTheDocument()
    expect(screen.getByText('goToSummary')).toBeInTheDocument()
  })

  it('should not cause any mutation on form submit', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('goToSummary'))
    expect(updateVersionDraft).not.toHaveBeenCalled()
    expect(updateInstanceVersionDraft).not.toHaveBeenCalled()
  })

  it('should call updateVersionDraft on form submit', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByTestId('agreement-approval-policy'))
    await userEvent.click(screen.getByText('goToSummary'))
    expect(updateVersionDraft).toHaveBeenCalled()
    expect(updateInstanceVersionDraft).not.toHaveBeenCalled()
  })

  it('should call updateInstanceVersionDraft on form submit', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByTestId('agreement-approval-policy'))
    await userEvent.click(screen.getByText('goToSummary'))
    expect(updateVersionDraft).not.toHaveBeenCalled()
    expect(updateInstanceVersionDraft).toHaveBeenCalled()
  })
})
