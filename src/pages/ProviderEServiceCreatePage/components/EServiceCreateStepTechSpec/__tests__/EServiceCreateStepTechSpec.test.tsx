import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen, waitFor } from '@testing-library/react'
import { EServiceCreateStepTechSpec } from '../EServiceCreateStepTechSpec'
import { useFieldArray, useFormContext } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import { KeychainQueries } from '@/api/keychain'
import { queryClient } from '@/config/query-client'
import {
  createMockEServiceDescriptorProviderWithTemplateRef,
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderAsync,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'

const useRemoveKeychainFromEService = vi.hoisted(() => vi.fn())

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
  EServiceProducerKeychainSection: () => {
    const { control } = useFormContext()
    const { fields, append, remove } = useFieldArray({ control, name: 'keychains' })

    return (
      <div>
        <div>EServiceProducerKeychainSection</div>
        <ul data-testid="keychain-list">
          {fields.map((field, index) => {
            const value = (field as unknown as { value: { id: string; name: string } | null }).value
            return (
              <li key={field.id} data-testid={`keychain-row-${value?.id ?? 'empty'}`}>
                <span>{value?.name ?? 'empty'}</span>
                <button type="button" onClick={() => remove(index)}>
                  remove-{value?.id ?? 'empty'}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() => append({ value: { id: 'k3', name: 'Keychain 3', hasKeys: false } })}
        >
          add-k3
        </button>
      </div>
    )
  },
}))

vi.mock('../../sections/EServiceAsyncExchangeSection', () => ({
  EServiceAsyncExchangeSection: ({
    isEServiceCreatedFromTemplate,
  }: {
    isEServiceCreatedFromTemplate?: boolean
  }) => (
    <div>
      EServiceAsyncExchangeSection
      {isEServiceCreatedFromTemplate ? '-template' : ''}
    </div>
  ),
}))

const updateVersionDraft = vi.fn()
const updateInstanceVersionDraft = vi.fn()
const addKeychainToEService = vi.fn().mockResolvedValue(undefined)
const removeKeychainFromEService = vi.fn().mockResolvedValue(undefined)

useRemoveKeychainFromEService.mockReturnValue({ mutateAsync: removeKeychainFromEService })

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateVersionDraft: () => ({ mutate: updateVersionDraft }),
    useUpdateInstanceVersionDraft: () => ({ mutate: updateInstanceVersionDraft }),
  },
}))

vi.mock('@/api/keychain', () => ({
  KeychainQueries: {
    getAllKeychainsList: vi.fn((params: { eserviceId?: string }) => ({
      queryKey: ['KeychainGetAllList', params],
      queryFn: () => Promise.resolve([]),
    })),
  },
  KeychainMutations: {
    useAddKeychainToEService: () => ({ mutateAsync: addKeychainToEService }),
    useRemoveKeychainFromEService,
  },
}))

