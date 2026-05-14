import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { EServiceCreateStepTechSpec } from '../EServiceCreateStepTechSpec'
import { useFormContext } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import {
  createMockEServiceDescriptorProviderWithTemplateRef,
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderAsync,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'

vi.mock('../../sections/EServiceInterfaceSection', () => ({
  EServiceInterfaceSection: () => {
    return <div>EServiceInterfaceSection</div>
  },
}))

vi.mock('../../sections/EServiceVoucherSection', () => ({
  EServiceVoucherSection: () => {
    const { register } = useFormContext()

    return (
      <div>
        <div>EServiceVoucherSection</div>
        <input data-testid="voucher-lifespan" {...register('voucherLifespan')} />
      </div>
    )
  },
}))

vi.mock('../../sections/EServiceProducerKeychainSection', () => ({
  EServiceProducerKeychainSection: () => <div>EServiceProducerKeychainSection</div>,
}))

const updateVersionDraft = vi.fn()
const updateInstanceVersionDraft = vi.fn()
const addKeychainToEService = vi.fn().mockResolvedValue(undefined)
const removeKeychainFromEService = vi.fn().mockResolvedValue(undefined)

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateVersionDraft: () => ({ mutate: updateVersionDraft }),
    useUpdateInstanceVersionDraft: () => ({ mutate: updateInstanceVersionDraft }),
  },
}))

vi.mock('@/api/keychain', () => ({
  KeychainQueries: {
    getKeychainsList: vi.fn((params: { eserviceId?: string }) => ({
      queryKey: ['KeychainGetList', params],
      queryFn: () =>
        Promise.resolve({
          results: [],
          pagination: { offset: 0, limit: 50, totalCount: 0 },
        }),
    })),
  },
  KeychainMutations: {
    useAddKeychainToEService: () => ({ mutateAsync: addKeychainToEService }),
    useRemoveKeychainFromEService: () => ({ mutateAsync: removeKeychainFromEService }),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

const stepProps = { back: vi.fn(), forward: vi.fn(), activeStep: 2 }

describe('EServiceCreateStepTechSpec', () => {
  it('should render two sections', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceInterfaceSection')).toBeInTheDocument()
    expect(screen.getByText('EServiceVoucherSection')).toBeInTheDocument()
  })

  it('should render step actions', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('backWithoutSaveBtn')).toBeInTheDocument()
    expect(screen.getByText('forwardWithSaveBtn')).toBeInTheDocument()
  })

  it('should not call API when form data has not changed', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('forwardWithSaveBtn'))

    expect(updateVersionDraft).not.toHaveBeenCalled()
    expect(updateInstanceVersionDraft).not.toHaveBeenCalled()
  })

  it('should call updateVersionDraft API when form data has been changed', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(screen.getByTestId('voucher-lifespan'), '2')
    await userEvent.click(screen.getByText('forwardWithSaveBtn'))

    expect(updateVersionDraft).toHaveBeenCalled()
    expect(updateInstanceVersionDraft).not.toHaveBeenCalled()
  })

  it('should call updateInstanceVersionDraft API when form data has been changed (e-service created from template)', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(screen.getByTestId('voucher-lifespan'), '2')
    await userEvent.click(screen.getByText('forwardWithSaveBtn'))

    expect(updateVersionDraft).not.toHaveBeenCalled()
    expect(updateInstanceVersionDraft).toHaveBeenCalled()
  })

  it('should render the producer keychain section when e-service is async', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync(),
    })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceProducerKeychainSection')).toBeInTheDocument()
  })

  it('should NOT render the producer keychain section when e-service is not async', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.queryByText('EServiceProducerKeychainSection')).not.toBeInTheDocument()
  })

  it('should NOT render the producer keychain section in template instance flow even if async', () => {
    const baseAsync = createMockEServiceDescriptorProviderAsync()
    const withTemplate = createMockEServiceDescriptorProviderWithTemplateRef()
    mockUseEServiceCreateContext({
      descriptor: {
        ...baseAsync,
        templateRef: withTemplate.templateRef,
      },
    })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.queryByText('EServiceProducerKeychainSection')).not.toBeInTheDocument()
  })
})
