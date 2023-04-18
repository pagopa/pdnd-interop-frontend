import React from 'react'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from '../EServiceCatalogGrid'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { render } from '@testing-library/react'
import { createMockEServiceCatalog } from '__mocks__/data/eservice.mocks'

describe('EServiceCatalogGrid', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <EServiceCatalogGrid
        eservices={[createMockEServiceCatalog({ id: '1' }), createMockEServiceCatalog({ id: '2' })]}
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with no e-services', () => {
    const { baseElement } = render(<EServiceCatalogGrid eservices={[]} />)
    expect(baseElement).toMatchSnapshot()
  })
})

describe('EServiceCatalogGridSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<EServiceCatalogGridSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
