import React from 'react'
import { createMockRemappedTenant } from '__mocks__/data/user.mocks'
import { mockGetActiveUserPartySpy } from './test.commons'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  CertifiedPartyAttributesList,
  CertifiedPartyAttributesListSkeleton,
} from '../CertifiedPartyAttributesList'
import { render } from '@testing-library/react'

describe('CertifiedPartyAttributesList', () => {
  it('should match snapshot', () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())

    const { baseElement } = renderWithApplicationContext(<CertifiedPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with no attributes', () => {
    mockGetActiveUserPartySpy(undefined)

    const { baseElement } = renderWithApplicationContext(<CertifiedPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

describe('CertifiedPartyAttributesListSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<CertifiedPartyAttributesListSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
