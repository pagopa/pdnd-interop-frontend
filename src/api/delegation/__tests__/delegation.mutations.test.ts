import { vi } from 'vitest'
import { AxiosError } from 'axios'
import { DUPLICATE_ESERVICENAME_ERROR_CODE } from '../../eserviceTemplate/eserviceTemplate.mutations'

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

const {
  mockCreateProducerDelegationAndEservice,
  mockCreateProducerDelegationAndEserviceFromTemplate,
} = vi.hoisted(() => ({
  mockCreateProducerDelegationAndEservice: vi.fn(),
  mockCreateProducerDelegationAndEserviceFromTemplate: vi.fn(),
}))

vi.mock('../delegation.services', () => ({
  DelegationServices: {
    createProducerDelegationAndEservice: mockCreateProducerDelegationAndEservice,
    createProducerDelegationAndEserviceFromTemplate:
      mockCreateProducerDelegationAndEserviceFromTemplate,
  },
}))

import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { DelegationMutations } from '../delegation.mutations'

afterEach(() => {
  capturedMutationOptions.length = 0
  vi.clearAllMocks()
})

function getErrorToastLabel(mutationFn: unknown) {
  const options = capturedMutationOptions.find((opt) => opt.mutationFn === mutationFn)
  expect(options).toBeDefined()
  return (options!.meta as Record<string, unknown>).errorToastLabel as (error: unknown) => string
}

function makeDuplicateError() {
  return new AxiosError('test', undefined, undefined, undefined, {
    status: 400,
    statusText: 'Bad Request',
    data: { errors: [{ code: DUPLICATE_ESERVICENAME_ERROR_CODE }] },
    headers: {},
    config: {} as never,
  })
}

describe('useCreateProducerDelegationAndEserviceFromTemplate', () => {
  it('suppresses error toast for duplicate instance label error', () => {
    renderHookWithApplicationContext(
      () => DelegationMutations.useCreateProducerDelegationAndEserviceFromTemplate(),
      { withReactQueryContext: true }
    )

    const errorToastLabel = getErrorToastLabel(mockCreateProducerDelegationAndEserviceFromTemplate)

    expect(errorToastLabel(makeDuplicateError())).toBe('')
  })

  it('returns default error label for non-duplicate errors', () => {
    renderHookWithApplicationContext(
      () => DelegationMutations.useCreateProducerDelegationAndEserviceFromTemplate(),
      { withReactQueryContext: true }
    )

    const errorToastLabel = getErrorToastLabel(mockCreateProducerDelegationAndEserviceFromTemplate)

    expect(errorToastLabel(new Error('generic error'))).toBe('outcome.error')
  })
})

describe('useCreateProducerDelegationAndEservice', () => {
  it('suppresses error toast for duplicate eservice name error', () => {
    renderHookWithApplicationContext(
      () => DelegationMutations.useCreateProducerDelegationAndEservice(),
      { withReactQueryContext: true }
    )

    const errorToastLabel = getErrorToastLabel(mockCreateProducerDelegationAndEservice)

    expect(errorToastLabel(makeDuplicateError())).toBe('')
  })

  it('returns default error label for non-duplicate errors', () => {
    renderHookWithApplicationContext(
      () => DelegationMutations.useCreateProducerDelegationAndEservice(),
      { withReactQueryContext: true }
    )

    const errorToastLabel = getErrorToastLabel(mockCreateProducerDelegationAndEservice)

    expect(errorToastLabel(new Error('generic error'))).toBe('outcome.error')
  })
})
