import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { EServiceCreateStepTechSpec } from '../EServiceCreateStepTechSpec'
import { useFormContext } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import {
  createMockEServiceDescriptorProviderAsync,
  createMockEServiceDescriptorProviderWithTemplateRef,
  createMockEServiceDescriptorProvider,
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

vi.mock('../../sections/EServiceAsyncExchangeSection', () => ({
  EServiceAsyncExchangeSection: () => <div>EServiceAsyncExchangeSection</div>,
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

  it('should not render the async exchange section when asyncExchange is false', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.queryByText('EServiceAsyncExchangeSection')).not.toBeInTheDocument()
  })

  it('should render the async exchange section when asyncExchange is true', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProviderAsync() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceAsyncExchangeSection')).toBeInTheDocument()
  })

  it('should include asyncExchangeProperties in payload when asyncExchange is true', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProviderAsync() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(screen.getByTestId('voucher-lifespan'), '2')
    await userEvent.click(screen.getByText('forwardWithSaveBtn'))

    expect(updateVersionDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        asyncExchangeProperties: expect.objectContaining({
          responseTime: expect.any(Number),
          resourceAvailableTime: expect.any(Number),
          maxResultSet: expect.any(Number),
          confirmation: expect.any(Boolean),
          bulk: expect.any(Boolean),
        }),
      }),
      expect.any(Object)
    )
  })
})
