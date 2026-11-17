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

function makeApiError(...codes: string[]) {
  return new AxiosError('test', undefined, undefined, undefined, {
    status: 400,
    statusText: 'Bad Request',
    data: { errors: codes.map((code) => ({ code })) },
    headers: {},
    config: {} as never,
  })
}

describe('useScheduleArchiveEservice', () => {
  it.each([['001-0070'], ['001-0001', '001-0070']])(
    'returns the contextual error label when the response includes the grace period error (%j)',
    (...codes) => {
      renderHookWithApplicationContext(() => EServiceMutations.useScheduleArchiveEservice(), {
        withReactQueryContext: true,
      })

      const errorToastLabel = getErrorToastLabel()

      expect(errorToastLabel(makeApiError(...codes))).toBe('outcome.gracePeriodError')
    }
  )

  it('returns the default error label for other errors', () => {
    renderHookWithApplicationContext(() => EServiceMutations.useScheduleArchiveEservice(), {
      withReactQueryContext: true,
    })

    const errorToastLabel = getErrorToastLabel()

    expect(errorToastLabel(new Error('generic error'))).toBe('outcome.error')
    expect(errorToastLabel(makeApiError('001-0001', '001-0002'))).toBe('outcome.error')
    expect(errorToastLabel(makeApiError())).toBe('outcome.error')
  })
})
