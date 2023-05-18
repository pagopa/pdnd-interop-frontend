import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ProviderPurposesListPage from '../ProviderPurposesList.page'
import { vi } from 'vitest'
import { PurposeQueries } from '@/api/purpose'

mockUseJwt()
const useGetProviderListSpy = vi.spyOn(PurposeQueries, 'useGetProducersList')

describe('ProviderPurposesListPage', () => {
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
    } as unknown as ReturnType<typeof PurposeQueries.useGetProducersList>)
    const { baseElement } = renderWithApplicationContext(<ProviderPurposesListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot in loading state', () => {
    useGetProviderListSpy.mockReturnValue({
      data: undefined,
      isFetching: true,
    } as unknown as ReturnType<typeof PurposeQueries.useGetProducersList>)
    const { baseElement } = renderWithApplicationContext(<ProviderPurposesListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})
