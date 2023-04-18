import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerEServiceCatalogPage from '../ConsumerEServiceCatalog.page'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import type { CatalogEServices } from '@/api/api.generatedTypes'

const mockUseGetCatalogList = (results?: Array<CatalogEServices>, isFetching = false) => {
  vi.spyOn(EServiceQueries, 'useGetCatalogList').mockReturnValue({
    data: results
      ? {
          results,
          pagination: {
            totalCount: results.length,
            limit: 50,
            offset: 0,
          },
        }
      : undefined,
    isFetching,
  } as unknown as ReturnType<typeof EServiceQueries.useGetCatalogList>)
}

describe('ConsumerEServiceCatalogPage', () => {
  it('should match the snapshot', () => {
    mockUseGetCatalogList([])

    const { baseElement } = renderWithApplicationContext(<ConsumerEServiceCatalogPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot in loading state', () => {
    mockUseGetCatalogList(undefined, true)

    const { baseElement } = renderWithApplicationContext(<ConsumerEServiceCatalogPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})
