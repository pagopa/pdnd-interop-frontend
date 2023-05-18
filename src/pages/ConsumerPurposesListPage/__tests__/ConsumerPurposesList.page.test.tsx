import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerPurposesListPage from '../ConsumerPurposesList.page'
import { vi } from 'vitest'
import { PurposeQueries } from '@/api/purpose'
import { EServiceQueries } from '@/api/eservice'

mockUseJwt()
const useGetProviderListSpy = vi.spyOn(PurposeQueries, 'useGetConsumersList')

describe('ConsumerPurposesListPage', () => {
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
    } as unknown as ReturnType<typeof PurposeQueries.useGetConsumersList>)
    const { baseElement } = renderWithApplicationContext(<ConsumerPurposesListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot in loading state', () => {
    useGetProviderListSpy.mockReturnValue({
      data: undefined,
      isFetching: true,
    } as unknown as ReturnType<typeof PurposeQueries.useGetConsumersList>)
    const { baseElement } = renderWithApplicationContext(<ConsumerPurposesListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should render create new purpose button if user is admin', () => {
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
    } as unknown as ReturnType<typeof PurposeQueries.useGetConsumersList>)
    const screen = renderWithApplicationContext(<ConsumerPurposesListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.getByRole('button', { name: 'createNewBtn' })).toBeInTheDocument()
  })

  it('should render an info tooltip if there are no active e-service', () => {
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
    } as unknown as ReturnType<typeof PurposeQueries.useGetConsumersList>)

    vi.spyOn(EServiceQueries, 'useGetCatalogList').mockReturnValue({
      data: { results: [] },
    } as unknown as ReturnType<typeof EServiceQueries.useGetCatalogList>)

    const screen = renderWithApplicationContext(<ConsumerPurposesListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.getByLabelText('cantCreatePurposeTooltip')).toBeInTheDocument()
  })

  it('should not render create new purpose button if user is not admin', () => {
    mockUseJwt({ isAdmin: false })
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
    } as unknown as ReturnType<typeof PurposeQueries.useGetConsumersList>)
    const screen = renderWithApplicationContext(<ConsumerPurposesListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.queryByRole('button', { name: 'createNewBtn' })).not.toBeInTheDocument()
  })
})
