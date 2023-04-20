import React from 'react'
import { render } from '@testing-library/react'
import {
  ProviderAgreementsTable,
  ProviderAgreementsTableSkeleton,
} from '../ProviderAgreementsTable'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockAgreementListingItem } from '__mocks__/data/agreement.mocks'

mockUseCurrentRoute({ mode: 'provider' })

describe('ProviderAgreementsTable', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <ProviderAgreementsTable
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
      <ProviderAgreementsTable agreements={[]} />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ProviderAgreementsTableSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ProviderAgreementsTableSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
