import React from 'react'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceDetails, EServiceDetailsSkeleton } from '../EServiceDetails'
import {
  createMockEServiceDescriptorCatalog,
  createMockEServiceDescriptorProvider,
} from '@/../__mocks__/data/eservice.mocks'
import { render } from '@testing-library/react'

describe('EServiceDetails', () => {
  it('should match the snapshot (provider)', () => {
    mockUseCurrentRoute({ mode: 'provider' })
    const { baseElement } = renderWithApplicationContext(
      <EServiceDetails descriptor={createMockEServiceDescriptorProvider()} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (consumer)', () => {
    mockUseCurrentRoute({ mode: 'consumer' })
    const { baseElement } = renderWithApplicationContext(
      <EServiceDetails descriptor={createMockEServiceDescriptorCatalog()} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('EServiceDetailsSkeleton', () => {
  it('should match the snapshot (provider)', () => {
    mockUseCurrentRoute({ mode: 'provider' })
    const { baseElement } = render(<EServiceDetailsSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (consumer)', () => {
    mockUseCurrentRoute({ mode: 'consumer' })
    const { baseElement } = render(<EServiceDetailsSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
