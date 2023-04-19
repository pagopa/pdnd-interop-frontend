import React from 'react'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { ProviderPurposesTable, ProviderPurposesTableSkeleton } from '../ProviderPurposesTable'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('ProviderPurposesTable', () => {
  it('should match the snapshot', () => {
    const purposeMock = createMockPurpose({ id: 'test-id' })

    const { baseElement } = renderWithApplicationContext(
      <ProviderPurposesTable purposes={[purposeMock]} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot when purposes is empty', () => {
    const { baseElement } = renderWithApplicationContext(<ProviderPurposesTable purposes={[]} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ProviderPurposesTableSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(<ProviderPurposesTableSkeleton />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})
