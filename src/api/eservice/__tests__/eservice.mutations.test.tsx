import { EServiceMutations } from '../eservice.mutations'
import { queryClient } from '@/config/query-client'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'

vi.mock('../eservice.services', () => ({
  EServiceServices: {
    submitDelegatedArchivingVersionRequest: vi.fn(),
    cancelDelegatedArchivingVersionRequest: vi.fn(),
    cancelDelegatedArchivingEserviceRequest: vi.fn(),
    submitDelegatedArchivingRequest: vi.fn(),
    cancelDelegatedArchivingRequest: vi.fn(),
    approveDelegatedEServiceArchivingRequest: vi.fn(),
    rejectDelegatedEServiceArchivingRequest: vi.fn(),
    approveDelegatedVersionArchivingRequest: vi.fn(),
    rejectDelegatedVersionArchivingRequest: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: (_namespace: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => `${options?.keyPrefix}.${key}`,
  }),
}))

afterEach(() => {
  queryClient.clear()
})

describe('EServiceMutations delegated archiving toasts', () => {
  it('useRequestArchiveDescriptor uses dedicated request-archiving toast labels', () => {
    const { result } = renderHookWithApplicationContext(
      () => EServiceMutations.useRequestArchiveDescriptor(),
      { withReactQueryContext: true }
    )

    result.current.mutate({
      eserviceId: 'eservice-id',
      descriptorId: 'descriptor-id',
      gracePeriodDays: 60,
    })

    const mutationMeta = queryClient.getMutationCache().getAll().at(-1)?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.requestArchiveDescriptor.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe('eservice.requestArchiveDescriptor.outcome.error')
  })

  it('useCancelDelegatedArchivingVersionRequest uses dedicated version cancel-request toast labels', () => {
    const { result } = renderHookWithApplicationContext(
      () => EServiceMutations.useCancelDelegatedArchivingVersionRequest(),
      { withReactQueryContext: true }
    )

    result.current.mutate({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' })

    const mutationMeta = queryClient.getMutationCache().getAll().at(-1)?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.cancelDelegatedArchivingVersionRequest.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe(
      'eservice.cancelDelegatedArchivingVersionRequest.outcome.error'
    )
  })

  it('useCancelDelegatedEserviceArchivingRequest uses dedicated e-service cancel-request toast labels', () => {
    const { result } = renderHookWithApplicationContext(
      () => EServiceMutations.useCancelDelegatedEserviceArchivingRequest(),
      { withReactQueryContext: true }
    )

    result.current.mutate({ eserviceId: 'eservice-id' })

    const mutationMeta = queryClient.getMutationCache().getAll().at(-1)?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.cancelDelegatedEserviceArchivingRequest.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe(
      'eservice.cancelDelegatedEserviceArchivingRequest.outcome.error'
    )
  })
})

describe('EServiceMutations delegator archiving toasts', () => {
  it('useApproveDelegatedArchivingEServiceRequest uses dedicated approve-request-archiving-eservice toast labels', () => {
    const { result } = renderHookWithApplicationContext(
      () => EServiceMutations.useApproveDelegatedArchivingEServiceRequest({ days: 60 }),
      { withReactQueryContext: true }
    )

    result.current.mutate({
      eserviceId: 'eservice-id',
    })

    const mutationMeta = queryClient.getMutationCache().getAll().at(-1)?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.approveDelegatedArchivingEService.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe(
      'eservice.approveDelegatedArchivingEService.outcome.error'
    )
  })

  it('useRejectDelegatedArchivingEServiceRequest uses dedicated reject-request-archiving-eservice toast labels', () => {
    const { result } = renderHookWithApplicationContext(
      () => EServiceMutations.useRejectDelegatedArchivingEServiceRequest(),
      { withReactQueryContext: true }
    )

    result.current.mutate({ eserviceId: 'eservice-id', rejectReason: 'reject-reason' })

    const mutationMeta = queryClient.getMutationCache().getAll().at(-1)?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.rejectDelegatedArchivingEService.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe(
      'eservice.rejectDelegatedArchivingEService.outcome.error'
    )
  })

  it('useApproveDelegatedArchivingVersionRequest uses dedicated approve-request-archiving-version toast labels', () => {
    const { result } = renderHookWithApplicationContext(
      () => EServiceMutations.useApproveDelegatedArchivingVersionRequest({ days: 60 }),
      { withReactQueryContext: true }
    )

    result.current.mutate({
      eserviceId: 'eservice-id',
      descriptorId: 'descriptor-id',
    })

    const mutationMeta = queryClient.getMutationCache().getAll().at(-1)?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.approveDelegatedArchivingVersion.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe(
      'eservice.approveDelegatedArchivingVersion.outcome.error'
    )
  })

  it('useRejectDelegatedArchivingVersionRequest uses dedicated reject-request-archiving-version toast labels', () => {
    const { result } = renderHookWithApplicationContext(
      () => EServiceMutations.useRejectDelegatedArchivingVersionRequest(),
      { withReactQueryContext: true }
    )

    result.current.mutate({
      eserviceId: 'eservice-id',
      descriptorId: 'descriptor-id',
      rejectReason: 'reject-reason',
    })

    const mutationMeta = queryClient.getMutationCache().getAll().at(-1)?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.rejectDelegatedArchivingVersion.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe(
      'eservice.rejectDelegatedArchivingVersion.outcome.error'
    )
  })
})