afterEach(() => {
  vi.clearAllMocks()
  queryClient.clear()
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

  it('should render the skeleton while the associated keychains query is pending (async e-service)', () => {
    ;(KeychainQueries.getAllKeychainsList as Mock).mockImplementationOnce(
      (params: { eserviceId?: string }) => ({
        queryKey: ['KeychainGetAllList', params],
        queryFn: () => new Promise(() => {}),
      })
    )

    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync(),
    })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByText('EServiceInterfaceSection')).not.toBeInTheDocument()
    expect(screen.queryByText('EServiceProducerKeychainSection')).not.toBeInTheDocument()
  })

  it('should render the producer keychain section when e-service is async', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync(),
    })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(await screen.findByText('EServiceProducerKeychainSection')).toBeInTheDocument()
  })

  it('should configure keychain removals without confirmation dialog', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync(),
    })

    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await screen.findByText('EServiceProducerKeychainSection')

    expect(useRemoveKeychainFromEService).toHaveBeenCalledWith({
      withConfirmationDialog: false,
    })
  })

  it('should render neither the producer keychain section nor the async exchange section when asyncExchange is false', () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.queryByText('EServiceProducerKeychainSection')).not.toBeInTheDocument()
    expect(screen.queryByText('EServiceAsyncExchangeSection')).not.toBeInTheDocument()
  })

  it('should render the async exchange section when asyncExchange is true', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProviderAsync() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(await screen.findByText('EServiceAsyncExchangeSection')).toBeInTheDocument()
  })

  it('should NOT call keychain mutations on submit when e-service is not editable (version > 1)', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync(),
      areEServiceGeneralInfoEditable: false,
    })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(await screen.findByText('forwardWithSaveBtn'))

    expect(addKeychainToEService).not.toHaveBeenCalled()
    expect(removeKeychainFromEService).not.toHaveBeenCalled()
  })

  it('should call add/remove keychain mutations for the diff and then forward on success', async () => {
    ;(KeychainQueries.getAllKeychainsList as Mock).mockImplementationOnce(
      (params: { eserviceId?: string }) => ({
        queryKey: ['KeychainGetAllList', params],
        queryFn: () =>
          Promise.resolve([
            { id: 'k1', name: 'Keychain 1', hasKeys: false },
            { id: 'k2', name: 'Keychain 2', hasKeys: false },
          ]),
      })
    )

    const forward = vi.fn()
    const descriptor = createMockEServiceDescriptorProviderAsync()
    mockUseEServiceCreateContext({ descriptor, forward })

    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    // Wait for the initial associated keychains to load and the form to render.
    await screen.findByTestId('keychain-row-k1')
    await screen.findByTestId('keychain-row-k2')

    // Remove k2 and add k3.
    await userEvent.click(screen.getByRole('button', { name: 'remove-k2' }))
    await userEvent.click(screen.getByRole('button', { name: 'add-k3' }))

    await userEvent.click(screen.getByText('forwardWithSaveBtn'))

    await waitFor(() => {
      expect(addKeychainToEService).toHaveBeenCalledWith({
        keychainId: 'k3',
        eserviceId: descriptor.eservice.id,
      })
    })
    expect(removeKeychainFromEService).toHaveBeenCalledWith({
      keychainId: 'k2',
      eserviceId: descriptor.eservice.id,
    })
    // No leftover unintended add calls.
    expect(addKeychainToEService).toHaveBeenCalledTimes(1)
    expect(removeKeychainFromEService).toHaveBeenCalledTimes(1)
    // After a successful diff, the descriptor update is attempted (here no other field changed,
    // so forward fires directly).
    await waitFor(() => expect(forward).toHaveBeenCalled())
    expect(
      queryClient.getQueryData(['KeychainGetAllList', { eserviceId: descriptor.eservice.id }])
    ).toEqual([
      { id: 'k1', name: 'Keychain 1', hasKeys: false },
      { id: 'k3', name: 'Keychain 3', hasKeys: false },
    ])
  })

  it('should NOT navigate forward when any keychain mutation rejects', async () => {
    ;(KeychainQueries.getAllKeychainsList as Mock).mockImplementationOnce(
      (params: { eserviceId?: string }) => ({
        queryKey: ['KeychainGetAllList', params],
        queryFn: () => Promise.resolve([{ id: 'k1', name: 'Keychain 1', hasKeys: false }]),
      })
    )
    addKeychainToEService.mockRejectedValueOnce(new Error('boom'))

    const forward = vi.fn()
    const descriptor = createMockEServiceDescriptorProviderAsync()
    mockUseEServiceCreateContext({ descriptor, forward })

    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await screen.findByTestId('keychain-row-k1')

    await userEvent.click(screen.getByRole('button', { name: 'add-k3' }))
    await userEvent.click(screen.getByText('forwardWithSaveBtn'))

    await waitFor(() => expect(addKeychainToEService).toHaveBeenCalled())

    // Submission must short-circuit: descriptor update and forward are not invoked.
    expect(updateVersionDraft).not.toHaveBeenCalled()
    expect(updateInstanceVersionDraft).not.toHaveBeenCalled()
    expect(forward).not.toHaveBeenCalled()
  })

  it('template-instance flow with asyncExchange should render the async exchange section but NOT the producer keychain section', () => {
    mockUseEServiceCreateContext({
      descriptor: {
        ...createMockEServiceDescriptorProviderAsync(),
        templateRef: createMockEServiceDescriptorProviderWithTemplateRef().templateRef,
      },
    })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.queryByText('EServiceProducerKeychainSection')).not.toBeInTheDocument()
    expect(screen.getByText(/EServiceAsyncExchangeSection-template/)).toBeInTheDocument()
  })

  it('should not include asyncExchangeProperties in payload when numeric fields are empty', async () => {
    mockUseEServiceCreateContext({
      descriptor: {
        ...createMockEServiceDescriptorProviderAsync(),
        asyncExchangeProperties: undefined,
      },
    })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(await screen.findByTestId('voucher-lifespan'), '2')
    await userEvent.click(screen.getByText('forwardWithSaveBtn'))

    expect(updateVersionDraft).toHaveBeenCalledWith(
      expect.not.objectContaining({ asyncExchangeProperties: expect.anything() }),
      expect.any(Object)
    )
  })

  it('should include asyncExchangeProperties in payload when asyncExchange is true', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProviderAsync() })
    renderWithApplicationContext(<EServiceCreateStepTechSpec {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(await screen.findByTestId('voucher-lifespan'), '2')
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
