import React from 'react'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  ProviderAgreementsTableRow,
  ProviderAgreementsTableRowSkeleton,
} from '../ProviderAgreementsTableRow'
import { render } from '@testing-library/react'
import { createMockAgreementListingItem } from '__mocks__/data/agreement.mocks'
import userEvent from '@testing-library/user-event'

mockUseCurrentRoute({ mode: 'provider' })

describe('ProviderAgreementsTableRow', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <ProviderAgreementsTableRow agreement={createMockAgreementListingItem()} />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it("should go to agreement's details page on inspect button click", async () => {
    const screen = renderWithApplicationContext(
      <ProviderAgreementsTableRow agreement={createMockAgreementListingItem()} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const user = userEvent.setup()
    const inspectButton = screen.getByRole('button', { name: 'inspect' })

    await user.click(inspectButton)
    expect(screen.history.location.pathname).toBe(
      '/it/erogazione/richieste/5f75fe14-3f71-442b-8098-d3021b399deb'
    )
  })
})

describe('ProviderAgreementsTableRowSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ProviderAgreementsTableRowSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
