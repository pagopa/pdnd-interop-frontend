import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ProviderEServiceListPage from '../ProviderEServiceList.page'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import userEvent from '@testing-library/user-event'

mockUseJwt()
const useGetProviderListSpy = vi.spyOn(EServiceQueries, 'useGetProviderList')

describe('ProviderEServiceListPage', () => {
  it('should match the snapshot', () => {
    useGetProviderListSpy.mockReturnValue({
      data: {
        results: [],
        pagination: {
          totalCount: 0,
          limit: 10,
          offset: 0,
        },
      },
      isFetching: false,
    } as unknown as ReturnType<typeof EServiceQueries.useGetProviderList>)
    const { baseElement } = renderWithApplicationContext(<ProviderEServiceListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot in loading state', () => {
    useGetProviderListSpy.mockReturnValue({
      data: undefined,
      isFetching: true,
    } as unknown as ReturnType<typeof EServiceQueries.useGetProviderList>)
    const { baseElement } = renderWithApplicationContext(<ProviderEServiceListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should have the create new e-service button if user is admin', async () => {
    useGetProviderListSpy.mockReturnValue({
      data: {
        results: [],
        pagination: {
          totalCount: 0,
          limit: 10,
          offset: 0,
        },
      },
      isFetching: false,
    } as unknown as ReturnType<typeof EServiceQueries.useGetProviderList>)

    mockUseJwt({ isAdmin: true, isOperatorAPI: false })

    const screen = renderWithApplicationContext(<ProviderEServiceListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const createNewBtn = screen.getByRole('link', { name: 'createNewBtn' })
    await user.click(createNewBtn)

    expect(screen.history.location.pathname).toBe('/it/erogazione/e-service/crea')
  })

  it('should have the create new e-service button if user is API operator', async () => {
    useGetProviderListSpy.mockReturnValue({
      data: {
        results: [],
        pagination: {
          totalCount: 0,
          limit: 10,
          offset: 0,
        },
      },
      isFetching: false,
    } as unknown as ReturnType<typeof EServiceQueries.useGetProviderList>)

    mockUseJwt({ isAdmin: false, isOperatorAPI: true })

    const screen = renderWithApplicationContext(<ProviderEServiceListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const createNewBtn = screen.getByRole('link', { name: 'createNewBtn' })
    await user.click(createNewBtn)

    expect(screen.history.location.pathname).toBe('/it/erogazione/e-service/crea')
  })

  it('should not have the create new e-service button if user is neither API operator or admin', async () => {
    useGetProviderListSpy.mockReturnValue({
      data: {
        results: [],
        pagination: {
          totalCount: 0,
          limit: 10,
          offset: 0,
        },
      },
      isFetching: false,
    } as unknown as ReturnType<typeof EServiceQueries.useGetProviderList>)

    mockUseJwt({ isAdmin: false, isOperatorAPI: false })

    const screen = renderWithApplicationContext(<ProviderEServiceListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.queryByRole('link', { name: 'createNewBtn' })).not.toBeInTheDocument()
  })
})
