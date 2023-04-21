import React from 'react'
import { render } from '@testing-library/react'
import {
  ConsumerAgreementsTable,
  ConsumerAgreementsTableSkeleton,
} from '../ConsumerAgreementsTable'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockAgreementListingItem } from '__mocks__/data/agreement.mocks'

mockUseCurrentRoute({ mode: 'provider' })

describe('ConsumerAgreementsTable', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <ConsumerAgreementsTable
        agreements={[
          createMockAgreementListingItem({ id: '1' }),
          createMockAgreementListingItem({ id: '2' }),
        ]}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot on empty state', () => {
    const { baseElement } = renderWithApplicationContext(
      <ConsumerAgreementsTable agreements={[]} />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ConsumerAgreementsTableSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ConsumerAgreementsTableSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
