import React from 'react'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { ConsumerPurposesTable, ConsumerPurposesTableSkeleton } from '../ConsumerPurposesTable'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('ConsumerPurposesTable', () => {
  it('should match the snapshot', () => {
    const purposeMock = createMockPurpose({ id: 'test-id' })

    const { baseElement } = renderWithApplicationContext(
      <ConsumerPurposesTable purposes={[purposeMock]} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot when purposes is empty', () => {
    const { baseElement } = renderWithApplicationContext(<ConsumerPurposesTable purposes={[]} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ConsumerPurposesTableSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(<ConsumerPurposesTableSkeleton />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})
