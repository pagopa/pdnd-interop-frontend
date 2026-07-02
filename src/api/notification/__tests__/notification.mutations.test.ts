import { act, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import type * as ReactQuery from '@tanstack/react-query'

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

const { mockMarkNotificationsAsReadByEntityId } = vi.hoisted(() => ({
  mockMarkNotificationsAsReadByEntityId: vi.fn(),
}))

vi.mock('../notification.services', () => ({
  NotificationServices: {
    markNotificationsAsReadByEntityId: mockMarkNotificationsAsReadByEntityId,
  },
}))

import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { NotificationMutations } from '../notification.mutations'

afterEach(() => {
  capturedMutationOptions.length = 0
  vi.clearAllMocks()
})

describe('useMarkNotificationsAsReadByEntityId', () => {
  it('opts out from active queries polling', () => {
    renderHookWithApplicationContext(
      () => NotificationMutations.useMarkNotificationsAsReadByEntityId(),
      { withReactQueryContext: true }
    )

    expect(capturedMutationOptions).toContainEqual(
      expect.objectContaining({
        retry: false,
        meta: { skipActiveQueriesPolling: true },
      })
    )
  })

  it('marks notifications as read for the provided entity', async () => {
    const { result } = renderHookWithApplicationContext(
      () => NotificationMutations.useMarkNotificationsAsReadByEntityId(),
      { withReactQueryContext: true }
    )

    act(() => {
      result.current.mutate({ entityId: 'entity-id' })
    })

    await waitFor(() => {
      expect(mockMarkNotificationsAsReadByEntityId).toHaveBeenCalledWith({
        entityId: 'entity-id',
      })
    })
  })
})
