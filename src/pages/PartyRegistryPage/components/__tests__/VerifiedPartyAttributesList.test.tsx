import React from 'react'
import { createMockRemappedTenant } from '__mocks__/data/user.mocks'
import { mockGetActiveUserPartySpy } from './test.commons'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  VerifiedPartyAttributesList,
  VerifiedPartyAttributesListSkeleton,
} from '../VerifiedPartyAttributesList'
import { render } from '@testing-library/react'

describe('VerifiedPartyAttributesList', () => {
  it('should match snapshot', () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())

    const { baseElement } = renderWithApplicationContext(<VerifiedPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with no attributes', () => {
    mockGetActiveUserPartySpy(undefined)

    const { baseElement } = renderWithApplicationContext(<VerifiedPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

describe('VerifiedPartyAttributesListSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<VerifiedPartyAttributesListSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
