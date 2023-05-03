import React from 'react'
import {
  mockUseClientKind,
  mockUseJwt,
  mockUseRouteParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import ConsumerClientManagePage from '../ConsumerClientManage.page'

mockUseJwt({ isAdmin: true })
mockUseRouteParams({ clientId: 'clientId' })

describe('ConsumerClientManagePage (API)', () => {
  it('should match snapshot', () => {
    mockUseClientKind('API')
    const { baseElement } = renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ConsumerClientManagePage (CONSUMER)', () => {
  it('should match snapshot', () => {
    mockUseClientKind('CONSUMER')
    const { baseElement } = renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})
