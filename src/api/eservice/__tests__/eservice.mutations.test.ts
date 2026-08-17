import { AxiosError } from 'axios'
import { vi } from 'vitest'
import type * as ReactQuery from '@tanstack/react-query'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'

const capturedMutationOptions: Array<Record<string, unknown>> = []

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof ReactQuery>('@tanstack/react-query')
  return {
    ...actual,
    useMutation: (options: Record<string, unknown>) => {
      capturedMutationOptions.push(options)
      return actual.useMutation(options)
    },
  }
})

const { mockScheduleArchiveEservice } = vi.hoisted(() => ({
  mockScheduleArchiveEservice: vi.fn(),
}))

vi.mock('../eservice.services', () => ({
  EServiceServices: {
    scheduleArchiveEservice: mockScheduleArchiveEservice,
  },
}))

import { EServiceMutations } from '../eservice.mutations'

afterEach(() => {
  capturedMutationOptions.length = 0
  vi.clearAllMocks()
})

function getErrorToastLabel() {
  const options = capturedMutationOptions.find(
    (option) => option.mutationFn === mockScheduleArchiveEservice
  )
  expect(options).toBeDefined()
  return (options!.meta as Record<string, unknown>).errorToastLabel as (error: unknown) => string
}

function makeApiError(code: string) {
  return new AxiosError('test', undefined, undefined, undefined, {
    status: 400,
    statusText: 'Bad Request',
    data: { errors: [{ code }] },
    headers: {},
    config: {} as never,
  })
}

describe('useScheduleArchiveEservice', () => {
  it('returns the contextual error label when the grace period is lower than a descriptor', () => {
    renderHookWithApplicationContext(() => EServiceMutations.useScheduleArchiveEservice(), {
      withReactQueryContext: true,
    })

    const errorToastLabel = getErrorToastLabel()

    expect(errorToastLabel(makeApiError('001-0070'))).toBe('outcome.gracePeriodError')
  })

  it('returns the default error label for other errors', () => {
    renderHookWithApplicationContext(() => EServiceMutations.useScheduleArchiveEservice(), {
      withReactQueryContext: true,
    })

    const errorToastLabel = getErrorToastLabel()

    expect(errorToastLabel(new Error('generic error'))).toBe('outcome.error')
  })
})
