import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { render, waitFor } from '@testing-library/react'
import { ClientTable, ClientTableSkeleton } from '../ClientTable'
import * as useClientKindHook from '@/hooks/useClientKind'
import { vi } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { CompactClients } from '@/api/api.generatedTypes'

vi.spyOn(useClientKindHook, 'useClientKind').mockReturnValue('API')
mockUseJwt()

describe('ClientTable', () => {
  it.only('should match the snapshot', async () => {
    const fullStateServer = setupServer(
      rest.get(`${BACKEND_FOR_FRONTEND_URL}/clients`, (req, res, ctx) => {
        return res(
          ctx.json<CompactClients>({
            results: [
              {
                id: '1',
                name: 'client1',
                hasKeys: true,
              },
              {
                id: '2',
                name: 'client2',
                hasKeys: true,
              },
            ],
            pagination: {
              totalCount: 2,
              limit: 10,
              offset: 0,
            },
          })
        )
      })
    )
    fullStateServer.listen()
    const screen = renderWithApplicationContext(<ClientTable clientKind="API" />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => screen.getByText('client1'))
    expect(screen.baseElement).toMatchSnapshot('full state')
    fullStateServer.resetHandlers()
    fullStateServer.close()
  })

  it.only('should match the snapshot in empty state', async () => {
    const emptyStateServer = setupServer(
      rest.get(`${BACKEND_FOR_FRONTEND_URL}/clients`, (req, res, ctx) => {
        return res(
          ctx.json<CompactClients>({
            results: [],
            pagination: {
              totalCount: 0,
              limit: 10,
              offset: 0,
            },
          })
        )
      })
    )
    emptyStateServer.listen()
    const screen = renderWithApplicationContext(<ClientTable clientKind="API" />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    await waitFor(() => screen.getByRole('alert'))
    expect(screen.baseElement).toMatchSnapshot()
    emptyStateServer.resetHandlers()
    emptyStateServer.close()
  })
})

describe('ClientTableSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ClientTableSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
