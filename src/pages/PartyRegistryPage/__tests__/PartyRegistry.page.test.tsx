import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import PartyRegistryPage from '../PartyRegistry.page'

describe('PartyRegistryPage', () => {
  it('should match snapshot', () => {
    mockUseJwt()
    const { container } = renderWithApplicationContext(<PartyRegistryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot when jwt is undefined', () => {
    mockUseJwt(undefined)
    const { container } = renderWithApplicationContext(<PartyRegistryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(container).toMatchSnapshot()
  })
})
