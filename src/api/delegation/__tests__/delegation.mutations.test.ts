import { vi } from 'vitest'
import { AxiosError } from 'axios'
import { DUPLICATE_INSTANCE_LABEL_ERROR_CODE } from '../../eserviceTemplate/eserviceTemplate.mutations'

const capturedMutationOptions: Array<Record<string, unknown>> = []

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useMutation: (options: Record<string, unknown>) => {
      capturedMutationOptions.push(options)
      return actual.useMutation(options)
    },
  }
})

vi.mock('../delegation.services', () => ({
  DelegationServices: {
    createProducerDelegationAndEserviceFromTemplate: vi.fn(),
  },
}))

import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { DelegationMutations } from '../delegation.mutations'

afterEach(() => {
  capturedMutationOptions.length = 0
  vi.clearAllMocks()
})

describe('useCreateProducerDelegationAndEserviceFromTemplate', () => {
  it('suppresses error toast for duplicate instance label error', () => {
    renderHookWithApplicationContext(
      () => DelegationMutations.useCreateProducerDelegationAndEserviceFromTemplate(),
      { withReactQueryContext: true }
    )

    const options = capturedMutationOptions.find(
      (opt) => typeof (opt.meta as Record<string, unknown>)?.errorToastLabel === 'function'
    )

    expect(options).toBeDefined()

    const errorToastLabel = (options!.meta as Record<string, unknown>).errorToastLabel as (
      error: unknown
    ) => string

    const duplicateError = new AxiosError('test', undefined, undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: { errors: [{ code: DUPLICATE_INSTANCE_LABEL_ERROR_CODE }] },
      headers: {},
      config: {} as never,
    })

    expect(errorToastLabel(duplicateError)).toBe('')
  })

  it('returns default error label for non-duplicate errors', () => {
    renderHookWithApplicationContext(
      () => DelegationMutations.useCreateProducerDelegationAndEserviceFromTemplate(),
      { withReactQueryContext: true }
    )

    const options = capturedMutationOptions.find(
      (opt) => typeof (opt.meta as Record<string, unknown>)?.errorToastLabel === 'function'
    )

    const errorToastLabel = (options!.meta as Record<string, unknown>).errorToastLabel as (
      error: unknown
    ) => string

    expect(errorToastLabel(new Error('generic error'))).toBe('outcome.error')
  })
})
