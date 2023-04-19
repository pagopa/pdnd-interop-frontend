import React from 'react'
import { mockUseJwt, renderWithApplicationContext, setupQueryServer } from '@/utils/testing.utils'
import { render, waitFor } from '@testing-library/react'
import { ClientTable, ClientTableSkeleton } from '../ClientTable'
import * as useClientKindHook from '@/hooks/useClientKind'
import { vi } from 'vitest'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { ClientQueries } from '@/api/client'

vi.spyOn(useClientKindHook, 'useClientKind').mockReturnValue('API')
mockUseJwt()

const useGetListSpy = vi.spyOn(ClientQueries, 'useGetList')

const server = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/clients`,
    result: {
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
    },
  },
])

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ClientTable', () => {
  it('should match the snapshot in loading state', async () => {
    const screen = renderWithApplicationContext(<ClientTable clientKind="API" />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match the snapshot', async () => {
    useGetListSpy.mockReturnValue({
      data: {
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
      },
    } as unknown as ReturnType<typeof ClientQueries.useGetList>)

    const screen = renderWithApplicationContext(<ClientTable clientKind="API" />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match the snapshot in empty state', async () => {
    useGetListSpy.mockReturnValue({
      data: {
        results: [],
        pagination: {
          totalCount: 0,
          limit: 10,
          offset: 0,
        },
      },
    } as unknown as ReturnType<typeof ClientQueries.useGetList>)
    const screen = renderWithApplicationContext(<ClientTable clientKind="API" />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    await waitFor(() => screen.getByRole('alert'))
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('ClientTableSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ClientTableSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
